import { motion } from 'motion/react';
import {
  Clock, Zap, Wallet, Trophy, ChevronRight, Flame,
  Percent, Crown, History, ArrowUpRight, Coins,
  Swords, Target, ShoppingBag, Star, CheckCircle2,
} from 'lucide-react';
import { useRecentlyVisited } from '../context/RecentlyVisitedContext';
import { useAuth } from '../context/AuthContext';
import { games } from '../data/games';
import { GamesGrid } from './GamesGrid';
import { VoucherSection } from './VoucherSection';
import { Footer } from './Footer';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

/* ─── mock data ─────────────────────────────────────────────── */

const mockTransactions = [
  { id: 1, game: 'Mobile Legends', item: '300 Diamonds',       amount: 4.99,  status: 'completed', time: '2h ago',  image: '/images/mobile-legends.png' },
  { id: 2, game: 'PUBG Mobile',    item: '660 UC + 60 Bonus',  amount: 9.99,  status: 'completed', time: '1d ago',  image: '/images/pubg.png' },
  { id: 3, game: 'Genshin Impact', item: '980 Genesis Crystals',amount: 14.99,status: 'completed', time: '3d ago',  image: '/images/genshin.png' },
  { id: 4, game: 'Free Fire',      item: '310 Diamonds',       amount: 2.99,  status: 'completed', time: '5d ago',  image: '/images/free-fire.png' },
];

const flashDeals = [
  { id: 'mobile-legends', name: 'Mobile Legends', tag: 'HOT',     discount: '25% OFF', origPrice: 9.99,  salePrice: 7.49,  image: '/images/mobile-legends.png', endsIn: '02:45:18' },
  { id: 'valorant',       name: 'Valorant',       tag: 'LIMITED', discount: '15% OFF', origPrice: 19.99, salePrice: 16.99, image: '/images/valorant.png',        endsIn: '05:12:44' },
  { id: 'genshin-impact', name: 'Genshin Impact', tag: 'POPULAR', discount: '20% OFF', origPrice: 14.99, salePrice: 11.99, image: '/images/genshin.png',         endsIn: '11:08:33' },
];

const achievements = [
  { icon: Trophy,  label: 'First Top-up',  unlocked: true,  color: 'text-yellow-500', bg: 'bg-yellow-50  dark:bg-yellow-900/20' },
  { icon: Flame,   label: '7-Day Streak',  unlocked: true,  color: 'text-orange-500', bg: 'bg-orange-50  dark:bg-orange-900/20' },
  { icon: Crown,   label: 'VIP Member',    unlocked: true,  color: 'text-purple-500', bg: 'bg-purple-50  dark:bg-purple-900/20' },
  { icon: Target,  label: '10 Top-ups',    unlocked: false, color: 'text-gray-400',   bg: 'bg-gray-100   dark:bg-gray-800' },
  { icon: Swords,  label: 'Multi-gamer',   unlocked: false, color: 'text-gray-400',   bg: 'bg-gray-100   dark:bg-gray-800' },
];

const LOYALTY_CURRENT = 2450;
const LOYALTY_NEXT    = 3000;
const LOYALTY_LEVEL   = 'Silver';
const LOYALTY_NEXT_LV = 'Gold';
const loyaltyMilestones = [
  { pts: '500 pts',  reward: 'Free voucher',  done: true  },
  { pts: '1,500 pts', reward: '10% cashback', done: true  },
  { pts: '3,000 pts', reward: 'Gold badge',   done: false },
];

/* ─── shared sub-components ─────────────────────────────────── */

