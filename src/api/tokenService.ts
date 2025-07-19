const ACCESS_KEY = 'access_token';

export interface JWTPayload {
  user_id?: number;
  username?: string;
  surveillance_center?: number;
  is_admin?: boolean;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return null;
}

export function setTokens(tokens: { access: string; refresh?: string }) {
  localStorage.setItem(ACCESS_KEY, tokens.access);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
}

function decodePayload(token: string): JWTPayload | null {
  try {
    const [, payloadB64] = token.split('.');
    const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getUsername(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = decodePayload(token);
  return payload?.username ?? null;
}
