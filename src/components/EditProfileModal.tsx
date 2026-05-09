import { AnimatePresence, motion } from 'motion/react';
import { User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  userName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function EditProfileModal({ open, userName, onClose, onSave }: Props) {
  const [name, setName] = useState(userName);

  useEffect(() => {
    if (open) setName(userName);
  }, [open, userName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onSave(trimmed);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
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
            style={{ maxWidth: '28rem' }}
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <button className="ud-modal-close" onClick={onClose} aria-label="Close">
              <X />
            </button>

            <div className="modal-content">
              <div className="modal-head">
                <div className="modal-icon">
                  <User />
                </div>
                <div>
                  <p className="ud-eyebrow">Account</p>
                  <h2>Edit profile</h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="modal-field">
                  <label htmlFor="profile-name">Display name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your display name"
                    maxLength={32}
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="profile-email">Email address</label>
                  <input
                    id="profile-email"
                    type="email"
                    defaultValue="player@gametopup.com"
                    disabled
                  />
                  <small>Email cannot be changed here. Contact support for help.</small>
                </div>
                <div className="modal-actions">
                  <button type="button" className="ud-btn-ghost" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="ud-btn-primary">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
