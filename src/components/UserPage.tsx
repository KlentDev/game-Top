import { Banner } from './Banner';
import { GamesGrid } from './GamesGrid';
import { VoucherSection } from './VoucherSection';
import { Footer } from './Footer';
import { Notifications } from './Notifications';
import { GameCard } from './GameCard';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { useRecentlyVisited } from '../context/RecentlyVisitedContext';
import { useLanguageCurrency } from '../context/LanguageContext';
import { games } from '../data/games';

export function UserPage() {
  const { recentlyVisited } = useRecentlyVisited();
  const { language } = useLanguageCurrency();
  
  const recentGames = recentlyVisited
    .map(id => games.find(g => g.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Banner />
      <Notifications />
      
      {recentGames.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2.5 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">Recently Visited</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridAutoRows: '1fr' }}>
                {recentGames.map((game, index) => (
                  <GameCard key={game!.id} game={game!} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      <GamesGrid />
      <VoucherSection />
      <Footer />
    </div>
  );
}
