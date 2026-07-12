import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import PageHero from '@/components/layout/PageHero';
import { Building2, Users, Lightbulb, Heart, Target, Eye } from 'lucide-react';

export default async function AboutPage() {
  const t = await getTranslations('Pages');

  const values = [
    { icon: Heart, label: t('about_value1'), color: 'text-rose-500 bg-rose-500/10' },
    { icon: Eye, label: t('about_value2'), color: 'text-blue-500 bg-blue-500/10' },
    { icon: Lightbulb, label: t('about_value3'), color: 'text-[var(--color-secondary)] bg-[var(--color-secondary)]/10' },
    { icon: Users, label: t('about_value4'), color: 'text-emerald-500 bg-emerald-500/10' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <PageHero
        icon={Building2}
        title={t('about_title')}
        description={t('about_desc')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Target size={20} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">{t('about_mission')}</h2>
          </div>
          <p className="text-[var(--color-muted)] leading-relaxed">{t('about_mission_text')}</p>
        </Card>
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Eye size={20} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">{t('about_vision')}</h2>
          </div>
          <p className="text-[var(--color-muted)] leading-relaxed">{t('about_vision_text')}</p>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-center mb-8 text-[var(--color-foreground)]">{t('about_values')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {values.map((v) => (
            <Card key={v.label} className="p-6 text-center hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all">
              <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center mx-auto mb-3`}>
                <v.icon size={24} />
              </div>
              <p className="font-semibold text-[var(--color-foreground)] text-sm">{v.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
