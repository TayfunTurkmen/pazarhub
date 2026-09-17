import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import AiChatWidget from '@/components/ai/AiChatWidget';
import { APP_DOMAIN, APP_TAGLINE } from '@/lib/constants';
import "../globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: `${APP_DOMAIN} — ${APP_TAGLINE}`,
    template: `%s | ${APP_DOMAIN}`,
  },
  description: APP_TAGLINE,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: '/brand/favicon.png',
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${display.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              <Header />
              <main className="flex-grow container-custom py-8">
                {children}
              </main>
              <Footer />
              <AiChatWidget />
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
