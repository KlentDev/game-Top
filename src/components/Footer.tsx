import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguageCurrency } from '../context/LanguageContext';
import { translate } from '../utils/translations';

export function Footer() {
  const navigate = useNavigate();
  const { language } = useLanguageCurrency();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg">
                <img src="/bg/up-arrow.png" alt="GameTopUp Logo" className="w-5 h-5" />
              </div>
              <span className="text-lg">GameTopUp</span>
            </div>
            <p className="text-gray-400 text-sm">
              {translate('instantDelivery', language)}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm mb-4 font-heading">{translate('browseGames', language)}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-white transition-colors text-left"
                >
                  {translate('home', language)}
                </button>
              </li>
              <li>
                <a href="/#games" className="hover:text-white transition-colors">
                  {translate('allGames', language)}
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate('/help')}
                  className="hover:text-white transition-colors text-left"
                >
                  {translate('help', language)}
                </button>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm mb-4 font-heading">{translate('signIn', language)}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => navigate('/signin')}
                  className="hover:text-white transition-colors text-left"
                >
                  {translate('signIn', language)}
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 GameTopUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
