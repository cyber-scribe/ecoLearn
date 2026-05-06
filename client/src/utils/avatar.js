import api from '../services/api';

export const getAvatarFallbackUrl = (name = '') => (
  'https://ui-avatars.com/api/?name=' +
  encodeURIComponent(name) +
  '&background=16a34a&color=fff'
);

export const getAvatarUrl = (avatarPath, version) => {
  if (!avatarPath) return null;

  const avatarUrl = avatarPath.startsWith('http')
    ? avatarPath
    : `${(api.defaults.baseURL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')}${avatarPath}`;

  if (!version) return avatarUrl;

  const separator = avatarUrl.includes('?') ? '&' : '?';
  return `${avatarUrl}${separator}v=${version}`;
};

export const getProfileImageSrc = (user, version) => (
  getAvatarUrl(user?.avatar, version) || getAvatarFallbackUrl(user?.name || '')
);
