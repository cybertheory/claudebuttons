/**
 * Cross-site preference cookie for the agentbuttons family (same origin).
 * Name and JSON shape must match hermesbuttons, clawbuttons, and agentbuttons.
 */
export const AGENT_PREFERENCES_COOKIE_NAME = 'agentpreferences';

export const MAX_AGENT_PREFERENCE_ENTRIES = 24;

export interface AgentPreferencesPayload {
  /** Most recently used agent ids first. */
  order: string[];
}

function isBrowser(): boolean {
  return typeof document !== 'undefined';
}

export function readAgentPreferences(): AgentPreferencesPayload | null {
  if (!isBrowser()) return null;
  const match = document.cookie
    .split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${AGENT_PREFERENCES_COOKIE_NAME}=`));
  if (!match) return null;
  const value = match.slice(AGENT_PREFERENCES_COOKIE_NAME.length + 1);
  if (!value) return null;
  try {
    const decoded = decodeURIComponent(value);
    const data = JSON.parse(decoded) as unknown;
    if (!data || typeof data !== 'object' || !Array.isArray((data as AgentPreferencesPayload).order)) {
      return null;
    }
    const order = (data as AgentPreferencesPayload).order.filter(
      (x): x is string => typeof x === 'string' && x.length > 0,
    );
    return { order };
  } catch {
    return null;
  }
}

export function writeAgentPreferences(payload: AgentPreferencesPayload): void {
  if (!isBrowser()) return;
  const order = payload.order.slice(0, MAX_AGENT_PREFERENCE_ENTRIES);
  const json = JSON.stringify({ order });
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${AGENT_PREFERENCES_COOKIE_NAME}=${encodeURIComponent(json)}; Path=/; SameSite=Lax; Expires=${expires.toUTCString()}`;
}

/** Move agentId to the front of the MRU list (call after a successful copy / engagement). */
export function recordAgentPreference(agentId: string): void {
  if (!agentId || typeof agentId !== 'string') return;
  const prev = readAgentPreferences();
  const base = prev?.order.filter((id) => id !== agentId) ?? [];
  writeAgentPreferences({ order: [agentId, ...base] });
}
