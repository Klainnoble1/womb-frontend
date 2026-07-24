export type SessionUser = {
  id: number | string;
  name: string;
  email: string;
  role: string;
};

export type Session = {
  token: string;
  user: SessionUser;
};

export const SESSION_KEY = 'womb_session';

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(SESSION_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved) as Session;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(token: string, user: SessionUser) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user }));
  window.localStorage.setItem('womb_vendor_token', token);
  window.localStorage.setItem('womb_vendor_user', JSON.stringify(user));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem('womb_vendor_token');
  window.localStorage.removeItem('womb_vendor_user');
}
