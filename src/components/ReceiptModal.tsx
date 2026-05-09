import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Download, FileText, X, XCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export interface ReceiptData {
  orderId: string;
  game: string;
  package: string;
  amount: number;
  status: 'completed' | 'failed' | 'pending' | 'processing';
  date: string;
  paymentMethod: string;
  image: string;
}

interface Props {
  receipt: ReceiptData | null;
  onClose: () => void;
}

export function ReceiptModal({ receipt, onClose }: Props) {
  const { toast } = useToast();

  const handleDownload = () => {
    toast('info', 'Receipt saved', 'Your receipt has been prepared for download.');
    onClose();
  };

  return (
    <AnimatePresence>
      {receipt && (
        <motion.div
          className="ud-modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <div className="ud-modal-backdrop" onClick={onClose} />
          <motion.div
            className="ud-modal-box"
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <button className="ud-modal-close" onClick={onClose} aria-label="Close">
              <X />
            </button>

            <div className="receipt">
              <div className="receipt-header">
                <div className="receipt-brand">
                  <FileText />
                  <span>Purchase Receipt</span>
                </div>
                <span className="receipt-id">#{receipt.orderId}</span>
              </div>

              <div className="receipt-game">
                <img src={receipt.image} alt={receipt.game} />
                <div>
                  <strong>{receipt.game}</strong>
                  <span>{receipt.package}</span>
                </div>
              </div>

              <div className="receipt-rule" />

              <dl className="receipt-lines">
                <div>
                  <dt>Date &amp; Time</dt>
                  <dd>{receipt.date}</dd>
                </div>
                <div>
                  <dt>Payment Method</dt>
                  <dd>{receipt.paymentMethod}</dd>
                </div>
                <div>
                  <dt>Delivery</dt>
                  <dd>{receipt.status === 'failed' ? 'Not delivered' : 'Instant'}</dd>
                </div>
                <div>
                  <dt>Order Status</dt>
                  <dd className={`receipt-status receipt-status-${receipt.status}`}>
                    {receipt.status === 'completed' ? (
                      <><CheckCircle2 className="receipt-status-icon" /> Completed</>
                    ) : (
                      <><XCircle className="receipt-status-icon" />
                        {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                      </>
                    )}
                  </dd>
                </div>
              </dl>

              <div className="receipt-rule" />

              <div className="receipt-total">
                <span>Total Paid</span>
                <strong>${receipt.amount.toFixed(2)}</strong>
              </div>

              <p className="receipt-note">
                Thank you for using GameTopUp. All top-ups are processed instantly.
                Keep this receipt for your records.
              </p>

              <div className="receipt-actions">
                <button className="ud-btn-ghost" onClick={onClose}>Close</button>
                <button className="ud-btn-primary" onClick={handleDownload}>
                  <Download className="ud-button-icon" />
                  Save PDF
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
