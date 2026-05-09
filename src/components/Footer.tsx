import { Facebook, Instagram, Mail, Send, Twitter, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguageCurrency } from '../context/LanguageContext';
import { translate } from '../utils/translations';

const paymentMethods = [
  { label: 'Visa', bg: '#1a1f71', text: '#fff', abbr: 'VISA' },
  { label: 'Mastercard', bg: '#eb001b', text: '#fff', abbr: 'MC' },
  { label: 'GCash', bg: '#007dff', text: '#fff', abbr: 'GCash' },
  { label: 'PayMaya', bg: '#00a859', text: '#fff', abbr: 'PayMaya' },
  { label: 'PayPal', bg: '#003087', text: '#fff', abbr: 'PayPal' },
  { label: 'Alipay', bg: '#1677ff', text: '#fff', abbr: 'Alipay' },
];

export function Footer() {
  const navigate = useNavigate();
  const { language } = useLanguageCurrency();

  return (
    <footer className="ft-root">
      <div className="ft-shell">

        {/* ── Top grid ─────────────────────────────────────── */}
        <div className="ft-grid">

          {/* Brand col */}
          <div className="ft-brand-col">
            <button className="ft-brand" onClick={() => navigate('/')}>
              <img src="/bg/up-arrow.png" alt="GameTopUp" className="ft-brand-logo" />
              <span className="ft-brand-name">GameTopUp</span>
            </button>
            <p className="ft-brand-tagline">
              The fastest, safest way to top up your favourite games — instant delivery, every time.
            </p>
            <div className="ft-socials">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
                { Icon: Send, href: '#', label: 'Telegram' },
                { Icon: Mail, href: '#', label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} className="ft-social" aria-label={label}>
                  <Icon className="ft-social-icon" />
                </a>
              ))}
            </div>
          </div>

          {/* Games col */}
          <div className="ft-col">
            <h4 className="ft-col-head">Games</h4>
            <ul className="ft-links">
              {['Mobile Legends', 'PUBG Mobile', 'Free Fire', 'Genshin Impact', 'Call of Duty'].map((g) => (
                <li key={g}>
                  <button
                    className="ft-link"
                    onClick={() => navigate(`/game/${g.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    {g}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company col */}
          <div className="ft-col">
            <h4 className="ft-col-head">Company</h4>
            <ul className="ft-links">
              <li><button className="ft-link" onClick={() => navigate('/')}>Home</button></li>
              <li><button className="ft-link" onClick={() => navigate('/help')}>Help Center</button></li>
              <li><a className="ft-link" href="#">About Us</a></li>
              <li><a className="ft-link" href="#">Blog</a></li>
              <li><a className="ft-link" href="#">Careers</a></li>
            </ul>
          </div>

          {/* Account col */}
          <div className="ft-col">
            <h4 className="ft-col-head">Account</h4>
            <ul className="ft-links">
              <li><button className="ft-link" onClick={() => navigate('/signin')}>{translate('signIn', language)}</button></li>
              <li><button className="ft-link" onClick={() => navigate('/signup')}>Sign Up</button></li>
              <li><button className="ft-link" onClick={() => navigate('/user')}>My Dashboard</button></li>
              <li><a className="ft-link" href="#">Transaction History</a></li>
            </ul>
          </div>

          {/* Legal col */}
          <div className="ft-col">
            <h4 className="ft-col-head">Legal</h4>
            <ul className="ft-links">
              <li><a className="ft-link" href="#">Terms of Service</a></li>
              <li><a className="ft-link" href="#">Privacy Policy</a></li>
              <li><a className="ft-link" href="#">Cookie Policy</a></li>
              <li><a className="ft-link" href="#">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* ── Payment methods ───────────────────────────────── */}
        <div className="ft-payment-row">
          <p className="ft-payment-label">Accepted Payments</p>
          <div className="ft-payment-methods">
            {paymentMethods.map((m) => (
              <div key={m.label} className="ft-payment-badge" style={{ background: m.bg }}>
                <span style={{ color: m.text, fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.03em', lineHeight: 1 }}>
                  {m.abbr}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="ft-bottom">
          <p className="ft-copy">© {new Date().getFullYear()} GameTopUp. All rights reserved.</p>
          <p className="ft-copy">
            Game art & trademarks belong to their respective owners.{' '}
            <a className="ft-copy-link" href="#">RAWG.io</a> data used under their{' '}
            <a className="ft-copy-link" href="https://rawg.io/apidocs" target="_blank" rel="noreferrer">Terms of Use</a>.
          </p>
        </div>

      </div>
    </footer>
  );
}