/** Consistent section header used by every section on the dashboard. */
function SectionHeader({
  gradient, icon: Icon, title, subtitle, action,
}: {
  gradient: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${gradient}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white font-heading leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
        >
          {action.label} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/** Consistent outer card shell used by every panel on the dashboard. */
function DashboardCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/* ─── page component ─────────────────────────────────────────── */

export function UserPage() {
  const { recentlyVisited } = useRecentlyVisited();
  const { userName, credits } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'topup' | 'voucher'>('all');

  const recentGames = recentlyVisited.map(id => games.find(g => g.id === id)).filter(Boolean);
  const quickGames  = games.slice(0, 6);
  const loyaltyPct  = Math.round((LOYALTY_CURRENT / LOYALTY_NEXT) * 100);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

      {/* ══ HERO WELCOME ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
        <div className="absolute top-0    left-0   w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0  w-80 h-80 bg-blue-600/25   rounded-full blur-3xl  translate-x-1/4   translate-y-1/4   pointer-events-none" />
        <div className="absolute top-1/2  left-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* top row: greeting + credits card */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-purple-300 text-xs font-semibold uppercase tracking-widest"
              >
                {greeting()},
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="text-white text-3xl sm:text-4xl font-bold mt-1 font-heading"
              >
                {userName || 'Gamer'} 👾
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
                className="flex flex-wrap items-center gap-2 mt-2"
              >
                <span className="px-2.5 py-1 bg-yellow-400/90 rounded-lg text-xs font-bold text-gray-900">Level 7 ✦ Silver</span>
                <span className="text-purple-300 text-xs">4 top-ups this month</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 sm:min-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-3.5 h-3.5 text-purple-300" />
                <p className="text-purple-200 text-[10px] font-semibold uppercase tracking-wider">Your Credits</p>
              </div>
              <p className="text-white text-3xl font-bold font-heading">{credits.toLocaleString()}</p>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/')}
                className="mt-3 w-full py-2 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-xl transition-colors"
              >
                + Add Credits
              </motion.button>
            </motion.div>
          </div>

          {/* stats row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            className="grid grid-cols-3 gap-3 mt-8"
          >
            {([
              { label: 'Total Spent',   value: '$33.96', icon: ShoppingBag },
              { label: 'Top-ups Done',  value: '4',      icon: Zap },
              { label: 'Reward Points', value: '2,450',  icon: Star },
            ] as const).map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-3 text-center">
                <Icon className="w-4 h-4 text-purple-300 mx-auto mb-1" />
                <p className="text-white text-base font-bold font-heading leading-tight">{value}</p>
                <p className="text-purple-300 text-[10px] mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ DASHBOARD CONTENT ════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Quick Top-up ── */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <SectionHeader
            gradient="bg-gradient-to-br from-purple-600 to-blue-600"
            icon={Zap}
            title="Quick Top-up"
            subtitle="Jump straight into your favourite games"
            action={{ label: 'See all', onClick: () => navigate('/') }}
          />
          <DashboardCard className="p-5">
            <div className="flex items-end gap-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {quickGames.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/game/${game.id}`)}
                  className="cursor-pointer group flex flex-col items-center gap-2 shrink-0"
                >
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-purple-500 transition-all shadow-sm group-hover:shadow-md group-hover:shadow-purple-500/20">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 text-center leading-tight w-16 truncate">{game.name}</p>
                </motion.div>
              ))}
            </div>
          </DashboardCard>
        </motion.section>

        {/* ── Flash Deals ── */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-red-500 to-orange-500">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white font-heading leading-tight">Flash Deals</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Limited-time offers — ends soon</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-full border border-red-200 dark:border-red-800/60">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-600 dark:text-red-400 text-[10px] font-bold tracking-wide">LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {flashDeals.map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/game/${deal.id}`)}
                className="cursor-pointer group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:shadow-purple-500/10 hover:border-purple-400/60 dark:hover:border-purple-600/60 transition-all"
              >
                {/* image */}
                <div className="relative h-32 overflow-hidden">
                  <img src={deal.image} alt={deal.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* badges */}
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      deal.tag === 'HOT'     ? 'bg-red-500 text-white' :
                      deal.tag === 'LIMITED' ? 'bg-orange-500 text-white' :
                                               'bg-purple-600 text-white'
                    }`}>{deal.tag}</span>
                    <span className="px-2 py-0.5 bg-green-500 rounded-md text-[10px] font-bold text-white">{deal.discount}</span>
                  </div>
                  {/* countdown */}
                  <span className="absolute bottom-2 right-2.5 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[10px] font-mono font-bold">
                    {deal.endsIn}
                  </span>
                </div>
                {/* body */}
                <div className="p-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{deal.name}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">${deal.salePrice}</span>
                    <span className="text-xs text-gray-400 line-through">${deal.origPrice}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-xl hover:shadow-md hover:shadow-purple-500/25 transition-shadow"
                  >
                    Grab Deal
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Loyalty + Achievements (2-col) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Loyalty Progress */}
          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <SectionHeader
              gradient="bg-gradient-to-br from-amber-400 to-orange-500"
              icon={Crown}
              title="Loyalty Progress"
              subtitle="Level up to unlock exclusive rewards"
            />
            <DashboardCard className="p-5">
              {/* tier labels + progress bar */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-[11px] font-bold text-gray-600 dark:text-gray-300">{LOYALTY_LEVEL}</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">{LOYALTY_CURRENT.toLocaleString()} pts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">{LOYALTY_NEXT.toLocaleString()} pts</span>
                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-md text-[11px] font-bold text-yellow-700 dark:text-yellow-400">{LOYALTY_NEXT_LV}</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${loyaltyPct}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
                <span className="font-bold text-orange-500">{(LOYALTY_NEXT - LOYALTY_CURRENT).toLocaleString()} pts</span> more to reach {LOYALTY_NEXT_LV}
              </p>

              {/* milestones */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {loyaltyMilestones.map(({ pts, reward, done }) => (
                  <div
                    key={pts}
                    className={`rounded-xl p-3 text-center border ${
                      done
                        ? 'bg-green-50 dark:bg-green-900/15 border-green-200 dark:border-green-800/60'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {done && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mx-auto mb-1" />}
                    <p className={`text-[10px] font-bold leading-tight ${done ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>{pts}</p>
                    <p className={`text-[10px] mt-0.5 leading-tight ${done ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>{reward}</p>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.section>

          {/* Achievements */}
          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }}>
            <SectionHeader
              gradient="bg-gradient-to-br from-purple-500 to-violet-600"
              icon={Trophy}
              title="Achievements"
              subtitle="3 of 5 unlocked"
            />
            <DashboardCard className="p-5">
              <div className="flex flex-wrap gap-2.5">
                {achievements.map(({ icon: Icon, label, unlocked, color, bg }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.22 + i * 0.06 }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors w-[72px] ${
                      unlocked
                        ? 'border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'
                        : 'border-dashed border-gray-200 dark:border-gray-800 opacity-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${unlocked ? bg : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <Icon className={`w-4.5 h-4.5 ${unlocked ? color : 'text-gray-300 dark:text-gray-600'}`} />
                    </div>
                    <p className={`text-[10px] font-semibold text-center leading-tight ${unlocked ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                      {label}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* XP bar */}
              <div className="mt-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">XP · Level 7</span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">730 / 1,000 XP</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: '73%' }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">270 XP to Level 8 · +10 XP per top-up</p>
              </div>
            </DashboardCard>
          </motion.section>
        </div>

        {/* ── Transaction History ── */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500">
                <History className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white font-heading leading-tight">Recent Transactions</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your latest top-up history</p>
              </div>
            </div>
            {/* tab switcher */}
            <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {(['all', 'topup', 'voucher'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <DashboardCard className="overflow-hidden">
            {mockTransactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.05 }}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                  i < mockTransactions.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                  <img src={tx.image} alt={tx.game} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{tx.game}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{tx.item}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">${tx.amount}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold">{tx.status}</p>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 w-10 text-right">{tx.time}</p>
              </motion.div>
            ))}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              <button className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                View full history <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </DashboardCard>
        </motion.section>

        {/* ── Recently Visited (conditional) ── */}
        {recentGames.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
            <SectionHeader
              gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
              icon={Clock}
              title="Recently Visited"
              subtitle="Pick up where you left off"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentGames.map((game, i) => (
                <motion.div
                  key={game!.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07 }}
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(`/game/${game!.id}`)}
                  className="cursor-pointer group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:shadow-purple-500/10 hover:border-purple-400/60 dark:hover:border-purple-600/60 transition-all"
                >
                  <div className="relative h-24 overflow-hidden">
                    <img src={game!.image} alt={game!.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                    <p className="absolute bottom-2 left-3 text-white text-sm font-bold drop-shadow">{game!.name}</p>
                  </div>
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-purple-500" />
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Top-up now</span>
                    </div>
                    <span className="text-[10px] bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-lg font-semibold">Instant</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Member Promo Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 p-6 sm:p-8"
        >
          <div className="absolute -top-8  -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-300 text-[10px] font-bold uppercase tracking-wider">Member Exclusive</span>
              </div>
              <h3 className="text-white text-2xl sm:text-3xl font-bold font-heading">Get 20% OFF</h3>
              <p className="text-purple-200 text-sm mt-1">
                Use code{' '}
                <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg font-mono">MEMBER20</span>
                {' '}on your next top-up
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/')}
              className="shrink-0 px-6 py-2.5 bg-white text-purple-700 font-bold text-sm rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
            >
              Claim Now
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ══ BROWSE GAMES ═════════════════════════════════════════ */}
      <GamesGrid sectionClassName="bg-gray-50 dark:bg-gray-950" />
      <VoucherSection sectionClassName="bg-gray-50 dark:bg-gray-950" />
      <Footer />
    </div>
  );
}
