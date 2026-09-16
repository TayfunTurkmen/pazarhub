import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const securityHeaders = [
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    {
        key: 'Content-Security-Policy',
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paytr.com https://*.iyzipay.com",
            "style-src 'self' 'unsafe-inline' https://www.paytr.com https://*.iyzipay.com",
            "img-src 'self' data: blob: https://images.unsplash.com https://i.pravatar.cc https://*.blob.vercel-storage.com https://www.paytr.com https://*.iyzipay.com",
            "font-src 'self' data:",
            "connect-src 'self' https://*.upstash.io https://www.paytr.com https://*.iyzipay.com https://sandbox-api.iyzipay.com",
            "frame-src 'self' https://www.paytr.com https://*.paytr.com https://*.iyzipay.com https://sandbox-api.iyzipay.com",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self' https://www.paytr.com https://*.iyzipay.com",
        ].join('; '),
    },
];

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'i.pravatar.cc' },
            { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
