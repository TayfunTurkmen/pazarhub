export interface CMSPage {
    id: string;
    slug: string;
    title: string;
    content: string; // HTML or JSON for blocks
    status: 'published' | 'draft';
}

export interface SiteSettings {
    title: string;
    primaryColor: string;
    logoUrl: string;
}

let PAGES: CMSPage[] = [
    { id: '1', slug: 'about', title: 'Hakkımızda', content: '<p>Varsayılan Hakkımızda Yazısı</p>', status: 'published' },
    { id: '2', slug: 'contact', title: 'İletişim', content: '<p>Varsayılan İletişim Bilgileri</p>', status: 'published' },
    { id: '3', slug: 'terms', title: 'Kullanım Koşulları', content: '<p>Kullanım Koşulları...</p>', status: 'published' },
    { id: '4', slug: 'privacy', title: 'Gizlilik Politikası', content: '<p>Gizlilik Politikası...</p>', status: 'published' },
];

let SETTINGS: SiteSettings = {
    title: 'sendekonutal.com',
    primaryColor: '#3255a4',
    logoUrl: '/logo.png'
};

export const getPages = async () => {
    return PAGES;
};

export const getPageBySlug = async (slug: string) => {
    return PAGES.find(p => p.slug === slug);
};

export const updatePage = async (id: string, data: Partial<CMSPage>) => {
    PAGES = PAGES.map(p => p.id === id ? { ...p, ...data } : p);
    return PAGES.find(p => p.id === id);
};

export const getSettings = async () => {
    return SETTINGS;
};

export const updateSettings = async (data: Partial<SiteSettings>) => {
    SETTINGS = { ...SETTINGS, ...data };
    return SETTINGS;
};
