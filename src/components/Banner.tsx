import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useLanguageCurrency } from '../context/LanguageContext';
import { translate } from '../utils/translations';

export function Banner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { language } = useLanguageCurrency();
  
  const banners = [
    { image: '/bg/bg.png', title: translate('exclusiveOffer', language), subtitle: translate('get20Off', language), cta: translate('browseGames', language) },
    { image: '/bg/bg2.png', title: translate('trending', language), subtitle: translate('popularGames', language), cta: translate('browseGames', language) },
    { image: '/bg/bg3.png', title: translate('newArrivals', language), subtitle: translate('allGames', language), cta: translate('browseGames', language) },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ height: '320px' }}>
          <motion.div
            key={current}
            initial={{ x: direction > 0 ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <img src={banners[current].image} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 48px' }}>
              <div>
                <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-bold inline-block mb-4">{banners[current].title}</div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">{banners[current].subtitle}</h2>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                  {banners[current].cta} →
                </button>
              </div>
            </div>
          </motion.div>
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
            {banners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                style={{ height: '8px', borderRadius: '9999px', transition: 'all 0.3s', width: i === current ? '32px' : '8px' }}
                className={i === current ? 'bg-white' : 'bg-white/50'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
