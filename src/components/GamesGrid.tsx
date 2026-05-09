import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  Flame,
  Gamepad2,
  Grid3x3,
  Search,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { games as localGames } from '../data/games';
import { useRawgEnrichment } from '../hooks/useRawgEnrichment';
import { hasRawgKey } from '../services/rawg';
import type { Game } from '../types';
import { useLanguageCurrency } from '../context/LanguageContext';
import { translate } from '../utils/translations';

const PAGE_SIZE = 9;

/* ══════════════════════════════════════════════════════════════ */
/* ── Card skeleton ──────────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════════ */
function CardSkeleton() {
  return (
    <div className="gc-card-skeleton">
      <div className="gc-skeleton-img" />
      <div className="gc-skeleton-body">
        <div className="gc-skeleton-line gc-skeleton-title" />
        <div className="gc-skeleton-line gc-skeleton-sub" />
        <div className="gc-skeleton-line gc-skeleton-sub" style={{ width: '55%' }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ── Rating stars ───────────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════════ */
function RatingStars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="gc-stars" aria-label={`${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`gc-star${i <= filled ? ' filled' : ''}`}
        />
      ))}
      <span className="gc-star-val">{rating.toFixed(1)}</span>
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ── Game card ──────────────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════════ */
interface GameCardProps {
  game: Game;
  index: number;
  cover: string;
  rating: number | null;
  size?: 'normal' | 'compact';
}

function GameCard({ game, index, cover, rating, size = 'normal' }: GameCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`gc-card${size === 'compact' ? ' gc-card-compact' : ''}`}
      onClick={() => navigate(`/game/${game.id}`)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div
          className="gc-card-glow"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(139,92,246,0.16), transparent 40%)`,
          }}
        />
      )}

      <div className="gc-card-inner">
        {/* Cover image */}
        <div className="gc-card-cover">
          <img src={cover} alt={game.name} className="gc-card-img" />
          <div className="gc-card-overlay" />

          <div className="gc-card-badges">
            <span className="gc-badge gc-badge-event">
              <Zap className="gc-badge-icon" /> EVENT
            </span>
            {game.discount && (
              <span className="gc-badge gc-badge-discount">{game.discount}</span>
            )}
          </div>

          {hasRawgKey() && rating !== null && (
            <div className="gc-card-rating">
              <RatingStars rating={rating} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="gc-card-body">
          <h3 className="gc-card-title">{game.name}</h3>
          <p className="gc-card-desc">{game.description}</p>
          <div className="gc-card-footer">
            <span className="gc-card-cta">
              <Coins className="gc-cta-icon" />
              Top-up now
            </span>
            <span className="gc-badge-instant">Instant</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ── SECTION 1 — Hero Carousel ──────────────────────────────── */
/* ══════════════════════════════════════════════════════════════ */
function HeroCarousel({
  games,
  enrichLoading,
  coverOf,
  ratingOf,
}: {
  games: Game[];
  enrichLoading: boolean;
  coverOf: (id: string, fallback: string) => string;
  ratingOf: (id: string) => number | null;
}) {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const featured = useMemo(
    () => games.slice(0, 5),
    [games],
  );

  const goTo = useCallback(
    (next: number) => {
      const clamped = (next + featured.length) % featured.length;
      setDir(next > idx ? 1 : -1);
      setIdx(clamped);
    },
    [idx, featured.length],
  );

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDir(1);
      setIdx((i) => (i + 1) % featured.length);
    }, 5000);
  }, [featured.length]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const game = featured[idx];
  if (!game) return null;

  const cover = coverOf(game.id, game.image);

  return (
    <div className="gc-hero-wrap">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${idx}-${game.id}`}
          className="gc-hero-slide"
          initial={{ x: dir > 0 ? '100%' : '-100%', opacity: 0.4 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: dir > 0 ? '-100%' : '100%', opacity: 0.4 }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Background image */}
          <div className="gc-hero-bg">
            {enrichLoading ? (
              <div className="gc-hero-bg-skeleton" />
            ) : (
              <img src={cover} alt={game.name} className="gc-hero-bg-img" />
            )}
            <div className="gc-hero-bg-grad" />
          </div>

          {/* Content */}
          <div className="gc-hero-content">
            <div className="gc-hero-left">
              <span className="gc-hero-tag">
                <Flame className="gc-tag-icon" /> Featured
              </span>
              <h2 className="gc-hero-title">{game.name}</h2>
              <p className="gc-hero-desc">{game.description}</p>

              <div className="gc-hero-meta">
                <span className="gc-hero-cat">{game.category}</span>
                {game.discount && (
                  <span className="gc-badge gc-badge-discount">{game.discount}</span>
                )}
                {hasRawgKey() && ratingOf(game.id) !== null && (
                  <RatingStars rating={ratingOf(game.id)!} />
                )}
              </div>

              <button
                className="gc-hero-btn"
                onClick={() => navigate(`/game/${game.id}`)}
              >
                <Coins className="gc-hero-btn-icon" />
                Top Up Now
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        className="gc-hero-arrow gc-arrow-prev"
        onClick={() => { goTo(idx - 1); resetTimer(); }}
        aria-label="Previous"
      >
        <ChevronLeft />
      </button>
      <button
        className="gc-hero-arrow gc-arrow-next"
        onClick={() => { goTo(idx + 1); resetTimer(); }}
        aria-label="Next"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="gc-hero-dots">
        {featured.map((g, i) => (
          <button
            key={g.id}
            className={`gc-dot${i === idx ? ' is-active' : ''}`}
            onClick={() => { goTo(i); resetTimer(); }}
            aria-label={`Go to ${g.name}`}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="gc-hero-thumbs">
        {featured.map((g, i) => (
          <button
            key={g.id}
            className={`gc-thumb${i === idx ? ' is-active' : ''}`}
            onClick={() => { goTo(i); resetTimer(); }}
          >
            <img src={coverOf(g.id, g.image)} alt={g.name} />
            <span>{g.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ── Trust / stats bar ──────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════════ */
function TrustBar() {
  const items = [
    { icon: Users, value: '2M+', label: 'Happy Gamers' },
    { icon: Gamepad2, value: '50+', label: 'Games Available' },
    { icon: ShieldCheck, value: '100%', label: 'Secure Checkout' },
    { icon: Clock, value: '<1 min', label: 'Instant Delivery' },
  ];

  return (
    <div className="lp-trust-bar">
      {items.map(({ icon: Icon, value, label }) => (
        <div key={label} className="lp-trust-item">
          <div className="lp-trust-icon-wrap">
            <Icon className="lp-trust-icon" />
          </div>
          <div className="lp-trust-text">
            <strong className="lp-trust-val">{value}</strong>
            <span className="lp-trust-label">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ── SECTION 2 — Popular horizontal carousel ────────────────── */
/* ══════════════════════════════════════════════════════════════ */
function PopularCarousel({
  games,
  coverOf,
  ratingOf,
}: {
  games: Game[];
  coverOf: (id: string, fallback: string) => string;
  ratingOf: (id: string) => number | null;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const popular = useMemo(
    () => [...games].sort((a, b) => b.popularity - a.popularity).slice(0, 8),
    [games],
  );

  const scroll = (dir: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <div className="gc-pop-wrap">
      <button className="gc-pop-arrow gc-pop-prev" onClick={() => scroll('prev')} aria-label="Scroll left">
        <ChevronLeft />
      </button>

      <div className="gc-pop-track" ref={trackRef}>
        {popular.map((game, i) => (
          <div key={game.id} className="gc-pop-item">
            <GameCard
              game={game}
              index={i}
              cover={coverOf(game.id, game.image)}
              rating={ratingOf(game.id)}
              size="compact"
            />
          </div>
        ))}
      </div>

      <button className="gc-pop-arrow gc-pop-next" onClick={() => scroll('next')} aria-label="Scroll right">
        <ChevronRight />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ── SECTION 3 — Browse all (paginated + filter + search) ───── */
/* ══════════════════════════════════════════════════════════════ */
function BrowseAll({
  games,
  coverOf,
  ratingOf,
}: {
  games: Game[];
  coverOf: (id: string, fallback: string) => string;
  ratingOf: (id: string) => number | null;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const { language } = useLanguageCurrency();

  const categories = useMemo(
    () => Array.from(new Set(games.map((g) => g.category))).sort(),
    [games],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return games.filter((g) => {
      const matchSearch = !q || g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q);
      const matchCat = !category || g.category === category;
      return matchSearch && matchCat;
    });
  }, [games, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageGames = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleCategory = (v: string) => { setCategory(v); setPage(1); };

  return (
    <div>
      {/* Toolbar */}
      <div className="gc-browse-toolbar">
        <div className="gc-browse-search-wrap">
          <Search className="gc-browse-search-icon" />
          <input
            className="gc-browse-search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={translate('searchGames', language)}
          />
        </div>

        <div className="gc-browse-cats">
          <button
            className={`gc-cat-pill${!category ? ' is-active' : ''}`}
            onClick={() => handleCategory('')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`gc-cat-pill${category === cat ? ' is-active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count + RAWG badge row */}
      <div className="gc-browse-meta-row">
        <p className="gc-browse-count">
          {filtered.length} game{filtered.length !== 1 ? 's' : ''}
          {search && ` for "${search}"`}
          {category && ` in ${category}`}
        </p>
        {hasRawgKey() && <span className="gc-rawg-badge">Powered by RAWG</span>}
      </div>

      {/* Grid */}
      {pageGames.length === 0 ? (
        <div className="gc-empty">
          <Gamepad2 className="gc-empty-icon" />
          <strong>No games found</strong>
          <span>Try a different search or clear the category filter.</span>
          <button className="gc-empty-reset" onClick={() => { setSearch(''); setCategory(''); }}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className="gc-browse-grid">
          <AnimatePresence mode="popLayout">
            {pageGames.map((game, i) => (
              <GameCard
                key={game.id}
                game={game}
                index={i}
                cover={coverOf(game.id, game.image)}
                rating={ratingOf(game.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="gc-pagination">
          <button
            className="gc-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="gc-page-icon" />
          </button>

          <div className="gc-page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`gc-page-num${p === safePage ? ' is-active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            className="gc-page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="gc-page-icon" />
          </button>

          <span className="gc-page-label">
            Page {safePage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ── Main GamesGrid ─────────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════════ */
export function GamesGrid({
  sectionClassName,
  hideHeroHeader = false,
}: {
  sectionClassName?: string;
  hideHeroHeader?: boolean;
} = {}) {
  const { coverOf, ratingOf, loading: enrichLoading } = useRawgEnrichment();

  const sorted = useMemo(
    () => [...localGames].sort((a, b) => b.popularity - a.popularity),
    [],
  );

  return (
    <section className={`gc-section${hideHeroHeader ? ' gc-section-flush' : ''} ${sectionClassName ?? ''}`}>
      <div className="gc-container">

        {/* ── SECTION 1: Featured Hero Carousel ──────────────── */}
        <div className={`gc-block${hideHeroHeader ? ' gc-block-no-top' : ''}`}>
          {!hideHeroHeader && (
            <div className="gc-block-head">
              <div className="gc-block-icon gc-icon-flame">
                <Flame />
              </div>
              <div>
                <p className="gc-block-eyebrow">Handpicked</p>
                <h2 className="gc-block-title">Featured Games</h2>
              </div>
            </div>
          )}

          {enrichLoading ? (
            <div className="gc-hero-skeleton" />
          ) : (
            <HeroCarousel
              games={sorted}
              enrichLoading={enrichLoading}
              coverOf={coverOf}
              ratingOf={ratingOf}
            />
          )}
        </div>

        {/* ── Trust bar ──────────────────────────────────────── */}
        <TrustBar />

        {/* ── SECTION 2: Popular Carousel ────────────────────── */}
        <div className="gc-block">
          <div className="gc-block-head">
            <div className="gc-block-icon gc-icon-pop">
              <Star />
            </div>
            <div>
              <p className="gc-block-eyebrow">Trending Now</p>
              <h2 className="gc-block-title">Popular Games</h2>
            </div>
            <span className="gc-block-badge">TOP 8</span>
          </div>

          {enrichLoading ? (
            <div className="gc-pop-skeleton-row">
              {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <PopularCarousel games={sorted} coverOf={coverOf} ratingOf={ratingOf} />
          )}
        </div>

        {/* ── SECTION 3: Browse All ───────────────────────────── */}
        <div className="gc-block">
          <div className="gc-block-head">
            <div className="gc-block-icon gc-icon-grid">
              <Grid3x3 />
            </div>
            <div>
              <p className="gc-block-eyebrow">Complete library</p>
              <h2 className="gc-block-title">Browse All Games</h2>
            </div>
          </div>

          {enrichLoading ? (
            <div className="gc-browse-grid">
              {[...Array(9)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <BrowseAll games={sorted} coverOf={coverOf} ratingOf={ratingOf} />
          )}
        </div>

      </div>
    </section>
  );
}
