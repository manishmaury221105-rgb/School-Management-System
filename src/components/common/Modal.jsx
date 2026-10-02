import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '600px' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent touchmove scroll on iOS body
      const handleTouchMove = (e) => {
        if (!e.target.closest('.modal-body')) {
          e.preventDefault();
        }
      };
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('touchmove', handleTouchMove);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalElement = (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="icon-btn"
            style={{ width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
};
