import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { games, gamePackages } from '../data/games';
import { ArrowLeft, Star, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PaymentModal } from './PaymentModal';
import { Footer } from './Footer';
import { PaymentDetails, TopUpPackage } from '../types';
import { useLanguageCurrency } from '../context/LanguageContext';
import { useRecentlyVisited } from '../context/RecentlyVisitedContext';
import { convertPrice } from '../utils/currency';
import { translate } from '../utils/translations';

export function GameTopUpPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currency, language } = useLanguageCurrency();
  const { addRecentlyVisited } = useRecentlyVisited();

  const game = games.find((g) => g.id === gameId);
  const packages = gameId ? gamePackages[gameId] : [];

  useEffect(() => {
    if (gameId) {
      addRecentlyVisited(gameId);
    }
  }, [gameId, addRecentlyVisited]);

  if (!game || !packages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Game not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handlePackageClick = (pkg: TopUpPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const paymentDetails: PaymentDetails | null = selectedPackage
    ? { game, package: selectedPackage }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-blue-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${game.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white mb-8 hover:text-purple-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {translate('backToGames', language)}
          </motion.button>

          {/* Game Info */}
          <div className="flex items-center gap-6">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={game.image}
              alt={game.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-2xl object-cover"
            />
            <div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl sm:text-4xl text-white mb-2"
              >
                {game.name}
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-purple-200 mb-3"
              >
                {game.description}
              </motion.p>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {game.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <span className="font-medium">{translate('quickDelivery', language)}</span> {translate('quickDeliveryMsg', language)}
            </p>
          </div>
        </motion.div>

        {/* Packages Grid */}
        <div>
          <h2 className="text-2xl text-gray-900 dark:text-white mb-6 font-heading">{translate('selectPackage', language)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => handlePackageClick(pkg)}
                className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 cursor-pointer border-2 transition-all ${
                  pkg.popular
                    ? 'border-purple-600 shadow-lg shadow-purple-100 dark:shadow-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-xs shadow-lg">
                      ⭐ {translate('mostPopular', language)}
                    </div>
                  </div>
                )}

                {/* Package Info */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{pkg.name}</p>
                  <h3 className="text-2xl text-gray-900 dark:text-white mb-2">{pkg.amount}</h3>
                  
                  {/* Bonus */}
                  {pkg.bonus && (
                    <div className="mb-3">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        {pkg.bonus}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-3xl text-gray-900 dark:text-white">{convertPrice(pkg.price, currency)}</p>
                  </div>

                  {/* Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full mt-4 py-3 rounded-lg transition-colors ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {translate('selectPackageBtn', language)}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8"
        >
          <h3 className="text-xl text-gray-900 dark:text-white mb-6 font-heading">{translate('howItWorks', language)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center">
                1
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white mb-1 font-heading">{translate('step1Title', language)}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {translate('step1Desc', language)}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white mb-1 font-heading">{translate('step2Title', language)}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {translate('step2Desc', language)}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white mb-1 font-heading">{translate('step3Title', language)}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {translate('step3Desc', language)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentDetails={paymentDetails}
      />
    </div>
  );
}