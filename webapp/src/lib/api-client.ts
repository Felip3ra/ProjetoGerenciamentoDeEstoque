import { toast } from 'sonner';
import { getAuthUser, clearAuth } from '@/services/storage';
import { startRequest, endRequest } from '@/lib/request-state';

const DEFAULT_API_BASE_URL = 'https://localhost:7066';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || DEFAULT_API_BASE_URL;

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  toastOnError?: boolean;
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json') || contentType.includes('application/problem+json') || contentType.includes('text/json')) {
    return (await response.json()) as T;
  }

  const text = await response.text();
  return text as T;
}

function normalizeErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('failed to fetch') || lower.includes('networkerror')) {
    return 'Falha ao conectar ao servidor';
  }
  return message;
}

function extractErrorMessage(errorBody: unknown, fallback: string): string {
  if (typeof errorBody === 'string') {
    const trimmed = errorBody.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return extractErrorMessage(parsed, fallback);
      } catch {
        return errorBody;
      }
    }
    return errorBody;
  }

  if (errorBody && typeof errorBody === 'object') {
    const body = errorBody as { message?: unknown; title?: unknown; errors?: Record<string, unknown> };
    if (typeof body.message === 'string' && body.message) {
      return body.message;
    }
    if (body.errors && typeof body.errors === 'object') {
      for (const value of Object.values(body.errors)) {
        if (Array.isArray(value) && typeof value[0] === 'string' && value[0]) {
          return value[0];
        }
        if (typeof value === 'string' && value) {
          return value;
        }
      }
    }
    if (typeof body.title === 'string' && body.title) {
      return body.title;
    }
  }

  return fallback;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const auth = getAuthUser();
  const headers = new Headers(options.headers || {});
  let didToastError = false;

  if (auth?.token) {
    headers.set('Authorization', `Bearer ${auth.token}`);
  }

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  startRequest();
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
      const errorBody = await parseResponse<unknown>(response);
      const fallbackMessage = response.status === 401
        ? 'Sessao expirada. Faca login novamente.'
        : response.statusText || 'Erro inesperado ao acessar o servidor';
      const message = extractErrorMessage(errorBody, fallbackMessage);
      const errorMessage = normalizeErrorMessage(message);
      if (options.toastOnError !== false) {
        toast.error(errorMessage);
        didToastError = true;
      }
      throw new Error(errorMessage);
    }

    return await parseResponse<T>(response);
  } catch (error) {
    if (options.toastOnError !== false && !didToastError) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Erro inesperado ao acessar o servidor';
      const normalized = normalizeErrorMessage(message);
      toast.error(normalized);
      if (normalized !== message) {
        throw new Error(normalized);
      }
    }
    throw error;
  } finally {
    endRequest();
  }
}
