'use client';

import { useCallback, useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { QrCode, Smartphone, RefreshCw, LogOut, Send } from 'lucide-react';

interface WhatsAppStatus {
  connected: boolean;
  state: string;
  instance: string;
  qr?: string;
  number?: string;
  provider: string;
  error?: string;
}

export default function AdminWhatsAppPage() {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async (action: 'refresh' | 'connect' | 'logout' = 'refresh') => {
    setBusy(action);
    try {
      const res = await fetch('/api/admin/whatsapp', {
        method: action === 'refresh' ? 'GET' : 'POST',
        headers: action === 'refresh' ? undefined : { 'Content-Type': 'application/json' },
        body: action === 'refresh' ? undefined : JSON.stringify({ action }),
      });
      const json = await res.json() as { success: boolean; data?: WhatsAppStatus; error?: string };
      if (json.success && json.data) setStatus(json.data);
      else setMessage(json.error || 'İşlem başarısız');
    } finally {
      setBusy('');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load('connect');
    const id = setInterval(() => { void load('refresh'); }, 4000);
    return () => clearInterval(id);
  }, [load]);

  const sendTest = async () => {
    setBusy('test');
    setMessage('');
    try {
      const res = await fetch('/api/admin/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', phone: testPhone, text: 'sendekonutal.com WhatsApp bağlantı testi.' }),
      });
      const json = await res.json() as { success: boolean; error?: string };
      setMessage(json.success ? 'Test mesajı gönderildi.' : (json.error || 'Gönderilemedi'));
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black">WhatsApp · Evolution API</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Aynı container içindeki Evolution API ile WhatsApp Web girişi. Telefonda WhatsApp → Bağlı cihazlar → Cihaz bağla.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className={status?.connected ? 'text-emerald-500' : 'text-[var(--color-muted)]'} />
            <div>
              <p className="font-bold">{status?.connected ? 'WhatsApp bağlı' : 'QR ile giriş bekleniyor'}</p>
              <p className="text-xs text-[var(--color-muted)]">
                {status?.instance} · {status?.state} · {status?.number || status?.provider}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => load('refresh')} disabled={Boolean(busy)}>
              <RefreshCw size={14} /> Yenile
            </Button>
            <Button size="sm" variant="ghost" onClick={() => load('logout')} disabled={Boolean(busy)}>
              <LogOut size={14} /> Çıkış
            </Button>
          </div>
        </div>

        {status?.error && <p className="text-sm text-rose-600">{status.error}</p>}
        {loading && <p className="text-sm text-[var(--color-muted)]">Evolution API sorgulanıyor…</p>}

        {!status?.connected && status?.qr && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="bg-white p-4 rounded-2xl border border-[var(--color-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={status.qr} alt="WhatsApp QR" className="w-64 h-64" />
            </div>
            <p className="text-sm text-center text-[var(--color-muted)] max-w-sm">
              QR 20–40 saniyede yenilenir. Okutulunca giriş kodu gönderimi ve ilan bildirimleri bu numaradan gider.
            </p>
          </div>
        )}

        {!status?.connected && !status?.qr && !loading && (
          <Button onClick={() => load('connect')} disabled={Boolean(busy)}>
            <QrCode size={16} /> QR oluştur
          </Button>
        )}
      </Card>

      {status?.connected && (
        <Card className="p-6 space-y-3">
          <h2 className="font-bold">Test mesajı</h2>
          <Input label="Alıcı telefon" value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="05XX XXX XX XX" />
          <Button onClick={sendTest} disabled={Boolean(busy) || !testPhone}>
            <Send size={16} /> Gönder
          </Button>
        </Card>
      )}

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
