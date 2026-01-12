import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              <img src="/bg/up-arrow.png" alt="Loading" style={{ width: '48px', height: '48px' }} />
            </motion.div>
            
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                  style={{ width: '4px', height: '24px', backgroundColor: 'white', borderRadius: '2px' }}
                />
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                  style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '9999px' }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
