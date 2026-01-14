const accessTokenKey = 'accessToken';
const accessTokenExpiresAtKey = 'accessTokenExpiresAt';

export const setSession = (accessToken: string, expiresInSeconds?: number): void => {
  localStorage.setItem(accessTokenKey, accessToken);

  if (typeof expiresInSeconds === 'number' && !Number.isNaN(expiresInSeconds)) {
    const expiresAtMs = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(accessTokenExpiresAtKey, expiresAtMs.toString());
    return;
  }

  localStorage.removeItem(accessTokenExpiresAtKey);
};

export const isAccessTokenValid = (): boolean => {
  const token = localStorage.getItem(accessTokenKey);
  if (!token) {
    return false;
  }

  const expiresAt = localStorage.getItem(accessTokenExpiresAtKey);
  if (!expiresAt) {
    return true;
  }

  const expiresAtMs = Number(expiresAt);
  if (Number.isNaN(expiresAtMs)) {
    return true;
  }

  return Date.now() < expiresAtMs;
};

export const getAccessToken = (): string | null => {
  if (!isAccessTokenValid()) {
    return null;
  }

  return localStorage.getItem(accessTokenKey);
};

export const clearSession = (): void => {
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(accessTokenExpiresAtKey);
};
