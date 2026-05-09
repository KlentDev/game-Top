import { GamesGrid } from './GamesGrid';
import { VoucherSection } from './VoucherSection';
import { Footer } from './Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <GamesGrid hideHeroHeader />
      <VoucherSection />
      <Footer />
    </div>
  );
}
