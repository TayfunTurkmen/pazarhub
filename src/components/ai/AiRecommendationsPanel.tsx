'use client';

import { useState } from 'react';
import { Sparkles, Loader2, MapPin, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Recommendation {
  listingId: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  district: string;
  image: string | null;
  score: number;
  reasons: string[];
  roomCount?: string;
  listingType?: string;
}

export default function AiRecommendationsPanel() {
  const t = useTranslations('AI');
  const [preferences, setPreferences] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[]>([]);

  const search = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences,
          city: city || undefined,
          budget: budget ? Number(budget) : undefined,
          limit: 6,
        }),
      });
      const json = await res.json() as { success: boolean; data?: { recommendations: Recommendation[] } };
      setResults(json.data?.recommendations ?? []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-blue-500/5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Sparkles className="text-violet-500" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-[var(--color-foreground)]">{t('recommend_title')}</h3>
          <p className="text-xs text-[var(--color-muted)]">{t('recommend_desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <Input
          label={t('recommend_preferences')}
          placeholder={t('recommend_preferences_placeholder')}
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
        />
        <Input
          label={t('recommend_city')}
          placeholder="İstanbul"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Input
          label={t('recommend_budget')}
          type="number"
          placeholder="5000000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>

      <Button onClick={search} disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Sparkles size={16} className="mr-2" />}
        {t('recommend_btn')}
      </Button>

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-[var(--color-muted)]">{t('recommend_results', { count: results.length })}</p>
          {results.map((r) => (
            <Link
              key={r.listingId}
              href={`/listing/${r.listingId}`}
              className="flex gap-3 p-3 rounded-xl border border-[var(--color-border)] hover:border-violet-500/30 hover:bg-[var(--color-surface-elevated)] transition-all group"
            >
              {r.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[var(--color-foreground)] truncate group-hover:text-violet-600">{r.title}</p>
                <p className="text-xs text-[var(--color-muted)] flex items-center gap-1 mt-0.5">
                  <MapPin size={12} /> {r.city}, {r.district}
                </p>
                <p className="text-sm font-bold text-[var(--color-primary)] mt-1">
                  {r.price.toLocaleString('tr-TR')} {r.currency}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {r.reasons.map((reason) => (
                    <span key={reason} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600">{reason}</span>
                  ))}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">%{r.score}</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-[var(--color-muted)] group-hover:text-violet-500 shrink-0 mt-2" />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
