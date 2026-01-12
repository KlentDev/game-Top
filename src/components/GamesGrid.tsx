import { GameCard } from './GameCard';
import { games } from '../data/games';
import { Flame, Grid3x3 } from 'lucide-react';
import { useLanguageCurrency } from '../context/LanguageContext';
import { translate } from '../utils/translations';

export function GamesGrid() {
  const { language } = useLanguageCurrency();
  const sortedGames = [...games].sort((a, b) => b.popularity - a.popularity);
  const popularGames = sortedGames.slice(0, 6);
  const allGames = sortedGames;

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ marginBottom: '80px' }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2.5 rounded-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{translate('popularGames', language)}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridAutoRows: '1fr' }}>
            {popularGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2.5 rounded-lg">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{translate('allGames', language)}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridAutoRows: '1fr' }}>
            {allGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
