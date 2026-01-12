import { motion } from 'motion/react';
import { Game } from '../types';
import { useNavigate } from 'react-router-dom';
import { Coins, Zap } from 'lucide-react';
import { useRef, useState } from 'react';

interface GameCardProps {
  game: Game;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="cursor-pointer group relative"
      style={{ height: '420px' }}
      onClick={() => navigate(`/game/${game.id}`)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className="absolute inset-0 opacity-50 pointer-events-none rounded-xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.15), transparent 40%)`,
          }}
        />
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl border border-gray-200 dark:border-gray-700 group-hover:border-purple-500 flex flex-col h-full relative">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800" style={{ height: '180px' }}>
          <img 
            src={game.image} 
            alt={game.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
          
          {/* Event Badge */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 dark:bg-yellow-600 rounded-lg blur-md opacity-60 animate-pulse"></div>
              <div className="relative bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border-2 border-yellow-300 dark:border-yellow-400 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                EVENT ONGOING
              </div>
            </div>
          </div>

          {/* Discount Badge */}
          {game.discount && (
            <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 dark:bg-red-600 rounded-lg blur-md opacity-60"></div>
                <div className="relative bg-red-500 dark:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border-2 border-red-400 dark:border-red-500">
                  {game.discount}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">{game.name}</h3>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">{game.description}</p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Coins className="w-5 h-5" />
              <span className="text-base font-semibold">Top-up now</span>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Instant</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
