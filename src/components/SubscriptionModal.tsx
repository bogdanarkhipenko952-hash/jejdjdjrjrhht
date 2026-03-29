import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Crown, Star, ArrowRight, CreditCard } from 'lucide-react';
import { SubscriptionPlan } from '../App';

const PLANS = [
  {
    id: 'prime',
    name: 'Prime',
    price: '5',
    color: 'from-blue-500 to-indigo-600',
    features: ['Поиск в 2 раза быстрее', 'Доступ к закрытым чатам', 'Уведомления']
  },
  {
    id: 'prime-plus',
    name: 'Prime Plus',
    price: '10',
    color: 'from-amber-400 to-orange-600',
    features: ['Все из Prime', 'AI-генератор откликов', 'Без очереди', 'Без рекламы'],
    popular: true
  }
];

// Custom SVG Icons for YooMoney
const YooMoneyIcon = () => (
  <div className="w-5 h-5 bg-[#8000FF] rounded-md flex items-center justify-center text-white font-bold text-[10px]">
    Ю
  </div>
);

const Confetti = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: '50%', 
            y: '50%', 
            scale: 0 
          }}
          animate={{ 
            x: `${50 + (Math.random() - 0.5) * 120}%`, 
            y: `${50 + (Math.random() - 0.5) * 120}%`,
            scale: [0, 1, 0],
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: 1.5 + Math.random(), 
            ease: "easeOut" 
          }}
          className={`absolute w-3 h-3 rounded-sm ${['bg-blue-500', 'bg-amber-500', 'bg-green-500', 'bg-purple-500'][i % 4]}`}
        />
      ))}
    </div>
  );
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
  currentSubscription: SubscriptionPlan;
  initialShowSuccess?: boolean;
}

export default function SubscriptionModal({ isOpen, onClose, onSubscribe, currentSubscription, initialShowSuccess = false }: Props) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('prime-plus');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'yoomoney'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(initialShowSuccess);

  useEffect(() => {
    if (isOpen) {
      setShowSuccess(initialShowSuccess);
      if (initialShowSuccess) {
        // Автоматически закрываем модалку успеха через 3.5 секунды
        const timer = setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 3500);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, initialShowSuccess, onClose]);

  const selectedPlan = PLANS.find(p => p.id === selectedPlanId) || PLANS[1];

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    try {
      // Вызываем наш бэкенд для создания платежа в ЮMoney
      const baseUrl = process.env.APP_URL || '';
      const response = await fetch(`${baseUrl}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: selectedPlan.price,
          description: `Оплата тарифа ${selectedPlan.name}`,
          planId: selectedPlanId,
          paymentMethod: paymentMethod
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании платежа');
      }

      // Перенаправляем пользователя на реальную страницу оплаты ЮMoney/ЮKassa
      if (data.confirmation_url) {
        // Открываем форму оплаты в новой вкладке, так как ЮMoney блокирует открытие внутри iframe
        window.open(data.confirmation_url, '_blank');
        // Закрываем модалку и сбрасываем состояние загрузки
        setIsProcessing(false);
        onClose();
      } else {
        throw new Error('Не получен URL для оплаты');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Произошла ошибка при инициализации платежа. Пожалуйста, попробуйте позже.');
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!showSuccess ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 inset-x-0 bg-white rounded-t-[3rem] z-[101] max-h-[90vh] overflow-y-auto pb-10 shadow-2xl max-w-md mx-auto"
          >
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-10 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden"
                >
                  <Confetti />
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] mb-6 relative z-10"
                  >
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-black text-gray-900 mb-2 text-center relative z-10"
                  >
                    Оплата успешна!
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-500 font-medium text-center relative z-10"
                  >
                    Тариф <span className="font-bold text-gray-900">{selectedPlan.name}</span> активирован.<br/>
                    Все функции разблокированы.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div key="form" className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Выберите тариф</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-8">
                    {PLANS.map((plan) => {
                      const isActive = currentSubscription === plan.id;
                      
                      return (
                        <motion.div 
                          key={plan.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => !isActive && setSelectedPlanId(plan.id)}
                          className={`relative p-5 rounded-3xl border-2 transition-all ${isActive ? 'cursor-default' : 'cursor-pointer'} ${
                            isActive 
                              ? 'border-green-500 bg-green-50/30'
                              : selectedPlanId === plan.id 
                                ? 'border-blue-500 bg-blue-50/30' 
                                : plan.popular ? 'border-amber-200 bg-amber-50/20' : 'border-gray-100 bg-gray-50/50'
                          }`}
                        >
                          {isActive ? (
                            <div className="absolute -top-3 right-6 bg-green-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center">
                              <Check className="w-3 h-3 mr-1" /> Активен
                            </div>
                          ) : plan.popular && (
                            <div className="absolute -top-3 right-6 bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                              Лучший выбор
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white`}>
                                {plan.id === 'prime-plus' ? <Crown className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                              </div>
                              <div>
                                <h3 className="font-black text-gray-900">{plan.name}</h3>
                                <p className="text-xs text-gray-500 font-bold">{plan.price} ₽ / мес</p>
                              </div>
                            </div>
                            {!isActive && (
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                selectedPlanId === plan.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                              }`}>
                                {selectedPlanId === plan.id && <Check className="w-4 h-4 text-white" />}
                              </div>
                            )}
                          </div>
                          
                          <ul className="space-y-2">
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-center text-xs text-gray-600 font-medium">
                                <Check className="w-3 h-3 mr-2 text-green-500" /> {f}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">Способы оплаты</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center justify-center space-x-2 py-3 rounded-2xl transition-all border-2 ${
                          paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-gray-700" />
                        <span className="text-xs font-bold text-gray-700">Карта</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('yoomoney')}
                        className={`flex items-center justify-center space-x-2 py-3 rounded-2xl transition-all border-2 ${
                          paymentMethod === 'yoomoney' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        <YooMoneyIcon />
                        <span className="text-xs font-bold text-gray-700">ЮMoney</span>
                      </button>
                    </div>

                    <button 
                      onClick={handleSubscribe}
                      disabled={isProcessing || currentSubscription === selectedPlanId}
                      className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center space-x-2 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Переход к оплате...
                        </span>
                      ) : currentSubscription === selectedPlanId ? (
                        <span>Тариф уже активен</span>
                      ) : (
                        <>
                          <span>Оплатить {selectedPlan.name} ({selectedPlan.price} ₽)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-400 px-6">
                      Нажимая кнопку, вы соглашаетесь с условиями оферты и политикой конфиденциальности.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
