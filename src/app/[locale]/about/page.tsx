import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import { Building2, Users, Lightbulb, Heart, Target, Eye } from 'lucide-react';

export default async function AboutPage() {
    const t = await getTranslations('Pages');

    const values = [
        { icon: Heart, label: t('about_value1'), color: 'text-red-500' },
        { icon: Eye, label: t('about_value2'), color: 'text-blue-500' },
        { icon: Lightbulb, label: t('about_value3'), color: 'text-yellow-500' },
        { icon: Users, label: t('about_value4'), color: 'text-green-500' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Hero */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4">
                    <Building2 size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">{t('about_title')}</h1>
                <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">{t('about_desc')}</p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Target size={24} className="text-[var(--color-primary)]" />
                        <h2 className="text-xl font-bold text-[var(--color-foreground)]">{t('about_mission')}</h2>
                    </div>
                    <p className="text-[var(--color-muted)] leading-relaxed">{t('about_mission_text')}</p>
                </Card>
                <Card className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Eye size={24} className="text-[var(--color-primary)]" />
                        <h2 className="text-xl font-bold text-[var(--color-foreground)]">{t('about_vision')}</h2>
                    </div>
                    <p className="text-[var(--color-muted)] leading-relaxed">{t('about_vision_text')}</p>
                </Card>
            </div>

            {/* Values */}
            <div>
                <h2 className="text-2xl font-bold text-center mb-8 text-[var(--color-foreground)]">{t('about_values')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {values.map((v) => (
                        <Card key={v.label} className="p-6 text-center hover:shadow-lg transition-shadow">
                            <v.icon size={32} className={`mx-auto mb-3 ${v.color}`} />
                            <p className="font-semibold text-[var(--color-foreground)]">{v.label}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
