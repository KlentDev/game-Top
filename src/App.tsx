import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageCurrencyProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { RecentlyVisitedProvider } from './context/RecentlyVisitedContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { GameTopUpPage } from './components/GameTopUpPage';
import { HelpPage } from './components/HelpPage';
import { SignInPage } from './components/SignInPage';
import { SignUpPage } from './components/SignUpPage';
import { UserPage } from './components/UserPage';
import { PageLoader } from './components/PageLoader';

function App() {
  return (
    <ThemeProvider>
      <LanguageCurrencyProvider>
        <AuthProvider>
          <RecentlyVisitedProvider>
            <Router>
            <PageLoader />
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game/:gameId" element={<GameTopUpPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/user" element={<UserPage />} />
              </Routes>

            </div>
            </Router>
          </RecentlyVisitedProvider>
        </AuthProvider>
      </LanguageCurrencyProvider>
    </ThemeProvider>
  );
}

export default App;