import { AnimatePresence, motion } from 'motion/react';
import type { ComponentType } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  Gamepad2,
  Gift,
  LayoutDashboard,
  Link2,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Star,
  Trophy,
  Wallet,
  XCircle,
  Zap,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRecentlyVisited } from '../context/RecentlyVisitedContext';
import { games } from '../data/games';
import { useRawgEnrichment } from '../hooks/useRawgEnrichment';
import { hasRawgKey } from '../services/rawg';
import { Footer } from './Footer';
import { EditProfileModal } from './EditProfileModal';
import type { ReceiptData } from './ReceiptModal';
import { ReceiptModal } from './ReceiptModal';

/* ── Types ────────────────────────────────────────────────────── */
type Tab = 'dashboard' | 'wallet' | 'transactions' | 'settings';
type TxStatus = 'completed' | 'failed' | 'pending' | 'processing';

interface Transaction {
  id: string;
  orderId: string;
  game: string;
  package: string;
  amount: number;
  status: TxStatus;
  date: string;
  paymentMethod: string;
  image: string;
}

/* ── Constants ────────────────────────────────────────────────── */
const validTabs: Tab[] = ['dashboard', 'wallet', 'transactions', 'settings'];

const tabs: { id: Tab; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard',    label: 'Dashboard',   Icon: LayoutDashboard },
  { id: 'wallet',       label: 'Wallet',       Icon: Wallet          },
  { id: 'transactions', label: 'Transactions', Icon: Clock           },
  { id: 'settings',     label: 'Settings',     Icon: Settings        },
];

const heroConfig: Record<Tab, { Icon: ComponentType<{ className?: string }>; title: string; subtitle: string }> = {
  dashboard:    { Icon: LayoutDashboard, title: 'Player Command Center', subtitle: 'Your personal gaming hub and top-up portal' },
  wallet:       { Icon: Wallet,          title: 'My Wallet',             subtitle: 'Credits, rewards, and linked payment methods' },
  transactions: { Icon: Clock,           title: 'Transaction History',   subtitle: 'All your orders, payments, and receipts' },
  settings:     { Icon: Settings,        title: 'Account Settings',      subtitle: 'Profile, preferences, and security' },
};

const transactions: Transaction[] = [
  {
    id: 'TXN-240509-001', orderId: 'ML-20260509-7841',
    game: 'Mobile Legends', package: 'Starlight Member — 300 Diamonds',
    amount: 4.99, status: 'completed', date: 'May 9, 2026 · 2:23 PM',
    paymentMethod: 'Visa ****4532', image: '/images/mobile-legends.png',
  },
  {
    id: 'TXN-240508-003', orderId: 'PUBG-20260508-3319',
    game: 'PUBG Mobile', package: 'Standard UC — 660 + 60 Bonus',
    amount: 9.99, status: 'completed', date: 'May 8, 2026 · 7:11 PM',
    paymentMethod: 'PayPal', image: '/images/pubg.png',
  },
  {
    id: 'TXN-240506-002', orderId: 'GI-20260506-5522',
    game: 'Genshin Impact', package: 'Basic Crystals — 980 Genesis',
    amount: 14.99, status: 'completed', date: 'May 6, 2026 · 11:45 AM',
    paymentMethod: 'Visa ****4532', image: '/images/genshin.png',
  },
  {
    id: 'TXN-240504-001', orderId: 'FF-20260504-1105',
    game: 'Free Fire', package: 'Basic Pack — 310 Diamonds',
    amount: 2.99, status: 'completed', date: 'May 4, 2026 · 3:18 PM',
    paymentMethod: 'GCash', image: '/images/free-fire.png',
  },
  {
    id: 'TXN-240503-002', orderId: 'VAL-20260503-0876',
    game: 'Valorant', package: 'Basic Points — 1000 VP',
    amount: 9.99, status: 'failed', date: 'May 3, 2026 · 9:02 AM',
    paymentMethod: 'Visa ****4532', image: '/images/valorant.png',
  },
];

