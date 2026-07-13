'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Sparkles, Bot, Home, FileText, ImageIcon, Target,
  Loader2, Flame, Thermometer, Snowflake,
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  score: number;
  grade: string;
  intent: string;
  summary: string | null;
  createdAt: string;
}

const gradeIcon: Record<string, typeof Flame> = {
  hot: Flame,
  warm: Thermometer,
  cold: Snowflake,
};

const gradeColor: Record<string, string> = {
  hot: 'text-rose-500 bg-rose-500/10',
  warm: 'text-amber-500 bg-amber-500/10',
  cold: 'text-blue-500 bg-blue-500/10',
};

export default function AdminAiPage() {
  const t = useTranslations('AI');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogResult, setBlogResult] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  const generateBlog = async (publish: boolean) => {
    if (!topic.trim()) return;
    setBlogLoading(true);
    try {
      const res = await fetch('/api/ai/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
          publish,
        }),
      });
      const json = await res.json() as { success: boolean; data?: { generated?: { title: string; content: string }; post?: { slug: string } } };
      if (json.success && json.data?.generated) {
        setBlogResult(json.data.generated.title + (json.data.post ? ` → /blog/${json.data.post.slug}` : ''));
      }
    } finally {
      setBlogLoading(false);
    }
  };

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/ai/lead-qualify');
      const json = await res.json() as { success: boolean; data?: { leads: Lead[] } };
      setLeads(json.data?.leads ?? []);
    } finally {
      setLeadsLoading(false);
    }
  };

  const features = [
    { icon: Bot, title: t('feature_chat_title'), desc: t('feature_chat_desc') },
    { icon: Home, title: t('feature_recommend_title'), desc: t('feature_recommend_desc') },
    { icon: FileText, title: t('feature_blog_title'), desc: t('feature_blog_desc') },
    { icon: ImageIcon, title: t('feature_image_title'), desc: t('feature_image_desc') },
    { icon: Target, title: t('feature_lead_title'), desc: t('feature_lead_desc') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-violet-500" size={24} />
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{t('admin_title')}</h1>
        </div>
        <p className="text-sm text-[var(--color-muted)]">{t('admin_desc')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="p-5">
            <Icon size={20} className="text-violet-500 mb-2" />
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-[var(--color-muted)] mt-1">{desc}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-emerald-500" />
          {t('admin_blog_generator')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input label={t('admin_blog_topic')} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t('admin_blog_topic_placeholder')} />
          <Input label={t('admin_blog_keywords')} value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="emlak, konut, yatırım" />
        </div>
        <div className="flex gap-3">
          <Button onClick={() => generateBlog(false)} disabled={blogLoading}>
            {blogLoading && <Loader2 size={16} className="animate-spin mr-2" />}
            {t('admin_blog_preview')}
          </Button>
          <Button onClick={() => generateBlog(true)} disabled={blogLoading} variant="secondary">
            {t('admin_blog_publish')}
          </Button>
        </div>
        {blogResult && <p className="mt-4 text-sm text-emerald-600 font-medium">{blogResult}</p>}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Target size={20} className="text-rose-500" />
            {t('admin_leads')}
          </h2>
          <Button onClick={loadLeads} disabled={leadsLoading} variant="secondary">
            {leadsLoading ? <Loader2 size={16} className="animate-spin" /> : t('admin_leads_refresh')}
          </Button>
        </div>
        {leads.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">{t('admin_leads_empty')}</p>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => {
              const Icon = gradeIcon[lead.grade] ?? Snowflake;
              return (
                <div key={lead.id} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--color-border)]">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${gradeColor[lead.grade] ?? gradeColor.cold}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{lead.name} — {lead.email}</p>
                    <p className="text-xs text-[var(--color-muted)]">{lead.summary}</p>
                    <div className="flex gap-2 mt-1 text-[10px]">
                      <span className="font-bold">Skor: {lead.score}</span>
                      <span>{lead.intent}</span>
                      <span>{new Date(lead.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
