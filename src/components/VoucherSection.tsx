import { AnimatePresence, motion } from 'motion/react';
import { Check, Gift, Mail, Shield, Star, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useLanguageCurrency } from '../context/LanguageContext';
import { translate } from '../utils/translations';

const benefits = [
  { icon: Zap, text: 'Instant 20% discount on first top-up' },
  { icon: Star, text: 'Early access to flash deals & events' },
  { icon: Gift, text: 'Weekly exclusive voucher drops' },
  { icon: Shield, text: 'No spam — unsubscribe anytime' },
];

export function VoucherSection({ sectionClassName }: { sectionClassName?: string } = {}) {
  const [email, setEmail] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { language } = useLanguageCurrency();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedEmail(email);
    setShowSuccessModal(true);
    setEmail('');
  };

  useEffect(() => {
    if (!showSuccessModal) return;
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#8b5cf6', '#6366f1', '#f59e0b', '#10b981'] });
      confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#8b5cf6', '#6366f1', '#f59e0b', '#10b981'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [showSuccessModal]);

  return (
    <section className={`vs-root${sectionClassName ? ` ${sectionClassName}` : ''}`}>
      {/* Background grid pattern */}
      <div className="vs-grid-pattern" aria-hidden />

      <div className="vs-shell">
        <motion.div
          className="vs-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Left — copy */}
          <div className="vs-left">
            <span className="vs-eyebrow">
              <Gift className="vs-eyebrow-icon" />
              {translate('exclusiveOffer', language)}
            </span>

            <h2 className="vs-headline">{translate('get20Off', language)}</h2>
            <p className="vs-sub">{translate('subscribeNewsletter', language)}</p>

            <ul className="vs-benefits">
              {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className="vs-benefit">
                  <div className="vs-benefit-icon-wrap">
                    <Icon className="vs-benefit-icon" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="vs-right">
            <div className="vs-form-card">
              <div className="vs-form-head">
                <div className="vs-form-icon-wrap">
                  <Mail className="vs-form-icon" />
                </div>
                <div>
                  <p className="vs-form-title">Get your voucher</p>
                  <p className="vs-form-sub">Join 50,000+ gamers saving on top-ups</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="vs-form">
                <div className="vs-input-wrap">
                  <Mail className="vs-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="vs-input"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="vs-submit"
                >
                  <Gift className="vs-submit-icon" />
                  {translate('getMyVoucher', language)}
                </motion.button>

                <p className="vs-disclaimer">{translate('bySubscribing', language)}</p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => setShowSuccessModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="vs-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="vs-modal-close"
                >
                  <X className="w-4 h-4" />
                </button>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="vs-modal-icon"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="vs-modal-title">{translate('successfullySubscribed', language)}</h3>
                <p className="vs-modal-sub">{translate('voucherSentEmail', language)}</p>

                <div className="vs-modal-email-box">
                  <p className="vs-modal-check">🎉 {translate('checkEmail', language)}</p>
                  <p className="vs-modal-addr">
                    {translate('voucherSent', language)}{' '}
                    <strong>{submittedEmail}</strong>
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSuccessModal(false)}
                  className="vs-modal-btn"
                >
                  {translate('done', language)}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
