import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Moon, Sun, Globe, DollarSign, Bell, Gift, User, Settings, LogOut, ChevronDown, Zap, CheckCheck, TrendingUp, LayoutDashboard, History, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguageCurrency } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { translate } from '../utils/translations';
import { games } from '../data/games';
import { PageLoader } from './PageLoader';

function SearchBar({ mobile, language }: { mobile?: boolean; language: any }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const filteredGames = query.trim() ? games.filter(game => 
    game.name.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={translate('searchGames', language)}
        className={`${mobile ? 'w-full' : 'w-64'} px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
      />
      <AnimatePresence>
        {isOpen && filteredGames.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-[60]"
          >
            {filteredGames.map(game => (
              <div
                key={game.id}
                onClick={() => { navigate(`/game/${game.id}`); setQuery(''); setIsOpen(false); }}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <img src={game.image} alt={game.name} className="w-10 h-10 rounded object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{game.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{game.category}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVouchers, setShowVouchers] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, currency, setLanguage, setCurrency } = useLanguageCurrency();
  const { isAuthenticated, userName, credits, logout } = useAuth();

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', icon: 'topup', message: 'Top-up for Mobile Legends was successful!', detail: '300 Diamonds credited', time: '2h ago', read: false },
    { id: 2, type: 'promo', icon: 'gift', message: 'New 20% discount voucher available!', detail: 'Use code: SAVE20 — expires Dec 31', time: '1d ago', read: false },
    { id: 3, type: 'success', icon: 'topup', message: 'PUBG Mobile top-up complete', detail: '660 UC + 60 UC bonus added', time: '2d ago', read: true },
    { id: 4, type: 'event', icon: 'event', message: 'Honor of Kings event started', detail: '25% OFF all packages this weekend', time: '3d ago', read: true },
  ]);

  const vouchers = [
    { code: 'SAVE20', discount: '20%', expiry: '2025-12-31', used: false },
    { code: 'WELCOME10', discount: '10%', expiry: '2025-06-30', used: false },
    { code: 'SUMMER25', discount: '25%', expiry: '2025-03-31', used: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'fil', name: 'Filipino' },
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'PHP'];

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate('/');
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      setUserMenuOpen(false);
    }, 1500);
  };

  return (
    <>
      {isLoggingOut && <PageLoader />}
      <header className="shadow-sm sticky top-0 z-50 transition-colors bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="p-2 rounded-lg">
              <img src="/bg/up-arrow.png" alt="GameTopUp Logo" className="w-6 h-6" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">GameTopUp</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/"
              className={`transition-colors ${
                isActive('/')
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {translate('home', language)}
            </a>
            <a
              href="/help"
              className={`transition-colors ${
                isActive('/help')
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {translate('help', language)}
            </a>
            
            {/* Search Bar */}
            <SearchBar language={language} />
            
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center gap-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs">{language.toUpperCase()}</span>
              </motion.button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[120px] z-[60]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code as any); setLangOpen(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrOpen(!currOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center gap-1"
              >
                <DollarSign className="w-5 h-5" />
                <span className="text-xs">{currency}</span>
              </motion.button>
              <AnimatePresence>
                {currOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[100px] z-[60]"
                  >
                    {currencies.map((curr) => (
                      <button
                        key={curr}
                        onClick={() => { setCurrency(curr as any); setCurrOpen(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        {curr}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setShowNotifications(!showNotifications); setUserMenuOpen(false); }}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white relative"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full mt-3 right-0 w-[360px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/80 dark:border-gray-700/80 z-[60] overflow-hidden"
                        style={{ boxShadow: '0 20px 60px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(147,51,234,0.08)' }}
                      >
                        {/* Header */}
                        <div className="px-5 py-4 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-white text-sm font-heading">Notifications</h3>
                            <p className="text-purple-200 text-xs mt-0.5">
                              {notifications.filter(n => !n.read).length > 0
                                ? `${notifications.filter(n => !n.read).length} unread`
                                : 'All caught up!'}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </motion.button>
                        </div>

                        {/* Notification list */}
                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                          {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                              <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.04 }}
                                onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                                className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
                                  !notif.read ? 'bg-purple-50/60 dark:bg-purple-900/10' : ''
                                }`}
                              >
                                {/* Icon */}
                                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${
                                  notif.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                                  notif.type === 'promo' ? 'bg-amber-100 dark:bg-amber-900/30' :
                                  'bg-blue-100 dark:bg-blue-900/30'
                                }`}>
                                  {notif.icon === 'topup' && <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />}
                                  {notif.icon === 'gift' && <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                                  {notif.icon === 'event' && <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-semibold leading-snug ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{notif.detail}</p>
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                                </div>
                                {!notif.read && (
                                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-600 mt-1.5" />
                                )}
                              </motion.div>
                            ))
                          ) : (
                            <div className="px-5 py-10 text-center">
                              <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No notifications yet</p>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700/80">
                          <button className="w-full text-xs text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-center">
                            View all notifications →
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setShowNotifications(false); }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all font-medium text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-[11px] font-bold shrink-0">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[90px] truncate">{userName}</span>
                    <motion.div
                      animate={{ rotate: userMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full mt-3 right-0 w-[270px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/80 dark:border-gray-700/80 z-[60] overflow-hidden"
                        style={{ boxShadow: '0 20px 60px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(147,51,234,0.08)' }}
                      >
                        {/* Profile Header */}
                        <div className="px-5 py-5 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 relative overflow-hidden">
                          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                          <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full bg-blue-500/20 blur-2xl" />
                          <div className="relative flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-lg font-bold text-white shrink-0">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm leading-tight truncate">{userName}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <div className="px-1.5 py-0.5 bg-yellow-400/90 rounded text-[10px] font-bold text-gray-900 leading-none">
                                  LVL 7
                                </div>
                                <span className="text-purple-200 text-[10px]">Gaming Member</span>
                              </div>
                            </div>
                          </div>
                          {/* Credits display */}
                          <div className="relative mt-4 bg-white/15 backdrop-blur-sm rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                            <div>
                              <p className="text-purple-200 text-[10px] font-semibold uppercase tracking-wider">Credits Balance</p>
                              <p className="text-white text-xl font-bold mt-0.5 font-heading">{credits.toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { navigate('/user'); setUserMenuOpen(false); }}
                                className="px-2.5 py-1 bg-white/25 hover:bg-white/35 text-white text-[10px] font-bold rounded-lg transition-colors"
                              >
                                + Top Up
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-2">
                          {[
                            { icon: LayoutDashboard, label: 'My Dashboard', color: 'text-purple-600 dark:text-purple-400', action: () => { navigate('/user'); setUserMenuOpen(false); } },
                            { icon: History, label: 'Transaction History', color: 'text-blue-600 dark:text-blue-400', action: () => { navigate('/user'); setUserMenuOpen(false); } },
                            { icon: Gift, label: 'My Vouchers', color: 'text-amber-600 dark:text-amber-400', action: () => { setShowVouchers(true); setUserMenuOpen(false); } },
                            { icon: TrendingUp, label: 'Rewards & Points', color: 'text-green-600 dark:text-green-400', action: () => { navigate('/user'); setUserMenuOpen(false); } },
                            { icon: Settings, label: 'Settings', color: 'text-gray-500 dark:text-gray-400', action: () => setUserMenuOpen(false) },
                          ].map(({ icon: Icon, label, color, action }) => (
                            <motion.button
                              key={label}
                              whileHover={{ x: 2 }}
                              onClick={action}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group"
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors`}>
                                <Icon className={`w-3.5 h-3.5 ${color}`} />
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                            </motion.button>
                          ))}
                          <div className="mx-4 my-1.5 border-t border-gray-100 dark:border-gray-800" />
                          <motion.button
                            whileHover={{ x: 2 }}
                            onClick={() => { setShowLogoutConfirm(true); setUserMenuOpen(false); }}
                            className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                              <LogOut className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">Sign Out</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Vouchers Modal */}
                <AnimatePresence>
                  {showVouchers && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setShowVouchers(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-heading">My Vouchers</h3>
                            <button onClick={() => setShowVouchers(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {vouchers.map((voucher, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-xl border-2 ${
                                  voucher.used
                                    ? 'border-gray-300 dark:border-gray-600 opacity-50'
                                    : 'border-purple-600 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono">
                                    {voucher.code}
                                  </span>
                                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                    {voucher.discount} OFF
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm mb-3">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Expires: {voucher.expiry}
                                  </span>
                                  {voucher.used && (
                                    <span className="text-red-600 dark:text-red-400 font-semibold">Used</span>
                                  )}
                                </div>
                                {!voucher.used && (
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-shadow"
                                  >
                                    Use Now
                                  </motion.button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Logout Confirmation Modal */}
                <AnimatePresence>
                  {showLogoutConfirm && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setShowLogoutConfirm(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xs p-6" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Confirm Logout</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed font-medium">
                            Are you sure you want to logout? You'll need to sign in again to access your account.
                          </p>
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowLogoutConfirm(false)}
                              className="flex-1 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleLogout}
                              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
                            >
                              Logout
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signin')}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
              >
                {translate('signIn', language)}
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.button>
            
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 flex flex-col gap-4"
          >
            {/* Mobile Search Bar */}
            <SearchBar mobile language={language} />
            <a
              href="/"
              className={`transition-colors ${
                isActive('/')
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {translate('home', language)}
            </a>
            <a
              href="/help"
              className={`transition-colors ${
                isActive('/help')
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {translate('help', language)}
            </a>
            <button
              onClick={() => {
                navigate('/user');
                setMobileMenuOpen(false);
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
            >
              {translate('signIn', language)}
            </button>
          </motion.nav>
        )}
      </div>
    </header>
    </>
  );
}