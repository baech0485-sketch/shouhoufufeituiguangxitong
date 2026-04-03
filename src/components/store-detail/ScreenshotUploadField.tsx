import React from 'react';
import { Trash2 } from 'lucide-react';

import AppIcon from '../ui/AppIcon';
import IconBadge from '../ui/IconBadge';
import SurfaceCard from '../ui/SurfaceCard';

interface ScreenshotUploadFieldProps {
  label: string;
  screenshotName: string;
  screenshotPreviewUrl: string;
  screenshotError: string;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
}

export default function ScreenshotUploadField({
  label,
  screenshotName,
  screenshotPreviewUrl,
  screenshotError,
  onFileChange,
  onRemove,
}: ScreenshotUploadFieldProps) {
  return (
    <SurfaceCard className="bg-[var(--color-bg-canvas)] p-5">
      <p className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</p>
      <label className="mt-3 flex cursor-pointer items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[#f8fafd] px-4 py-4 transition-colors hover:border-[var(--color-brand-primary)]">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        />
        <IconBadge
          tone="surface"
          icon={<AppIcon name="upload" size={18} />}
          className="h-10 w-10"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">拖拽截图或点击上传</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            支持 JPG / PNG / WEBP，单张不超过 2MB。
          </p>
        </div>
      </label>

      {screenshotError && <p className="mt-3 text-xs text-red-600">{screenshotError}</p>}

      {screenshotPreviewUrl && (
        <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-white">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-3 py-2">
            <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
              {screenshotName || '已上传截图'}
            </p>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 transition-colors hover:text-red-700"
            >
              <Trash2 size={14} />
              移除
            </button>
          </div>
          <img
            src={screenshotPreviewUrl}
            alt={`${label}预览`}
            className="max-h-56 w-full object-contain bg-[var(--color-bg-canvas)]"
          />
        </div>
      )}
    </SurfaceCard>
  );
}
