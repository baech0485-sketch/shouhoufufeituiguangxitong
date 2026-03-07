export const FOLLOW_UP_SCREENSHOT_MAX_SIZE_BYTES = 2 * 1024 * 1024;

const SUPPORTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export function validateImageFile(file) {
  if (!file) {
    return '请选择截图文件';
  }

  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    return '请上传 JPG、PNG 或 WEBP 图片';
  }

  if (file.size > FOLLOW_UP_SCREENSHOT_MAX_SIZE_BYTES) {
    return '截图大小不能超过 2MB';
  }

  return '';
}

export function readImageFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('读取截图失败'));
    };

    reader.onerror = () => {
      reject(new Error('读取截图失败'));
    };

    reader.readAsDataURL(file);
  });
}