const statusConfig: Record<
  TxStatus,
  { label: string; badgeClass: string; Icon: ComponentType<{ className?: string }> }
> = {
  completed:  { label: 'Completed',  badgeClass: 'ud-badge-completed',  Icon: CheckCircle2 },
  failed:     { label: 'Failed',     badgeClass: 'ud-badge-failed',     Icon: XCircle      },
  pending:    { label: 'Pending',    badgeClass: 'ud-badge-pending',    Icon: AlertCircle  },
  processing: { label: 'Processing', badgeClass: 'ud-badge-processing', Icon: Zap          },
};

/* ── Payment method options ───────────────────────────────────── */
const paymentMethods = [
  {
    group: 'E-Wallets',
    Icon: Smartphone,
    color: '#7c3aed',
    items: [
      { name: 'GCash', logo: '💚', connected: false },
      { name: 'Maya',  logo: '💙', connected: false },
      { name: 'PayPal', logo: '🟦', connected: true  },
      { name: 'GrabPay', logo: '🟢', connected: false },
    ],
  },
  {
    group: 'Bank Account',
    Icon: Banknote,
    color: '#2563eb',
    items: [
      { name: 'BDO Unibank',   logo: '🏦', connected: false },
      { name: 'BPI',           logo: '🏦', connected: false },
      { name: 'Security Bank', logo: '🏦', connected: false },
    ],
  },
  {
    group: 'Cards',
    Icon: CreditCard,
    color: '#0891b2',
    items: [
      { name: 'Visa ****4532',         logo: '💳', connected: true  },
      { name: 'Add a new card',        logo: '+',  connected: false },
    ],
  },
];

