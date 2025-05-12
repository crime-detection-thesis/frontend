// src/api/scheduleRefresh.ts
import { refreshToken } from './auth';

export function scheduleTokenRefresh() {
  const token = localStorage.getItem('access_token');
  if (!token) return;
  // Extrae el exp (segundos desde epoch) del payload
  const [, payload] = token.split('.');
  const { exp } = JSON.parse(atob(payload));
  const now = Math.floor(Date.now() / 1000);
  const msUntilExpiry = (exp - now - 60) * 1000; // refresca 1min antes
  if (msUntilExpiry <= 0) return;
  setTimeout(async () => {
    try {
      await refreshToken();
      scheduleTokenRefresh(); // re-programa
    } catch {
      // si falla, forzar logout
      window.location.href = '/login';
    }
  }, msUntilExpiry);
}
