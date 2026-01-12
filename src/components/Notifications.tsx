import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useLanguageCurrency } from '../context/LanguageContext';
import { convertPrice } from '../utils/currency';

interface Notification {
  id: number;
  user: string;
  game: string;
  amount: string;
  price: number;
}

const notificationsList: Notification[] = [
  { id: 1, user: 'Alex M.', game: 'Mobile Legends', amount: '500 Diamonds', price: 9.99 },
  { id: 2, user: 'Sarah K.', game: 'PUBG Mobile', amount: '1200 UC', price: 14.99 },
  { id: 3, user: 'Mike R.', game: 'Free Fire', amount: '2000 Diamonds', price: 19.99 },
  { id: 4, user: 'Emma L.', game: 'Genshin Impact', amount: '980 Genesis', price: 12.99 },
  { id: 5, user: 'John D.', game: 'Call of Duty', amount: '1500 CP', price: 16.99 },
];

export function Notifications() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const { currency } = useLanguageCurrency();

  useEffect(() => {
    if (!visible) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % notificationsList.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, width: '320px' }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white font-semibold truncate">
                    {notificationsList[current].user}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {notificationsList[current].game}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {notificationsList[current].amount}
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-bold mt-2">
                    {convertPrice(notificationsList[current].price, currency)}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setVisible(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </motion.button>
            </div>
            <div className="flex gap-1 mt-3">
              {notificationsList.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`h-1 flex-1 rounded-full ${
                    idx === current 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  layoutId={`indicator-${idx}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
