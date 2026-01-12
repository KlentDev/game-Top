import { Banner } from './Banner';
import { GamesGrid } from './GamesGrid';
import { VoucherSection } from './VoucherSection';
import { Footer } from './Footer';
import { Notifications } from './Notifications';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Banner />
      <Notifications />
      <GamesGrid />
      <VoucherSection />
      <Footer />
    </div>
  );
}
