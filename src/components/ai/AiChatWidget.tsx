'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

type Message = { role: 'user' | 'assistant'; content: string };

export default function AiChatWidget() {
  const t = useTranslations('AI');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('chat_welcome') },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.filter((m) => m.role !== 'assistant' || next.indexOf(m) > 0),
          locale,
        }),
      });
      const json = await res.json() as { success: boolean; data?: { reply: string } };
      const reply = json.data?.reply ?? t('chat_error');
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: t('chat_error') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          aria-label={t('chat_open')}
        >
          <Sparkles size={18} />
          <span className="font-semibold text-sm hidden sm:inline">{t('chat_title')}</span>
          <Bot size={20} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[min(100vw-2rem,400px)] h-[min(80vh,560px)] flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <p className="font-bold text-sm">{t('chat_title')}</p>
                <p className="text-[10px] text-white/80">{t('chat_subtitle')}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg" aria-label={t('chat_close')}>
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-primary)] text-white rounded-br-md'
                      : 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] border border-[var(--color-border)] rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-[var(--color-muted)] text-sm">
                <Loader2 size={16} className="animate-spin" />
                {t('chat_thinking')}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[var(--color-border)] flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              placeholder={t('chat_placeholder')}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-violet-600 text-white disabled:opacity-50 hover:bg-violet-700 transition-colors"
              aria-label={t('chat_send')}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
