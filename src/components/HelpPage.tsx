import { motion } from 'motion/react';
import { ChevronDown, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { Footer } from './Footer';

interface FAQItem {
  question: string;
  answer: string;
}

export function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How do I top up my game?',
      answer:
        'Select your game from the homepage, choose your desired package, enter your email address, and complete the payment. Your credits will be delivered to your game account within 5 minutes.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept credit/debit cards, e-wallets, and mobile payments. All transactions are secure and encrypted for your safety.',
    },
    {
      question: 'How long does it take to receive my top-up?',
      answer:
        'Most top-ups are delivered instantly within 5 minutes. In rare cases, it may take up to 24 hours. If you haven\'t received your top-up after 24 hours, please contact our support team.',
    },
    {
      question: 'Can I get a refund?',
      answer:
        'Due to the digital nature of our products, we generally cannot offer refunds once the top-up has been delivered. However, if there was an error with your purchase, please contact our support team and we\'ll help resolve the issue.',
    },
    {
      question: 'Is it safe to use this platform?',
      answer:
        'Yes! We use industry-standard encryption and secure payment gateways to protect your information. We never store your payment details on our servers.',
    },
    {
      question: 'What if I entered the wrong player ID?',
      answer:
        'Please double-check your player ID before making a payment. If you entered the wrong ID, contact our support team immediately with your transaction details. We\'ll do our best to help, though we cannot guarantee recovery of credits sent to the wrong account.',
    },
    {
      question: 'Do you offer discounts or promotions?',
      answer:
        'Yes! We regularly run promotions and offer bonus credits on selected packages. Check our homepage banner and follow us on social media to stay updated on the latest deals.',
    },
    {
      question: 'How do I contact customer support?',
      answer:
        'You can reach us via email at support@gametopup.com, live chat on our website, or phone at +1 (555) 123-4567. Our support team is available 24/7 to assist you.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <HelpCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl text-white mb-4"
          >
            How Can We Help?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-purple-100"
          >
            Find answers to common questions below
          </motion.p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <span className="text-lg text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8"
        >
          <h2 className="text-2xl text-gray-900 dark:text-white mb-6 text-center">
            Still Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg text-gray-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Chat with our support team
              </p>
              <button className="text-purple-600 dark:text-purple-400 hover:underline">
                Start Chat
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                support@gametopup.com
              </p>
              <a
                href="mailto:support@gametopup.com"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Send Email
              </a>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg text-gray-900 dark:text-white mb-2">Phone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                +1 (555) 123-4567
              </p>
              <a
                href="tel:+15551234567"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Call Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
