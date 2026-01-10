import { environment } from "../environments/environment";


const normalizedBaseUrl = environment.apiBaseUrl.replace(/\/+$/, '');

export const buildApiUrl = (path: string): string => {
  if (!path) {
    return normalizedBaseUrl;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBaseUrl}${normalizedPath}`;
};