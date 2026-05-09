import { AnimatePresence, motion } from 'motion/react';
import {
  Bell,
  CheckCheck,
  ChevronDown,
  DollarSign,
  Gift,
  Globe,
  HelpCircle,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Star,
  Sun,
  Trophy,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguageCurrency } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { games } from '../data/games';
import { translate } from '../utils/translations';
import { PageLoader } from './PageLoader';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Espanol' },
  { code: 'fr', name: 'Francais' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: 'Chinese' },
  { code: 'fil', name: 'Filipino' },
];

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'PHP'];

function SearchBar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguageCurrency();

  const results = query.trim()
    ? games.filter((game) => game.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="gt-search-wrap" style={mobile ? { display: 'block', maxWidth: 'none' } : undefined}>
      <Search className="gt-search-icon" />
      <input
        className="gt-search"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        placeholder={translate('searchGames', language)}
      />
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            className="gt-search-results"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {results.map((game) => (
              <button
                key={game.id}
                className="gt-search-result"
                onClick={() => {
                  navigate(`/game/${game.id}`);
                  setQuery('');
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                <img src={game.image} alt={game.name} />
                <span>
                  <strong style={{ display: 'block', fontSize: '0.8rem' }}>{game.name}</strong>
                  <span style={{ display: 'block', fontSize: '0.68rem', color: '#6b7280' }}>{game.category}</span>
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HeaderRedesign() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Mobile Legends top-up complete', detail: '300 Diamonds credited', time: '2h', read: false },
    { id: 2, type: 'promo', message: 'Voucher SAVE20 is ready', detail: '20% off your next top-up', time: '1d', read: false },
    { id: 3, type: 'event', message: 'Honor of Kings weekend event', detail: 'Extra rewards are live now', time: '3d', read: true },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, currency, setLanguage, setCurrency } = useLanguageCurrency();
  const { isAuthenticated, userName, credits, logout } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ── Close dropdowns when clicking outside ──────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideNotif = notifRef.current?.contains(target);
      const clickedInsideProfile = profileRef.current?.contains(target);
      if (!clickedInsideNotif) setNotificationsOpen(false);
      if (!clickedInsideProfile) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Close mobile menu on route change ─────────────────────── */
  useEffect(() => {
    setMobileOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const closeAll = () => {
    setNotificationsOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      setLoggingOut(false);
      setConfirmLogout(false);
      closeAll();
      navigate('/');
    }, 900);
  };

  const navItems = [
    { label: translate('home', language), path: '/' },
    ...(isAuthenticated ? [{ label: 'Dashboard', path: '/user' }] : []),
    { label: translate('help', language), path: '/help' },
  ];

  return (
    <>
      {loggingOut && <PageLoader />}
      <header className="gt-header">
        <div className="gt-header-shell">
          <div className="gt-header-row">

            {/* ── Brand — always home ───────────────────────────── */}
            <motion.button
              className="gt-brand"
              onClick={() => navigate('/')}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="gt-brand-mark">
                <img src="/bg/up-arrow.png" alt="GameTopUp" />
              </span>
              <span className="gt-brand-text">GameTopUp</span>
            </motion.button>

            {/* ── Search ───────────────────────────────────────── */}
            <SearchBar />

            {/* ── Actions ──────────────────────────────────────── */}
            <div className="gt-header-actions">
              <nav className="gt-nav" aria-label="Main navigation">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    className={`gt-nav-link${location.pathname === item.path ? ' is-active' : ''}`}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Theme toggle */}
              <button className="gt-tool-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? <Moon /> : <Sun />}
              </button>

              {isAuthenticated ? (
                <>
                  {/* ── Notifications ──────────────────────────── */}
                  <div ref={notifRef} style={{ position: 'relative' }}>
                    <button
                      className={`gt-tool-btn${notificationsOpen ? ' is-open' : ''}`}
                      onClick={() => {
                        setProfileOpen(false);
                        setNotificationsOpen((v) => !v);
                      }}
                      aria-label="Open notifications"
                      aria-expanded={notificationsOpen}
                    >
                      <Bell />
                      {unreadCount > 0 && <span className="gt-icon-badge">{unreadCount}</span>}
                    </button>

                    <AnimatePresence>
                      {notificationsOpen && (
                        <motion.div
                          className="gt-dropdown gt-notification-menu"
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="gt-dropdown-head">
                            <div>
                              <p className="gt-dropdown-title">Notifications</p>
                              <p className="gt-dropdown-subtitle">
                                {unreadCount ? `${unreadCount} unread` : 'All caught up'}
                              </p>
                            </div>
                            <button
                              className="gt-mark-read"
                              onClick={() => setNotifications((items) => items.map((n) => ({ ...n, read: true })))}
                            >
                              <CheckCheck style={{ width: '0.8rem', height: '0.8rem', display: 'inline', verticalAlign: '-0.1rem', marginRight: '0.3rem' }} />
                              Mark all read
                            </button>
                          </div>

                          <div className="gt-notification-list">
                            {notifications.map((item) => (
                              <button
                                key={item.id}
                                className={`gt-notification-item${item.read ? '' : ' is-unread'}`}
                                onClick={() => setNotifications((ns) => ns.map((n) => n.id === item.id ? { ...n, read: true } : n))}
                              >
                                <span className="gt-notification-icon">
                                  {item.type === 'success' && <Zap style={{ color: '#16a34a' }} />}
                                  {item.type === 'promo' && <Gift style={{ color: '#d97706' }} />}
                                  {item.type === 'event' && <Star style={{ color: '#2563eb' }} />}
                                </span>
                                <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                  <span className="gt-notification-message">{item.message}</span>
                                  <span className="gt-notification-detail">{item.detail}</span>
                                </span>
                                <span className="gt-notification-meta">
                                  <span className="gt-notification-time">{item.time}</span>
                                  {!item.read && <span className="gt-unread-dot" />}
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Profile ────────────────────────────────── */}
                  <div ref={profileRef} style={{ position: 'relative' }}>
                    <motion.button
                      className={`gt-account-btn${profileOpen ? ' is-open' : ''}`}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setNotificationsOpen(false);
                        setProfileOpen((v) => !v);
                      }}
                      aria-expanded={profileOpen}
                    >
                      <span className="gt-avatar">{userName.charAt(0).toUpperCase()}</span>
                      <span className="gt-account-name">{userName}</span>
                      <ChevronDown className={`gt-account-chevron${profileOpen ? ' is-flipped' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          className="gt-dropdown gt-profile-menu"
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                        >
                          {/* Profile summary */}
                          <div className="gt-profile-summary">
                            <div className="gt-profile-main">
                              <div className="gt-profile-avatar">{userName.charAt(0).toUpperCase()}</div>
                              <div style={{ minWidth: 0 }}>
                                <p className="gt-profile-name">{userName}</p>
                                <div className="gt-profile-meta">
                                  <span className="gt-level-pill">LVL 7</span>
                                  <span className="gt-tier-pill">Silver Gamer</span>
                                </div>
                              </div>
                            </div>
                            <div className="gt-profile-balance">
                              <div>
                                <span>Credits</span>
                                <strong>{credits.toLocaleString()}</strong>
                              </div>
                              <button
                                className="gt-small-cta"
                                onClick={() => { navigate('/'); closeAll(); }}
                              >
                                Top up
                              </button>
                            </div>
                          </div>

                          {/* Quick links */}
                          <div className="gt-profile-actions">
                            {[
                              { icon: LayoutDashboard, label: 'Dashboard',    path: '/user' },
                              { icon: History,         label: 'Transactions', path: '/user?tab=transactions' },
                              { icon: Wallet,          label: 'Wallet',       path: '/user?tab=wallet' },
                              { icon: Trophy,          label: 'Settings',     path: '/user?tab=settings' },
                            ].map(({ icon: Icon, label, path }) => (
                              <button
                                key={label}
                                className="gt-profile-action"
                                onClick={() => { navigate(path); closeAll(); }}
                              >
                                <Icon />
                                {label}
                              </button>
                            ))}
                          </div>

                          {/* Locale selectors */}
                          <div className="gt-profile-locale">
                            <label className="gt-locale-item">
                              <Globe style={{ width: '0.8rem', height: '0.8rem', flexShrink: 0, color: '#6b7280' }} />
                              <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Parameters<typeof setLanguage>[0])}
                                className="gt-locale-select"
                              >
                                {languages.map((l) => (
                                  <option key={l.code} value={l.code}>{l.name}</option>
                                ))}
                              </select>
                            </label>
                            <label className="gt-locale-item">
                              <DollarSign style={{ width: '0.8rem', height: '0.8rem', flexShrink: 0, color: '#6b7280' }} />
                              <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as Parameters<typeof setCurrency>[0])}
                                className="gt-locale-select"
                              >
                                {currencies.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </label>
                          </div>

                          {/* Footer actions */}
                          <div className="gt-profile-footer">
                            <button
                              className="gt-text-link"
                              onClick={() => { navigate('/user?tab=settings'); closeAll(); }}
                            >
                              <Settings style={{ width: '0.8rem', height: '0.8rem', display: 'inline', verticalAlign: '-0.12rem', marginRight: '0.3rem' }} />
                              Settings
                            </button>
                            <button className="gt-danger-link" onClick={() => setConfirmLogout(true)}>
                              <LogOut style={{ width: '0.8rem', height: '0.8rem', display: 'inline', verticalAlign: '-0.12rem', marginRight: '0.3rem' }} />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <button className="gt-primary-btn" onClick={() => navigate('/signin')}>
                  {translate('signIn', language)}
                </button>
              )}
            </div>

            {/* ── Mobile toggle ─────────────────────────────────── */}
            <button
              className={`gt-mobile-toggle${mobileOpen ? ' is-open' : ''}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X style={{ width: '1.1rem', height: '1.1rem' }} />
                  </motion.span>
                ) : (
                  <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu style={{ width: '1.1rem', height: '1.1rem' }} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* ── Mobile panel ──────────────────────────────────────── */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                className="gt-mobile-panel"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <SearchBar mobile onNavigate={() => setMobileOpen(false)} />

                <div className="gt-mobile-nav">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      className={`gt-mobile-nav-link${location.pathname === item.path ? ' is-active' : ''}`}
                      onClick={() => { navigate(item.path); setMobileOpen(false); }}
                    >
                      {item.path === '/help' && <HelpCircle style={{ width: '0.95rem', height: '0.95rem' }} />}
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="gt-mobile-tools">
                  <button className="gt-mobile-tool-btn" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon /> : <Sun />}
                    <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
                  </button>

                  {isAuthenticated ? (
                    <div className="gt-mobile-user">
                      <div className="gt-mobile-user-row">
                        <div className="gt-avatar">{userName.charAt(0).toUpperCase()}</div>
                        <div>
                          <strong className="gt-mobile-user-name">{userName}</strong>
                          <span className="gt-mobile-user-credits">{credits.toLocaleString()} credits</span>
                        </div>
                      </div>
                      <div className="gt-mobile-user-actions">
                        <button className="gt-mobile-action-btn" onClick={() => { navigate('/user'); setMobileOpen(false); }}>
                          <LayoutDashboard />Dashboard
                        </button>
                        <button className="gt-mobile-action-btn" onClick={() => { navigate('/user?tab=wallet'); setMobileOpen(false); }}>
                          <Wallet />Wallet
                        </button>
                        <button className="gt-mobile-action-btn" onClick={() => { navigate('/user?tab=transactions'); setMobileOpen(false); }}>
                          <History />Orders
                        </button>
                        <button className="gt-mobile-action-btn" onClick={() => { navigate('/user?tab=settings'); setMobileOpen(false); }}>
                          <Settings />Settings
                        </button>
                      </div>
                      <button
                        className="gt-mobile-signout"
                        onClick={() => { setMobileOpen(false); setConfirmLogout(true); }}
                      >
                        <LogOut />Sign out
                      </button>
                    </div>
                  ) : (
                    <button
                      className="gt-primary-btn"
                      style={{ width: '100%' }}
                      onClick={() => { navigate('/signin'); setMobileOpen(false); }}
                    >
                      {translate('signIn', language)}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Confirm logout dialog ──────────────────────────────────── */}
      <AnimatePresence>
        {confirmLogout && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[80]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmLogout(false)}
            />
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <div
                className="gt-panel"
                style={{ width: 'min(22rem, 100%)', padding: '1.25rem' }}
                onClick={(e) => e.stopPropagation()}
              >
                <p className="gt-section-title">Sign out?</p>
                <p className="gt-section-subtitle" style={{ marginTop: '0.35rem' }}>
                  You'll need to sign in again to access your wallet and rewards.
                </p>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.1rem' }}>
                  <button className="gt-secondary-btn" style={{ flex: 1 }} onClick={() => setConfirmLogout(false)}>
                    Cancel
                  </button>
                  <button
                    className="gt-primary-btn"
                    style={{ flex: 1, background: '#dc2626', boxShadow: 'none' }}
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
