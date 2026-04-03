import React from 'react';

import AppIcon from '../ui/AppIcon';

interface StoreHistoryPreviewDialogProps {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

export default function StoreHistoryPreviewDialog({
  isOpen,
  src,
  alt,
  onClose,
}: StoreHistoryPreviewDialogProps) {
  if (!isOpen || !src) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgb(15_23_42_/_0.72)] p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-full max-w-[min(92vw,1200px)] rounded-[var(--radius-xl)] bg-white p-3 shadow-[var(--shadow-modal)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--color-text-secondary)] shadow-[var(--shadow-card)] transition-colors hover:text-[var(--color-brand-primary)]"
        >
          <AppIcon name="close" size={18} />
        </button>
        <img
          src={src}
          alt={alt}
          className="max-h-[82vh] max-w-full rounded-[var(--radius-lg)] object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
