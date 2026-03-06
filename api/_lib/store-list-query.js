export const ALLOWED_STORE_LIST_PLATFORMS = ['美团餐饮', '饿了么餐饮'];

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildStoreListQuery({
  search = '',
  platform = '',
  status = '',
} = {}) {
  const trimmedSearch = String(search).trim();
  const trimmedPlatform = String(platform).trim();
  const trimmedStatus = String(status).trim();
  const query = {};

  if (trimmedSearch) {
    query.name = { $regex: escapeRegex(trimmedSearch), $options: 'i' };
  }

  if (trimmedPlatform) {
    query.platform = ALLOWED_STORE_LIST_PLATFORMS.includes(trimmedPlatform)
      ? trimmedPlatform
      : '__UNSUPPORTED_STORE_LIST_PLATFORM__';
  } else {
    query.platform = { $in: ALLOWED_STORE_LIST_PLATFORMS };
  }

  if (trimmedStatus) {
    query.status = trimmedStatus;
  }

  return query;
}
