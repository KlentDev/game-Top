import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Smartphone, Wallet, Check } from 'lucide-react';
import { PaymentDetails } from '../types';
import { useState, useEffect } from 'react';
import { useLanguageCurrency } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { convertPrice } from '../utils/currency';
import { translate } from '../utils/translations';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentDetails: PaymentDetails | null;
}

type PaymentMethod = 'card' | 'ewallet' | 'mobile';
type PaymentStep = 'gameInfo' | 'method' | 'email' | 'details' | 'success' | 'fail';

const eWallets = [
  { id: 'gcash', name: 'GCash', icon: '💚' },
  { id: 'paymaya', name: 'PayMaya', icon: '💳' },
  { id: 'coinsph', name: 'Coins.ph', icon: '🪙' },
  { id: 'paytm', name: 'Paytm', icon: '🔵' },
  { id: 'alipay', name: 'Alipay', icon: '🔴' },
];

export function PaymentModal({ isOpen, onClose, paymentDetails }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [step, setStep] = useState<PaymentStep>('gameInfo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [server, setServer] = useState('');
  const [username, setUsername] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedEWallet, setSelectedEWallet] = useState('gcash');
  const [paymentSuccess, setPaymentSuccess] = useState(true);
  const { currency, language } = useLanguageCurrency();
  const { addCredits } = useAuth();

  useEffect(() => {
    if (step === 'success') {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [step]);

  if (!paymentDetails) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Randomly determine success or fail (90% success rate for demo)
      const isSuccess = Math.random() < 0.9;
      setPaymentSuccess(isSuccess);
      
      // Add credits to user account on successful payment
      if (isSuccess && paymentDetails) {
        const creditsEarned = Math.floor(paymentDetails.package.price);
        addCredits(creditsEarned);
      }
      
      setStep(isSuccess ? 'success' : 'fail');
    }, 2000);
  };

  const handleClose = () => {
    setStep('gameInfo');
    setSelectedMethod('card');
    setEmail('');
    setPlayerId('');
    setServer('');
    setUsername('');
    setVoucherCode('');
    setDiscount(0);
    setPhoneNumber('');
    setSelectedEWallet('gcash');
    setPaymentSuccess(true);
    onClose();
  };

  const applyVoucher = () => {
    if (voucherCode.trim() !== '') {
      setDiscount(0.2);
    } else {
      setDiscount(0);
    }
  };

  const finalPrice = paymentDetails ? paymentDetails.package.price * (1 - discount) : 0;

  const paymentMethods = [
    { id: 'card' as PaymentMethod, name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'ewallet' as PaymentMethod, name: 'E-Wallet', icon: Wallet },
    { id: 'mobile' as PaymentMethod, name: 'Mobile Payment', icon: Smartphone },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl text-gray-900 dark:text-white font-heading">
                  {step === 'success' ? translate('paymentSuccessful', language) : translate('completePayment', language)}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                {step === 'gameInfo' && (
                  <>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-6 border border-purple-100 dark:border-purple-800">
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={paymentDetails.game.image}
                          alt={paymentDetails.game.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Game</p>
                          <p className="text-gray-900 dark:text-white">{paymentDetails.game.name}</p>
                        </div>
                      </div>
                      <div className="border-t border-purple-200 dark:border-purple-700 pt-3 mt-3">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Package</span>
                          <span className="text-gray-900 dark:text-white">{paymentDetails.package.amount}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between mb-2 text-red-600 dark:text-red-400">
                            <span>{translate('discount', language)} ({(discount * 100).toFixed(0)}%)</span>
                            <span>-{convertPrice(paymentDetails.package.price * discount, currency)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-purple-200 dark:border-purple-700">
                          <span className="text-gray-900 dark:text-white">{translate('total', language)}</span>
                          <span className="text-xl text-gray-900 dark:text-white">
                            {convertPrice(finalPrice, currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {paymentDetails.game.idFieldLabel || 'Player ID / UID'}
                        </label>
                        <input
                          type="text"
                          value={playerId}
                          onChange={(e) => setPlayerId(e.target.value)}
                          placeholder="Enter your player ID"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                        />
                      </div>
                      
                      {paymentDetails.game.requiresServer !== false && (
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Server / Region
                          </label>
                          <input
                            type="text"
                            value={server}
                            onChange={(e) => setServer(e.target.value)}
                            placeholder="e.g., NA, EU, Asia"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                          />
                        </div>
                      )}

                      {paymentDetails.game.requiresUsername && (
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Username / IGN
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your in-game name"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {translate('voucherCode', language)} ({translate('optional', language)})
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                          placeholder={translate('enterVoucher', language)}
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                        />
                        <button
                          type="button"
                          onClick={applyVoucher}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          {translate('apply', language)}
                        </button>

                      </div>
                      {discount > 0 && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                          ✓ {translate('voucherApplied', language)} {convertPrice(paymentDetails.package.price * discount, currency)}
                        </p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('method')}
                      disabled={!playerId || (paymentDetails.game.requiresServer !== false && !server)}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </motion.button>
                  </>
                )}

                {step === 'method' && (
                  <>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-6 border border-purple-100 dark:border-purple-800">
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={paymentDetails.game.image}
                          alt={paymentDetails.game.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Game</p>
                          <p className="text-gray-900 dark:text-white">{paymentDetails.game.name}</p>
                        </div>
                      </div>
                      <div className="border-t border-purple-200 dark:border-purple-700 pt-3 mt-3">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Package</span>
                          <span className="text-gray-900 dark:text-white">{paymentDetails.package.amount}</span>
                        </div>
                        {paymentDetails.package.bonus && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Bonus</span>
                            <span className="text-green-600 dark:text-green-400">{paymentDetails.package.bonus}</span>
                          </div>
                        )}
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400">{paymentDetails.game.idFieldLabel || 'Player ID'}</span>
                          <span className="text-gray-900 dark:text-white font-mono text-sm">{playerId}</span>
                        </div>
                        {server && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Server</span>
                            <span className="text-gray-900 dark:text-white text-sm">{server}</span>
                          </div>
                        )}
                        {username && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Username</span>
                            <span className="text-gray-900 dark:text-white text-sm">{username}</span>
                          </div>
                        )}
                        {discount > 0 && (
                          <div className="flex justify-between mb-2 text-red-600 dark:text-red-400">
                            <span>{translate('discount', language)} ({(discount * 100).toFixed(0)}%)</span>
                            <span>-{convertPrice(paymentDetails.package.price * discount, currency)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-purple-200 dark:border-purple-700">
                          <span className="text-gray-900 dark:text-white">Total</span>
                          <span className="text-xl text-gray-900 dark:text-white">
                            {convertPrice(finalPrice, currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Select Payment Method</p>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <motion.button
                            key={method.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                              selectedMethod === method.id
                                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-700/50'
                            }`}
                          >
                            <method.icon className={`w-5 h-5 ${
                              selectedMethod === method.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                            }`} />
                            <span className={
                              selectedMethod === method.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                            }>
                              {method.name}
                            </span>
                            {selectedMethod === method.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('gameInfo')}
                        className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('email')}
                        className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                      >
                        Continue
                      </motion.button>
                    </div>
                  </>
                )}

                {step === 'email' && (
                  <>
                    <div className="mb-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Enter your email address to receive the invoice and transaction details.
                      </p>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    {selectedMethod === 'ewallet' && (
                      <div className="mb-6">
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Select E-Wallet
                        </label>
                        <div className="space-y-2">
                          {eWallets.map((wallet) => (
                            <motion.button
                              key={wallet.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => setSelectedEWallet(wallet.id)}
                              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                                selectedEWallet === wallet.id
                                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500'
                              }`}
                            >
                              <span className="text-2xl">{wallet.icon}</span>
                              <span className={`font-medium ${
                                selectedEWallet === wallet.id
                                  ? 'text-purple-600 dark:text-purple-400'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>{wallet.name}</span>
                              {selectedEWallet === wallet.id && (
                                <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 ml-auto" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'mobile' && (
                      <div className="mb-6">
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+63 9XX XXX XXXX"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                        />
                      </div>
                    )}

                    {selectedMethod === 'card' && (
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('method')}
                        className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectedMethod === 'card' ? handlePayment() : setStep('details')}
                        disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (selectedMethod === 'mobile' && !phoneNumber)}
                        className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {selectedMethod === 'card' ? `Pay ${convertPrice(finalPrice, currency)}` : 'Continue'}
                      </motion.button>
                    </div>
                  </>
                )}

                {step === 'details' && (
                  <>
                    {selectedMethod === 'card' && (
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'ewallet' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-900 dark:text-blue-300 mb-3">
                          🔐 You will be redirected to {eWallets.find(w => w.id === selectedEWallet)?.name || 'E-Wallet'} to complete payment securely.
                        </p>
                        <p className="text-xs text-blue-800 dark:text-blue-400">
                          Please do not close this window during the payment process.
                        </p>
                      </div>
                    )}

                    {selectedMethod === 'mobile' && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                        <p className="text-sm text-green-900 dark:text-green-300 mb-2">
                          📱 Mobile Payment Summary
                        </p>
                        <p className="text-xs text-green-800 dark:text-green-400">
                          Amount: {convertPrice(finalPrice, currency)}<br/>
                          Phone: {phoneNumber}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('email')}
                        className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Processing...
                          </span>
                        ) : (
                          `Pay ${convertPrice(finalPrice, currency)}`
                        )}
                      </motion.button>
                    </div>
                  </>
                )}

                {(step === 'success' || step === 'fail') && (
                  <>
                    <div className="text-center py-8">
                      {paymentSuccess ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                          >
                            <Check className="w-10 h-10 text-white" />
                          </motion.div>
                          <h3 className="text-2xl text-gray-900 dark:text-white mb-2 font-heading">{translate('paymentSuccessful', language)}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {translate('paymentSuccess', language)} {paymentDetails.package.amount} ({paymentDetails.game.name}) {translate('hasBeenProcessed', language)}
                          </p>
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                            <p className="text-lg font-medium text-green-900 dark:text-green-300 mb-2">
                              🎉 {translate('checkEmail', language)}
                            </p>
                            <p className="text-sm text-green-800 dark:text-green-400">
                              {translate('voucherSent', language)} <span className="font-medium">{email}</span>
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
                          >
                            <X className="w-10 h-10 text-white" />
                          </motion.div>
                          <h3 className="text-2xl text-gray-900 dark:text-white mb-2 font-heading">Payment Failed</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Unfortunately, your payment could not be processed. Please try again or use a different payment method.
                          </p>
                          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                            <p className="text-lg font-medium text-red-900 dark:text-red-300 mb-2">
                              ⚠️ Transaction Error
                            </p>
                            <p className="text-sm text-red-800 dark:text-red-400">
                              Please check your payment details and try again.
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setStep('email');
                                setPaymentSuccess(true);
                              }}
                              className="flex-1 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                            >
                              Try Again
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleClose}
                              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                              Close
                            </motion.button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClose}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow mt-6"
                          >
                            {translate('done', language)}
                          </motion.button>
                          </>
                      )}
                      {paymentSuccess && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleClose}
                          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                          {translate('done', language)}
                        </motion.button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
