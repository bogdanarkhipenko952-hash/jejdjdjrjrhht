import { useState, useEffect } from 'react';
import { Search, MessageSquare, User } from 'lucide-react';
import SearchTab from './components/SearchTab';
import ChatTab from './components/ChatTab';
import ProfileTab from './components/ProfileTab';
import SubscriptionModal from './components/SubscriptionModal';

export type SubscriptionPlan = 'free' | 'prime' | 'prime-plus';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'chat' | 'profile'>('search');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionPlan>('free');
  const [initialShowSuccess, setInitialShowSuccess] = useState(false);

  useEffect(() => {
    // Проверяем URL на наличие параметров успешной оплаты
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
      const plan = params.get('plan') as SubscriptionPlan;
      if (plan) {
        setSubscription(plan);
        setInitialShowSuccess(true);
        setIsModalOpen(true);
        
        // Очищаем URL от параметров
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const openModal = () => {
    setInitialShowSuccess(false);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden sm:border-x sm:border-gray-200">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'search' && <SearchTab onOpenSubscription={openModal} subscription={subscription} />}
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'profile' && <ProfileTab onOpenSubscription={openModal} subscription={subscription} />}
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubscribe={(plan) => {
          setSubscription(plan);
          setIsModalOpen(false);
        }}
        currentSubscription={subscription}
        initialShowSuccess={initialShowSuccess}
      />

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 pb-safe">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeTab === 'search' ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Search className={`w-6 h-6 ${activeTab === 'search' ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
          <span className="text-[10px] font-bold">Поиск</span>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeTab === 'chat' ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <MessageSquare className={`w-6 h-6 ${activeTab === 'chat' ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
          <span className="text-[10px] font-bold">Ассистент</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeTab === 'profile' ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <User className={`w-6 h-6 ${activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
          <span className="text-[10px] font-bold">Профиль</span>
        </button>
      </div>
      
      {/* Safe area padding for iOS */}
      <style dangerouslySetInnerHTML={{__html: `
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 12px); }
      `}} />
    </div>
  );
}
