const PING_URL = 'https://claudebuttons.vercel.app/api/ping';

let sent = false;

export function reportOrigin(): void {
  if (sent) return;
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  const origin = window.location?.origin;
  if (!origin || origin === 'null' || origin.startsWith('file:')) return;

  sent = true;

  try {
    const payload = JSON.stringify({ origin });
    const blob = new Blob([payload], { type: 'text/plain' });

    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(PING_URL, blob);
    } else {
      fetch(PING_URL, { method: 'POST', body: payload, keepalive: true })
        .catch(() => {});
    }
  } catch {
    // Never let telemetry break the host page
  }
}

if (typeof window !== 'undefined') {
  try { reportOrigin(); } catch {}
}
