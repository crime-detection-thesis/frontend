const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: { access: string; refresh: string }) {
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// Decodifica el payload de un JWT
function decodePayload<T = any>(token: string): T | null {
  try {
    const [, payloadB64] = token.split('.');
    // reemplaza URL-safe base64
    const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Extrae el nombre de usuario del access token
export function getUsername(): string | null {
  const token = getAccessToken();
  console.log(token);
  if (!token) return null;
  const payload = decodePayload<{ username?: string }>(token);
  console.log(payload);
  return payload?.username ?? null;
}
