import { useState } from 'react';
import { readImageFileAsDataUrl, validateImageFile } from '../../utils/imageUpload.js';

export function useImageUploadField() {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotName, setScreenshotName] = useState('');
  const [screenshotError, setScreenshotError] = useState('');

  const clearScreenshot = () => {
    setScreenshotUrl('');
    setScreenshotName('');
    setScreenshotError('');
  };

  const handleScreenshotChange = async (file: File | null) => {
    if (!file) {
      clearScreenshot();
      return;
    }

    const errorMessage = validateImageFile(file);
    if (errorMessage) {
      setScreenshotError(errorMessage);
      return;
    }

    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setScreenshotUrl(dataUrl);
      setScreenshotName(file.name);
      setScreenshotError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : '读取截图失败';
      setScreenshotError(message);
    }
  };

  return {
    screenshotUrl,
    screenshotName,
    screenshotError,
    clearScreenshot,
    handleScreenshotChange,
  };
}
