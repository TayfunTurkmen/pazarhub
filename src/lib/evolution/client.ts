import 'server-only';

import { evolutionConfig } from './config';

export type WhatsAppState = 'open' | 'connecting' | 'close' | 'unknown';

export interface WhatsAppStatus {
  connected: boolean;
  state: WhatsAppState;
  instance: string;
  qr?: string;
  number?: string;
  provider: 'evolution' | 'offline';
  error?: string;
}

async function evo(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; json: Record<string, unknown> }> {
  const c = evolutionConfig();
  const res = await fetch(`${c.url}${path}`, {
    ...init,
    headers: {
      apikey: c.apiKey,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
  let json: Record<string, unknown> = {};
  try {
    json = await res.json() as Record<string, unknown>;
  } catch {
    json = {};
  }
  return { ok: res.ok, status: res.status, json };
}

function pickQr(json: Record<string, unknown>): string | undefined {
  const qrcode = json.qrcode as Record<string, unknown> | undefined;
  const base64 = String(json.base64 ?? qrcode?.base64 ?? json.qr ?? '');
  if (!base64) return undefined;
  return base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;
}

function pickState(json: Record<string, unknown>): WhatsAppState {
  const instance = json.instance as Record<string, unknown> | undefined;
  const raw = String(instance?.state ?? json.state ?? json.status ?? 'unknown').toLowerCase();
  if (raw === 'open' || raw === 'connected') return 'open';
  if (raw === 'connecting' || raw === 'qr') return 'connecting';
  if (raw === 'close' || raw === 'closed' || raw === 'disconnected') return 'close';
  return 'unknown';
}

export async function pingEvolution(): Promise<boolean> {
  try {
    const c = evolutionConfig();
    const res = await fetch(c.url, { cache: 'no-store', signal: AbortSignal.timeout(800) });
    return res.ok || res.status === 401 || res.status === 403;
  } catch {
    return false;
  }
}

let statusCache: { at: number; value: WhatsAppStatus } | null = null;

export async function getWhatsAppStatus(): Promise<WhatsAppStatus> {
  if (statusCache && Date.now() - statusCache.at < 4000) return statusCache.value;
  const value = await fetchWhatsAppStatus();
  statusCache = { at: Date.now(), value };
  return value;
}

async function fetchWhatsAppStatus(): Promise<WhatsAppStatus> {
  const c = evolutionConfig();
  const online = await pingEvolution();
  if (!online) {
    return { connected: false, state: 'close', instance: c.instance, provider: 'offline', error: 'Evolution API çalışmıyor' };
  }

  try {
    const stateRes = await evo(`/instance/connectionState/${encodeURIComponent(c.instance)}`);
    const state = pickState(stateRes.json);
    if (state === 'open') {
      const number = String(
        (stateRes.json.instance as Record<string, unknown> | undefined)?.ownerJid
        ?? stateRes.json.ownerJid
        ?? '',
      ).replace(/@.*/, '');
      return { connected: true, state, instance: c.instance, provider: 'evolution', number: number || undefined };
    }

    const qrRes = await evo(`/instance/connect/${encodeURIComponent(c.instance)}`);
    return {
      connected: false,
      state: state === 'unknown' ? 'connecting' : state,
      instance: c.instance,
      provider: 'evolution',
      qr: pickQr(qrRes.json) ?? pickQr(stateRes.json),
    };
  } catch (err) {
    return {
      connected: false,
      state: 'unknown',
      instance: c.instance,
      provider: 'evolution',
      error: err instanceof Error ? err.message : 'Durum alınamadı',
    };
  }
}

export async function startWhatsAppLogin(): Promise<WhatsAppStatus> {
  statusCache = null;
  const c = evolutionConfig();
  if (!(await pingEvolution())) {
    return { connected: false, state: 'close', instance: c.instance, provider: 'offline', error: 'Evolution API çalışmıyor' };
  }

  const created = await evo('/instance/create', {
    method: 'POST',
    body: JSON.stringify({
      instanceName: c.instance,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
    }),
  });

  if (!created.ok && created.status !== 403 && created.status !== 409) {
    const reason = String(created.json.message ?? created.json.error ?? 'Instans oluşturulamadı');
    if (!/already|exist/i.test(reason)) {
      return { connected: false, state: 'close', instance: c.instance, provider: 'evolution', error: reason, qr: pickQr(created.json) };
    }
  }

  const qr = pickQr(created.json);
  if (qr) {
    return { connected: false, state: 'connecting', instance: c.instance, provider: 'evolution', qr };
  }
  return getWhatsAppStatus();
}

export async function logoutWhatsApp(): Promise<void> {
  statusCache = null;
  const c = evolutionConfig();
  await evo(`/instance/logout/${encodeURIComponent(c.instance)}`, { method: 'DELETE' }).catch(() => undefined);
}

export async function sendWhatsAppText(phone: string, text: string): Promise<void> {
  const { phoneToWhatsAppNumber } = await import('./config');
  const c = evolutionConfig();
  const status = await getWhatsAppStatus();
  if (!status.connected) {
    throw new Error('WhatsApp bağlı değil. Yönetim panelinden QR ile giriş yapın.');
  }
  const sent = await evo(`/message/sendText/${encodeURIComponent(c.instance)}`, {
    method: 'POST',
    body: JSON.stringify({
      number: phoneToWhatsAppNumber(phone),
      text,
    }),
  });
  if (!sent.ok) {
    throw new Error(String(sent.json.message ?? sent.json.error ?? 'WhatsApp mesajı gönderilemedi'));
  }
}
