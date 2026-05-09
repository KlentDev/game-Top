import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { games, gamePackages } from '../data/games';
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  Clock,
  Coins,
  Headphones,
  Info,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { PaymentModal } from './PaymentModal';
import { Footer } from './Footer';
import { PaymentDetails, TopUpPackage } from '../types';
import { useLanguageCurrency } from '../context/LanguageContext';
import { useRecentlyVisited } from '../context/RecentlyVisitedContext';
import { convertPrice } from '../utils/currency';
import { translate } from '../utils/translations';

const trustItems = [
  { icon: Zap, label: 'Instant Delivery', sub: 'Credits within 60 seconds' },
  { icon: ShieldCheck, label: 'Secure Payment', sub: 'SSL encrypted checkout' },
  { icon: Headphones, label: '24/7 Support', sub: 'We\'re always here to help' },
  { icon: RefreshCw, label: 'Refund Policy', sub: '7-day hassle-free refunds' },
];

export function GameTopUpPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPackage, setSelectedPackage] = useState<TopUpPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredPkg, setHoveredPkg] = useState<string | null>(null);
  const { currency, language } = useLanguageCurrency();
  const { addRecentlyVisited } = useRecentlyVisited();

  const game = games.find((g) => g.id === gameId);
  const packages = gameId ? gamePackages[gameId] : [];

  useEffect(() => {
    if (gameId) addRecentlyVisited(gameId);
  }, [gameId, addRecentlyVisited]);

  const handleBack = () => {
    if (location.key !== 'default') navigate(-1);
    else navigate('/');
  };

  if (!game || !packages) {
    return (
      <div className="tu-not-found">
        <Coins className="tu-not-found-icon" />
        <h2>Game not found</h2>
        <p>This game doesn't exist or has been removed.</p>
        <button onClick={handleBack} className="tu-not-found-btn">
          <ArrowLeft /> Back to Games
        </button>
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
    <div className="tu-page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="tu-hero">
        <div
          className="tu-hero-bg"
          style={{ backgroundImage: `url(${game.image})` }}
        />
        <div className="tu-hero-scrim" />

        <div className="tu-hero-shell">
          {/* Breadcrumb */}
          <nav className="tu-breadcrumb" aria-label="breadcrumb">
            <button className="tu-breadcrumb-link" onClick={handleBack}>
              {translate('browseGames', language)}
            </button>
            <ChevronRight className="tu-breadcrumb-sep" />
            <span className="tu-breadcrumb-cur">{game.name}</span>
          </nav>

          {/* Game card */}
          <motion.div
            className="tu-hero-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.img
              src={game.image}
              alt={game.name}
              className="tu-hero-img"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
            />
            <div className="tu-hero-info">
              <div className="tu-hero-meta">
                <span className="tu-hero-cat">{game.category}</span>
                {game.discount && (
                  <span className="tu-hero-discount">{game.discount}</span>
                )}
              </div>
              <h1 className="tu-hero-title">{game.name}</h1>
              <p className="tu-hero-desc">{game.description}</p>
              <div className="tu-hero-badges">
                <span className="tu-hero-badge"><Zap className="tu-hb-icon" />Instant</span>
                <span className="tu-hero-badge"><ShieldCheck className="tu-hb-icon" />Secure</span>
                <span className="tu-hero-badge"><BadgeCheck className="tu-hb-icon" />Official</span>
              </div>
            </div>
          </motion.div>

          {/* Back button */}
          <motion.button
            className="tu-back-btn"
            onClick={handleBack}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft className="tu-back-icon" />
            {translate('backToGames', language)}
          </motion.button>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="tu-shell">

        {/* Info banner */}
        <motion.div
          className="tu-info-banner"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Info className="tu-info-icon" />
          <p>
            <strong>{translate('quickDelivery', language)}</strong>{' '}
            {translate('quickDeliveryMsg', language)}
          </p>
        </motion.div>

        {/* ── Packages ──────────────────────────────────────── */}
        <div className="tu-section">
          <div className="tu-section-head">
            <div className="tu-section-icon-wrap">
              <Coins className="tu-section-icon" />
            </div>
            <div>
              <p className="tu-section-eyebrow">{game.name}</p>
              <h2 className="tu-section-title">{translate('selectPackage', language)}</h2>
            </div>
            <span className="tu-section-count">{packages.length} packages</span>
          </div>

          <div className="tu-pkg-grid">
            {packages.map((pkg, index) => (
              <motion.button
                key={pkg.id}
                className={`tu-pkg-card${pkg.popular ? ' tu-pkg-popular' : ''}${hoveredPkg === pkg.id ? ' tu-pkg-hovered' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredPkg(pkg.id)}
                onHoverEnd={() => setHoveredPkg(null)}
                onClick={() => handlePackageClick(pkg)}
              >
                {pkg.popular && (
                  <div className="tu-pkg-popular-badge">
                    <Zap className="tu-pkg-badge-icon" /> Most Popular
                  </div>
                )}

                <div className="tu-pkg-top">
                  <p className="tu-pkg-name">{pkg.name}</p>
                  <p className="tu-pkg-amount">{pkg.amount}</p>
                  {pkg.bonus && (
                    <span className="tu-pkg-bonus">
                      <Clock className="tu-pkg-bonus-icon" /> {pkg.bonus}
                    </span>
                  )}
                </div>

                <div className="tu-pkg-bottom">
                  <p className="tu-pkg-price">{convertPrice(pkg.price, currency)}</p>
                  <span className="tu-pkg-cta">
                    {translate('selectPackageBtn', language)}
                    <ChevronRight className="tu-pkg-cta-icon" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Trust strip ───────────────────────────────────── */}
        <div className="tu-trust-strip">
          {trustItems.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="tu-trust-item">
              <div className="tu-trust-icon-wrap">
                <Icon className="tu-trust-icon" />
              </div>
              <div className="tu-trust-text">
                <strong>{label}</strong>
                <span>{sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── How It Works ──────────────────────────────────── */}
        <motion.div
          className="tu-hiw"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="tu-section-head" style={{ marginBottom: '2rem' }}>
            <div className="tu-section-icon-wrap">
              <BadgeCheck className="tu-section-icon" />
            </div>
            <div>
              <p className="tu-section-eyebrow">Simple process</p>
              <h2 className="tu-section-title">{translate('howItWorks', language)}</h2>
            </div>
          </div>

          <div className="tu-hiw-steps">
            {[
              { n: '1', title: translate('step1Title', language), desc: translate('step1Desc', language) },
              { n: '2', title: translate('step2Title', language), desc: translate('step2Desc', language) },
              { n: '3', title: translate('step3Title', language), desc: translate('step3Desc', language) },
            ].map(({ n, title, desc }, i) => (
              <div key={n} className="tu-hiw-step">
                <div className="tu-hiw-step-left">
                  <div className="tu-hiw-num">{n}</div>
                  {i < 2 && <div className="tu-hiw-connector" />}
                </div>
                <div className="tu-hiw-content">
                  <h4 className="tu-hiw-step-title">{title}</h4>
                  <p className="tu-hiw-step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      <Footer />

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentDetails={paymentDetails}
      />
    </div>
  );
}
