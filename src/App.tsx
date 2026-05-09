import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageCurrencyProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { RecentlyVisitedProvider } from './context/RecentlyVisitedContext';
import { ToastProvider } from './context/ToastContext';
import { HeaderRedesign } from './components/HeaderRedesign';
import { HomePage } from './components/HomePage';
import { GameTopUpPage } from './components/GameTopUpPage';
import { HelpPage } from './components/HelpPage';
import { SignInPage } from './components/SignInPage';
import { SignUpPage } from './components/SignUpPage';
import { UserDashboard } from './components/UserDashboard';
import { PageLoader } from './components/PageLoader';
import { ToastShelf } from './components/Toast';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <LanguageCurrencyProvider>
          <AuthProvider>
            <RecentlyVisitedProvider>
              <Router>
                <PageLoader />
                <ToastShelf />
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                  <HeaderRedesign />
                  {/*
                    isolation: isolate creates a new stacking context for all page
                    content. This prevents Framer Motion's transform-animated elements
                    (which create their own stacking contexts) from painting over the
                    sticky header, since the header sits outside this isolated layer.
                  */}
                  <div style={{ isolation: 'isolate' }}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/game/:gameId" element={<GameTopUpPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/signin" element={<SignInPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route path="/user" element={<UserDashboard />} />
                    </Routes>
                  </div>
                </div>
              </Router>
            </RecentlyVisitedProvider>
          </AuthProvider>
        </LanguageCurrencyProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;