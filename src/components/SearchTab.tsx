import { useState } from 'react';
import { Search, Clock, DollarSign, Briefcase, ExternalLink, Loader2, Send, Crown, Star } from 'lucide-react';
import { searchJobs } from '../lib/gemini';
import { motion } from 'motion/react';
import { SubscriptionPlan } from '../App';

const CATEGORIES = ['Дизайн', 'Программирование', 'Копирайтинг', 'Сценарист', 'SEO'];
const TIMEFRAMES = [
  { label: '10 мин', value: '10 минут' },
  { label: '30 мин', value: '30 минут' },
  { label: '1 час', value: '1 час' },
  { label: '3 часа', value: '3 часа' },
];

const SearchingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-56 h-[400px] border-[8px] border-gray-900 rounded-[3rem] bg-gray-50 overflow-hidden shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-2xl w-24 mx-auto z-20"></div>
        
        {/* Screen Content */}
        <motion.div 
          animate={{ y: [0, -400, -400, -800] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.5, 0.9] }}
          className="absolute top-0 left-0 w-full"
        >
          {/* Screen 1: Google Search */}
          <div className="h-[400px] w-full bg-white p-4 flex flex-col pt-10">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">G</div>
              <div className="h-8 bg-gray-100 rounded-full flex-1 flex items-center px-3 shadow-inner">
                <motion.div 
                  initial={{ width: "0%" }} 
                  animate={{ width: "100%" }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 bg-blue-400 rounded-full"
                />
              </div>
            </div>
            <div className="space-y-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-3/4 bg-blue-100 rounded-full"></div>
                  <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                  <div className="h-2 w-5/6 bg-gray-100 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Screen 2: Telegram */}
          <div className="h-[400px] w-full bg-[#E4EAEF] flex flex-col pt-10 relative">
            {/* Telegram Header */}
            <div className="bg-white px-4 py-3 shadow-sm flex items-center space-x-3 z-10">
              <div className="w-8 h-8 bg-[#2AABEE] rounded-full flex items-center justify-center text-white">
                <Send className="w-4 h-4 -ml-0.5" />
              </div>
              <div className="space-y-1">
                <div className="h-2 w-24 bg-gray-200 rounded-full"></div>
                <div className="h-1.5 w-16 bg-blue-100 rounded-full"></div>
              </div>
            </div>
            {/* Telegram Messages */}
            <div className="flex-1 p-3 overflow-hidden relative">
              <motion.div
                animate={{ y: [0, -150] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                className="space-y-4 pt-2"
              >
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm w-[90%]">
                    <div className="h-2 w-1/2 bg-blue-200 rounded-full mb-3"></div>
                    <div className="h-2 w-full bg-gray-100 rounded-full mb-2"></div>
                    <div className="h-2 w-4/5 bg-gray-100 rounded-full mb-2"></div>
                    <div className="h-2 w-2/3 bg-gray-100 rounded-full"></div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-8 flex flex-col items-center"
      >
        <span className="text-blue-600 font-bold text-lg tracking-wide">Нейросеть в поиске</span>
        <span className="text-gray-500 text-sm mt-1">Анализируем Telegram-каналы...</span>
      </motion.div>
    </div>
  );
};

export default function SearchTab({ onOpenSubscription, subscription }: { onOpenSubscription: () => void, subscription: SubscriptionPlan }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [budget, setBudget] = useState('5000');
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[2].value);
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setIsSearching(true);
    setError('');
    try {
      const results = await searchJobs(category, budget, timeframe);
      setJobs(results);
    } catch (err) {
      setError('Не удалось найти заказы. Попробуйте изменить параметры.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 bg-[#F8FAFC]">
      <div className="bg-white/90 backdrop-blur-xl p-5 rounded-b-[2.5rem] shadow-sm z-10 border-b border-gray-200/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Поиск заказов</h2>
          {subscription === 'free' ? (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSubscription}
              className="flex items-center space-x-1 bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 rounded-full shadow-lg shadow-orange-100 cursor-pointer"
            >
              <Crown className="w-3 h-3 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">Prime</span>
            </motion.div>
          ) : (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 rounded-full shadow-lg shadow-blue-100">
              <Crown className="w-3 h-3 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                {subscription === 'prime-plus' ? 'Prime Plus' : 'Prime'}
              </span>
            </div>
          )}
        </div>
        
        {/* Filters */}
        <div className="space-y-5">
          {/* Category */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Категория</label>
            <div className="flex overflow-x-auto pb-2 -mx-5 px-5 space-x-2 scrollbar-hide">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${category === c ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            {/* Budget */}
            <div className="flex-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Бюджет (₽)</label>
              <div className="relative group">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium text-gray-800 shadow-sm"
                  placeholder="5000"
                />
              </div>
            </div>

            {/* Timeframe */}
            <div className="flex-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Свежесть</label>
              <div className="relative group">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none font-medium text-gray-800 shadow-sm"
                >
                  {TIMEFRAMES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-2"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span>{isSearching ? 'Поиск...' : 'Найти заказы'}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="p-5 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm text-center font-medium border border-red-100">
            {error}
          </div>
        )}
        
        {isSearching ? (
          <SearchingAnimation />
        ) : jobs.length === 0 && !error ? (
          <div className="text-center text-gray-400 mt-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-300" />
            </div>
            <p className="font-medium">Нажмите «Найти заказы»</p>
            <p className="text-sm mt-1">Нейросеть соберет свежие вакансии из Telegram</p>
          </div>
        ) : (
          jobs.map((job, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={job.id || idx}
              className={`bg-white p-5 rounded-[1.5rem] shadow-sm border transition-all hover:shadow-md ${idx % 3 === 0 ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/30' : 'border-gray-100'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  {idx % 3 === 0 && (
                    <span className="flex items-center text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">
                      <Star className="w-2 h-2 mr-1 fill-amber-600" /> Эксклюзив
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 leading-snug pr-4">{job.title}</h3>
                </div>
                <span className="bg-green-50 text-green-700 border border-green-100 text-xs font-black px-2.5 py-1 rounded-xl whitespace-nowrap">
                  {job.price}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-5 line-clamp-4 leading-relaxed">{job.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex flex-col space-y-1.5">
                  <span className="flex items-center text-[11px] font-medium text-gray-400">
                    <Clock className="w-3.5 h-3.5 mr-1.5" /> {job.timePosted}
                  </span>
                  <span className="flex items-center text-[11px] font-bold text-[#2AABEE]">
                    <Send className="w-3 h-3 mr-1.5" /> {job.source}
                  </span>
                </div>
                <a 
                  href={job.url !== '#' ? job.url : undefined} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-sm px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  Открыть <ExternalLink className="w-4 h-4 ml-1.5" />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
