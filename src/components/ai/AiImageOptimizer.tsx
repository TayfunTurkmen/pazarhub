'use client';

import { useState } from 'react';
import { ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface OptimizeResult {
  score: number;
  issues: string[];
  suggestions: string[];
  altText: string;
  caption: string;
}

interface Props {
  file: File;
  listingTitle?: string;
  onOptimized?: (result: OptimizeResult) => void;
}

export default function AiImageOptimizer({ file, listingTitle, onOptimized }: Props) {
  const t = useTranslations('AI');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/image-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          listingTitle,
        }),
      });
      const json = await res.json() as { success: boolean; data?: OptimizeResult };
      if (json.data) {
        setResult(json.data);
        onOptimized?.(json.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!result) {
    return (
      <button
        type="button"
        onClick={analyze}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 font-medium"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
        {t('image_analyze')}
      </button>
    );
  }

  return (
    <div className="mt-2 p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-violet-700">{t('image_score')}: {result.score}/100</span>
        {result.score >= 70 ? (
          <CheckCircle2 size={14} className="text-emerald-500" />
        ) : (
          <AlertCircle size={14} className="text-amber-500" />
        )}
      </div>
      {result.issues.length > 0 && (
        <ul className="text-amber-600 space-y-0.5">
          {result.issues.map((issue) => (
            <li key={issue}>• {issue}</li>
          ))}
        </ul>
      )}
      {result.suggestions.length > 0 && (
        <ul className="text-[var(--color-muted)] space-y-0.5">
          {result.suggestions.slice(0, 2).map((s) => (
            <li key={s}>→ {s}</li>
          ))}
        </ul>
      )}
      {result.altText && (
        <p className="text-[var(--color-muted)] italic">Alt: {result.altText}</p>
      )}
    </div>
  );
}
