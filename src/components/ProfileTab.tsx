import { useState } from 'react';
import { Crown, Check, Zap, Star, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubscriptionPlan } from '../App';

const PLANS = [
  {
    id: 'prime',
    name: 'Prime',
    price: '5',
    color: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-200',
    icon: <Star className="w-6 h-6 text-white" />,
    features: [
      'Поиск в 2 раза быстрее',
      'Доступ к закрытым чатам',
      'Уведомления о новых заказах',
      'Базовая поддержка'
    ]
  },
  {
    id: 'prime-plus',
    name: 'Prime Plus',
    price: '10',
    color: 'from-amber-400 to-orange-600',
    shadow: 'shadow-orange-200',
    icon: <Crown className="w-6 h-6 text-white" />,
    features: [
      'Все преимущества Prime',
      'AI-генератор откликов',
      'Прямой контакт без очереди',
      'Приоритетная поддержка 24/7',
      'Без рекламы'
    ],
    popular: true
  }
];

export default function ProfileTab({ onOpenSubscription, subscription }: { onOpenSubscription: () => void, subscription: SubscriptionPlan }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getSubscriptionName = () => {
    if (subscription === 'prime') return 'Prime';
    if (subscription === 'prime-plus') return 'Prime Plus';
    return 'Бесплатный тариф';
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-b-[3rem] shadow-sm border-b border-gray-200/50 mb-6 z-10">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <img 
                src="https://picsum.photos/seed/user123/200" 
                alt="Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 text-white p-1 rounded-full border-2 border-white ${
              subscription === 'free' ? 'bg-blue-600' : subscription === 'prime-plus' ? 'bg-amber-500' : 'bg-indigo-600'
            }`}>
              {subscription === 'free' ? <ShieldCheck className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Богдан Архипенко</h2>
            <p className={`text-sm font-medium ${
              subscription === 'free' ? 'text-gray-500' : subscription === 'prime-plus' ? 'text-amber-600' : 'text-indigo-600'
            }`}>
              {getSubscriptionName()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Заказов найдено</p>
            <p className="text-lg font-black text-gray-800">128</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Экономия времени</p>
            <p className="text-lg font-black text-gray-800">~14ч</p>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">
            {subscription === 'free' ? 'Улучшить аккаунт' : 'Управление подпиской'}
          </h3>
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
        </div>

        <div className="space-y-6">
          {PLANS.map((plan, idx) => {
            const isActive = subscription === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenSubscription}
                className={`relative p-6 rounded-[2.5rem] bg-white border-2 transition-all cursor-pointer ${
                  isActive ? 'border-green-500 shadow-xl' : selectedPlan === plan.id ? 'border-blue-500 shadow-xl' : 'border-transparent shadow-sm'
                }`}
              >
                {isActive ? (
                  <div className="absolute -top-3 right-8 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Активен
                  </div>
                ) : plan.popular && (
                  <div className="absolute -top-3 right-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                    Популярно
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg ${plan.shadow}`}>
                    {plan.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">{plan.price} ₽</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">в месяц</p>
                  </div>
                </div>

                <h4 className="text-xl font-black text-gray-900 mb-4">{plan.name}</h4>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center text-sm text-gray-600 font-medium">
                      <div className={`mr-3 p-0.5 rounded-full ${plan.id === 'prime-plus' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {!isActive && (
                  <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center space-x-2 ${
                    plan.id === 'prime-plus' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-100' 
                      : 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                  }`}>
                    <span>{subscription === 'free' ? 'Подключить' : 'Перейти на'} {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, -90, 0],
              x: [0, -50, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-30"
          />
        </div>
      </div>
    </div>
  );
}
