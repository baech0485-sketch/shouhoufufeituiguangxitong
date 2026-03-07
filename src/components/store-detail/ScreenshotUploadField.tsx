import React from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

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
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-slate-500 transition-colors hover:border-emerald-400 hover:bg-emerald-50/40">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        />
        <ImagePlus size={24} className="mb-2 text-emerald-500" />
        <span className="text-sm font-medium text-slate-700">点击上传截图</span>
        <span className="mt-1 text-xs text-slate-500">支持 JPG、PNG、WEBP，最大 2MB</span>
      </label>

      {screenshotError && <p className="mt-2 text-xs text-red-600">{screenshotError}</p>}

      {screenshotPreviewUrl && (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700">
                {screenshotName || '已上传截图'}
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
            >
              <Trash2 size={14} />
              移除
            </button>
          </div>
          <img
            src={screenshotPreviewUrl}
            alt={`${label}预览`}
            className="max-h-56 w-full object-contain bg-slate-50"
          />
        </div>
      )}
    </div>
  );
}