/* ── Sub-components ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: TxStatus }) {
  const { label, badgeClass, Icon } = statusConfig[status];
  return (
    <span className={`ud-badge ${badgeClass}`}>
      <Icon className="ud-badge-icon" />
      {label}
    </span>
  );
}

/* ── Main component ───────────────────────────────────────────── */
export function UserDashboard() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab]   = useState<Tab>('dashboard');
  const [txSearch, setTxSearch]     = useState('');
  const [txFilter, setTxFilter]     = useState<'all' | TxStatus>('all');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [gameSearch, setGameSearch] = useState('');
  const [gameCategory, setGameCategory] = useState('');
  const [receipt, setReceipt]   = useState<ReceiptData | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [connectedMethods, setConnectedMethods] = useState<string[]>(['PayPal', 'Visa ****4532']);

  const { recentlyVisited } = useRecentlyVisited();
  const { userName, credits, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { coverOf, ratingOf } = useRawgEnrichment();

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab | null;
    if (tab && validTabs.includes(tab)) setActiveTab(tab);
  }, [searchParams]);

  const initial = (userName || 'G').charAt(0).toUpperCase();

  const preferredGames = useMemo(() => {
    const fromHistory = recentlyVisited.map((id) => games.find((g) => g.id === id)).filter(Boolean);
    return (fromHistory.length ? fromHistory : games.slice(0, 3)).slice(0, 3);
  }, [recentlyVisited]);

  const gameCategories = useMemo(() => Array.from(new Set(games.map((g) => g.category))), []);

  const filteredGames = useMemo(() => {
    const q = gameSearch.trim().toLowerCase();
    return games.filter((g) => {
      const matchSearch   = !q || g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q);
      const matchCategory = !gameCategory || g.category === gameCategory;
      return matchSearch && matchCategory;
    });
  }, [gameSearch, gameCategory]);

  const filteredTransactions = transactions.filter((tx) => {
    const q = txSearch.trim().toLowerCase();
    const matchSearch =
      !q ||
      tx.game.toLowerCase().includes(q) ||
      tx.orderId.toLowerCase().includes(q) ||
      tx.package.toLowerCase().includes(q);
    return matchSearch && (txFilter === 'all' || tx.status === txFilter);
  });

  const setTab = (tab: Tab) => {
    setActiveTab(tab);
    navigate(tab === 'dashboard' ? '/user' : `/user?tab=${tab}`);
  };

  const handleRetry = (tx: Transaction) => {
    toast('success', 'Top-up retried', `${tx.game} order is being reprocessed.`);
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const togglePaymentMethod = (name: string) => {
    const isConnected = connectedMethods.includes(name);
    if (isConnected) {
      setConnectedMethods((prev) => prev.filter((m) => m !== name));
      toast('info', 'Payment method removed', `${name} has been disconnected.`);
    } else {
      setConnectedMethods((prev) => [...prev, name]);
      toast('success', 'Payment method connected', `${name} was successfully linked.`);
    }
  };

  const hero = heroConfig[activeTab];
  const HeroIcon = hero.Icon;

  return (
    <div className="ud-page">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section className="ud-hero">
        <div className="ud-hero-inner">
          <div className="ud-shell">
            <div className="ud-hero-content">
              {/* Icon + titles */}
              <motion.div
                key={activeTab + '-hero'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="ud-hero-title-block"
              >
                <div className="ud-hero-icon-wrap">
                  <HeroIcon className="ud-hero-icon" />
                </div>
                <div>
                  <p className="ud-hero-eyebrow">GameTopUp</p>
                  <h1 className="ud-hero-h1">{hero.title}</h1>
                  <p className="ud-hero-sub">{hero.subtitle}</p>
                </div>
              </motion.div>

              {/* Player identity strip */}
              <div className="ud-hero-player-strip">
                <div className="ud-hero-player-left">
                  <div className="ud-hero-avatar">{initial}</div>
                  <div>
                    <strong className="ud-hero-player-name">{userName || 'Gamer'}</strong>
                    <div className="ud-hero-pills">
                      <span>LVL 7</span>
                      <span>Silver Member</span>
                      <span>⚡ Instant delivery</span>
                    </div>
                  </div>
                </div>
                <div className="ud-hero-credits">
                  <div>
                    <span>Credits</span>
                    <strong>{credits.toLocaleString()}</strong>
                  </div>
                  <button className="ud-hero-topup-btn" onClick={() => navigate('/')}>
                    Top Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab bar anchored to bottom of hero ────────────────── */}
        <div className="ud-hero-tab-bar">
          <div className="ud-shell">
            <nav className="ud-hero-tabs" aria-label="Dashboard navigation">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className={`ud-hero-tab${activeTab === id ? ' is-active' : ''}`}
                  onClick={() => setTab(id)}
                >
                  <Icon className="ud-tab-icon" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* ── Tab content ─────────────────────────────────────────── */}
      <main className="ud-shell ud-main">
        <AnimatePresence mode="wait">

          {/* ─────────────── DASHBOARD ─────────────────────────── */}
          {activeTab === 'dashboard' && (
            <motion.section
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="ud-tab-panel"
            >
              <div className="ud-metric-grid">
                {[
                  { label: 'Wallet Credits',    value: credits.toLocaleString(), Icon: Wallet  },
                  { label: 'Reward Points',     value: '2,450',                  Icon: Trophy  },
                  { label: 'Active Vouchers',   value: '3',                      Icon: Gift    },
                  { label: 'Top-ups This Month',value: '4',                      Icon: Zap     },
                ].map(({ label, value, Icon }) => (
                  <article key={label} className="ud-metric-card">
                    <Icon className="ud-card-icon" />
                    <div>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  </article>
                ))}
              </div>

              <div className="ud-content-grid">
                {/* Recent orders */}
                <article className="ud-card ud-card-wide">
                  <div className="ud-card-head">
                    <div>
                      <p className="ud-eyebrow">Recent Orders</p>
                      <h2>Latest top-ups</h2>
                    </div>
                    <button className="ud-link-button" onClick={() => setTab('transactions')}>
                      View all <ChevronRight className="ud-link-icon" />
                    </button>
                  </div>
                  <div className="ud-order-stack">
                    {transactions.slice(0, 3).map((tx) => (
                      <div key={tx.id} className="ud-order-row">
                        <img src={tx.image} alt={tx.game} />
                        <div>
                          <strong>{tx.game}</strong>
                          <span>{tx.package}</span>
                        </div>
                        <div className="ud-order-meta">
                          <strong>${tx.amount.toFixed(2)}</strong>
                          <StatusBadge status={tx.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                {/* Progress */}
                <article className="ud-card">
                  <div className="ud-card-head">
                    <div>
                      <p className="ud-eyebrow">Progress</p>
                      <h2>Silver to Gold</h2>
                    </div>
                    <Star className="ud-card-icon" />
                  </div>
                  <div className="ud-progress">
                    <div>
                      <span>Tier progress</span>
                      <strong>82%</strong>
                    </div>
                    <div className="ud-progress-track">
                      <span style={{ width: '82%' }} />
                    </div>
                    <p>550 more reward points to unlock Gold promos and priority support.</p>
                  </div>
                </article>

                {/* Browse games */}
                <article className="ud-card ud-card-full">
                  <div className="ud-browse-head">
                    <div>
                      <p className="ud-eyebrow">Quick Access</p>
                      <h2>Browse games</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                      {hasRawgKey() && (
                        <span className="gc-rawg-badge" style={{ fontSize: '0.62rem' }}>
                          Powered by RAWG
                        </span>
                      )}
                      <div className="ud-search-wrap ud-browse-search">
                        <Search className="ud-search-icon" />
                        <input
                          className="ud-search-input"
                          value={gameSearch}
                          onChange={(e) => setGameSearch(e.target.value)}
                          placeholder="Search games…"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="ud-cat-filters">
                    <button
                      className={`ud-cat-btn${!gameCategory ? ' is-active' : ''}`}
                      onClick={() => setGameCategory('')}
                    >
                      All
                    </button>
                    {gameCategories.map((cat) => (
                      <button
                        key={cat}
                        className={`ud-cat-btn${gameCategory === cat ? ' is-active' : ''}`}
                        onClick={() => setGameCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {filteredGames.length === 0 ? (
                    <div className="ud-empty-state">
                      <Gamepad2 />
                      <strong>No games found</strong>
                      <span>Try a different search term or category.</span>
                    </div>
                  ) : (
                    <div className="ud-browse-grid">
                      {filteredGames.map((game) => {
                        const cover = coverOf(game.id, game.image);
                        const rating = ratingOf(game.id);
                        return (
                          <button
                            key={game.id}
                            className="ud-browse-card"
                            onClick={() => navigate(`/game/${game.id}`)}
                          >
                            <img src={cover} alt={game.name} className="ud-browse-card-img" />
                            <div className="ud-browse-card-info">
                              <strong>{game.name}</strong>
                              <small>{game.category}</small>
                              {rating !== null && (
                                <span className="ud-browse-card-rating">
                                  <Star style={{ width: '0.65rem', height: '0.65rem', fill: '#f59e0b', color: '#f59e0b' }} />
                                  {rating.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </article>
              </div>
            </motion.section>
          )}

          {/* ─────────────── WALLET ────────────────────────────── */}
          {activeTab === 'wallet' && (
            <motion.section
              key="wallet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="ud-tab-panel"
            >
              {/* Balance + stats */}
              <div className="ud-wallet-grid">
                <article className="ud-balance-card">
                  <span>Available Credits</span>
                  <strong>{credits.toLocaleString()}</strong>
                  <p>Use credits for instant game top-ups and digital voucher purchases across all platforms.</p>
                  <button onClick={() => {
                    navigate('/');
                    toast('info', 'Redirecting', 'Select a game to add credits.');
                  }}>
                    Add Credits
                  </button>
                </article>

                <div className="ud-wallet-side">
                  {[
                    { label: 'Spent This Month', value: '$32.96',      Icon: Wallet  },
                    { label: 'Reward Points',    value: '2,450 pts',   Icon: Trophy  },
                    { label: 'Active Vouchers',  value: '3 available', Icon: Gift    },
                  ].map(({ label, value, Icon }) => (
                    <article key={label} className="ud-card ud-wallet-mini">
                      <Icon className="ud-card-icon" />
                      <div>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* ── Connect payment methods ────────────────────── */}
              <div className="ud-connect-section">
                <div className="ud-connect-head">
                  <div className="ud-connect-icon-wrap">
                    <Link2 />
                  </div>
                  <div>
                    <p className="ud-eyebrow">Payment Methods</p>
                    <h2>Connect wallet, bank, or e-wallet</h2>
                  </div>
                </div>

                <div className="ud-connect-groups">
                  {paymentMethods.map((group) => {
                    const GroupIcon = group.Icon;
                    return (
                      <div key={group.group} className="ud-connect-group">
                        <div className="ud-connect-group-label">
                          <GroupIcon style={{ width: '0.95rem', height: '0.95rem', color: group.color }} />
                          <span>{group.group}</span>
                        </div>
                        <div className="ud-connect-cards">
                          {group.items.map((item) => {
                            const isConnected = connectedMethods.includes(item.name);
                            return (
                              <div key={item.name} className={`ud-connect-card${isConnected ? ' is-connected' : ''}`}>
                                <div className="ud-connect-card-logo">{item.logo}</div>
                                <div className="ud-connect-card-name">
                                  <strong>{item.name}</strong>
                                  <small>{isConnected ? 'Connected' : 'Not linked'}</small>
                                </div>
                                <button
                                  className={isConnected ? 'ud-connect-btn-linked' : 'ud-connect-btn'}
                                  onClick={() => togglePaymentMethod(item.name)}
                                >
                                  {isConnected ? 'Disconnect' : 'Connect'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent transactions preview */}
              <div className="ud-section-title" style={{ marginTop: '1.5rem' }}>
                <Clock className="ud-card-icon" />
                <div>
                  <p className="ud-eyebrow">Recent</p>
                  <h2>Transaction summary</h2>
                </div>
                <button className="ud-link-button" style={{ marginLeft: 'auto' }} onClick={() => setTab('transactions')}>
                  View all <ChevronRight className="ud-link-icon" />
                </button>
              </div>

              <div className="ud-order-stack" style={{ marginTop: '0.5rem' }}>
                {transactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="ud-order-row">
                    <img src={tx.image} alt={tx.game} />
                    <div>
                      <strong>{tx.game}</strong>
                      <span>{tx.date}</span>
                    </div>
                    <div className="ud-order-meta">
                      <strong>${tx.amount.toFixed(2)}</strong>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ─────────────── TRANSACTIONS ──────────────────────── */}
          {activeTab === 'transactions' && (
            <motion.section
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="ud-tab-panel"
            >
              <div className="ud-transaction-toolbar">
                <div className="ud-search-wrap" style={{ maxWidth: '26rem', flex: '1' }}>
                  <Search className="ud-search-icon" />
                  <input
                    className="ud-search-input"
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    placeholder="Search game, package, or order ID…"
                  />
                </div>
                <div className="ud-filter-group">
                  {(['all', 'completed', 'failed', 'pending'] as const).map((f) => (
                    <button
                      key={f}
                      className={txFilter === f ? 'is-active' : ''}
                      onClick={() => setTxFilter(f)}
                    >
                      {f === 'all' ? 'All' : statusConfig[f].label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="ud-empty-state">
                  <Gamepad2 />
                  <strong>No transactions found</strong>
                  <span>Try a different search term or clear the filter.</span>
                </div>
              ) : (
                <div className="ud-transaction-list">
                  {filteredTransactions.map((tx) => {
                    const isExpanded = expandedTx === tx.id;
                    return (
                      <article key={tx.id} className="ud-transaction-item">
                        <button
                          className="ud-transaction-summary"
                          onClick={() => setExpandedTx(isExpanded ? null : tx.id)}
                        >
                          <img src={tx.image} alt={tx.game} />
                          <span className="ud-transaction-main">
                            <strong>{tx.game}</strong>
                            <small>{tx.package}</small>
                          </span>
                          <span className="ud-transaction-date">{tx.date}</span>
                          <span className="ud-transaction-price">${tx.amount.toFixed(2)}</span>
                          <StatusBadge status={tx.status} />
                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.16 }}
                              className="ud-transaction-details"
                            >
                              <div><span>Order ID</span><strong>{tx.orderId}</strong></div>
                              <div><span>Payment</span><strong>{tx.paymentMethod}</strong></div>
                              <div>
                                <span>Delivery</span>
                                <strong>{tx.status === 'failed' ? 'Not delivered' : 'Instant'}</strong>
                              </div>
                              <div className="ud-detail-actions">
                                <button className="ud-btn-ghost" onClick={() => setReceipt(tx)}>Receipt</button>
                                <button
                                  className="ud-btn-ghost"
                                  onClick={() => toast('info', 'Support opened', `Case created for order ${tx.orderId}.`)}
                                >
                                  Support
                                </button>
                                {tx.status === 'failed' && (
                                  <button className="ud-btn-primary" onClick={() => handleRetry(tx)}>Retry</button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </article>
                    );
                  })}
                </div>
              )}
            </motion.section>
          )}

          {/* ─────────────── SETTINGS ──────────────────────────── */}
          {activeTab === 'settings' && (
            <motion.section
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="ud-tab-panel"
            >
              <div className="ud-settings-grid">
                {/* Profile */}
                <article className="ud-card">
                  <div className="ud-card-head">
                    <div>
                      <p className="ud-eyebrow">Profile</p>
                      <h2>Personal info</h2>
                    </div>
                  </div>
                  <div className="ud-profile-line">
                    <div className="ud-avatar">{initial}</div>
                    <div>
                      <strong>{userName || 'Gamer'}</strong>
                      <span>player@gametopup.com</span>
                    </div>
                    <button className="ud-btn-ghost" onClick={() => setEditOpen(true)}>Edit</button>
                  </div>
                </article>

                {/* Notifications */}
                <article className="ud-card">
                  <div className="ud-card-head">
                    <div>
                      <p className="ud-eyebrow">Notifications</p>
                      <h2>Preferences</h2>
                    </div>
                  </div>
                  {[
                    ['Order updates',   'Real-time payment and delivery status'],
                    ['Promotions',      'Flash deals, vouchers, and gaming events'],
                    ['Security alerts', 'Sign-in and account protection notices'],
                  ].map(([label, desc]) => (
                    <div key={label} className="ud-setting-row">
                      <span>
                        <strong>{label}</strong>
                        <small>{desc}</small>
                      </span>
                      <i />
                    </div>
                  ))}
                </article>

                {/* Security */}
                <article className="ud-card ud-danger-card">
                  <ShieldCheck className="ud-card-icon" />
                  <div>
                    <h2>Security</h2>
                    <p>Manage your password, 2FA, and active sessions.</p>
                  </div>
                  <button className="ud-btn-ghost" onClick={handleSignOut}>
                    <LogOut className="ud-button-icon" />
                    Sign Out
                  </button>
                </article>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      <EditProfileModal
        open={editOpen}
        userName={userName || 'Gamer'}
        onClose={() => setEditOpen(false)}
        onSave={(name) => {
          updateProfile(name);
          toast('success', 'Profile updated', `Display name changed to "${name}".`);
        }}
      />
    </div>
  );
}
