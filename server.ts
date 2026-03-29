import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post('/api/payments/create', async (req, res) => {
    try {
      const { amount, description, planId, paymentMethod } = req.body;
      // Используем номер кошелька из переменных окружения или тот, что предоставил пользователь
      const wallet = process.env.YOOMONEY_WALLET || '4100119407733592';

      const returnUrl = `${process.env.APP_URL || 'http://localhost:3000'}?payment_success=true&plan=${planId}`;

      if (!wallet) {
        // Fallback for demo if wallet is not set
        console.warn('YOOMONEY_WALLET not set, simulating payment URL');
        return res.json({
          confirmation_url: returnUrl,
          payment_id: 'simulated_' + uuidv4()
        });
      }

      // Формируем ссылку на форму ЮMoney (Quickpay)
      // paymentType: PC - кошелек ЮMoney, AC - банковская карта (СБП обычно доступно внутри)
      const pType = paymentMethod === 'yoomoney' ? 'PC' : 'AC';

      const quickpayUrl = new URL('https://yoomoney.ru/quickpay/confirm');
      quickpayUrl.searchParams.append('receiver', wallet);
      quickpayUrl.searchParams.append('quickpay-form', 'shop');
      quickpayUrl.searchParams.append('targets', description);
      quickpayUrl.searchParams.append('paymentType', pType);
      quickpayUrl.searchParams.append('sum', amount.toString());
      quickpayUrl.searchParams.append('label', planId);
      quickpayUrl.searchParams.append('successURL', returnUrl);

      res.json({
        confirmation_url: quickpayUrl.toString(),
        payment_id: 'yoomoney_' + uuidv4()
      });

    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
