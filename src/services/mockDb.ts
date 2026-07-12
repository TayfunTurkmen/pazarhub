import { Listing, Category, User, FilterState, PaginatedResult, RegisterInput, Conversation, Message } from '@/types';
import { IListingRepository, IUserRepository, ICategoryRepository, IDatabase, IFavoriteRepository, IMessageRepository } from './repository';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/lib/constants';
import { normalizePhone, phoneToEmail } from '@/lib/phone';

// ============================================================
// Mock Data
// ============================================================

const CATEGORIES: Category[] = [
    // ── Root Categories ──
    { id: '1', name: 'Emlak', slug: 'emlak', icon: 'Building2' },
    { id: '2', name: 'Vasıta', slug: 'vasita', icon: 'Car' },
    { id: '3', name: 'İkinci El ve Sıfır Alışveriş', slug: 'alisveris', icon: 'ShoppingBag' },
    { id: '4', name: 'Turizm', slug: 'turizm', icon: 'Palmtree' },
    { id: '5', name: 'Yardımcı Hizmetler', slug: 'yardimci-hizmetler', icon: 'Wrench' },
    { id: '6', name: 'Sahiplendirme', slug: 'sahiplendirme', icon: 'PawPrint' },
    { id: '7', name: 'İş İlanları', slug: 'is-ilanlari', icon: 'Briefcase' },
    // ── Emlak subcategories ──
    { id: '11', name: 'Konut', slug: 'konut', parentId: '1' },
    { id: '12', name: 'İş Yeri', slug: 'isyeri', parentId: '1' },
    { id: '13', name: 'Arsa', slug: 'arsa', parentId: '1' },
    { id: '14', name: 'Devremülk', slug: 'devremulk', parentId: '1' },
    { id: '111', name: 'Satılık', slug: 'satilik', parentId: '11' },
    { id: '112', name: 'Kiralık', slug: 'kiralik', parentId: '11' },
    // ── Vasıta subcategories ──
    { id: '21', name: 'Otomobil', slug: 'otomobil', parentId: '2' },
    { id: '22', name: 'Arazi, SUV & Pickup', slug: 'arazi-suv-pickup', parentId: '2' },
    { id: '23', name: 'Motosiklet', slug: 'motosiklet', parentId: '2' },
    { id: '24', name: 'Minivan & Panelvan', slug: 'minivan-panelvan', parentId: '2' },
    { id: '25', name: 'Ticari Araçlar', slug: 'ticari-araclar', parentId: '2' },
    { id: '211', name: 'Satılık', slug: 'satilik-otomobil', parentId: '21' },
    { id: '212', name: 'Kiralık', slug: 'kiralik-otomobil', parentId: '21' },
    // ── Alışveriş subcategories ──
    { id: '31', name: 'Bilgisayar', slug: 'bilgisayar', parentId: '3' },
    { id: '32', name: 'Telefon', slug: 'telefon', parentId: '3' },
    { id: '33', name: 'Ev Eşyaları', slug: 'ev-esyalari', parentId: '3' },
    { id: '34', name: 'Giyim & Aksesuar', slug: 'giyim-aksesuar', parentId: '3' },
    { id: '35', name: 'Spor & Hobi', slug: 'spor-hobi', parentId: '3' },
    { id: '311', name: 'Sıfır', slug: 'sifir-bilgisayar', parentId: '31' },
    { id: '312', name: 'İkinci El', slug: 'ikinci-el-bilgisayar', parentId: '31' },
    // ── Turizm subcategories ──
    { id: '41', name: 'Otel & Pansiyon', slug: 'otel-pansiyon', parentId: '4' },
    { id: '42', name: 'Apart & Yazlık', slug: 'apart-yazlik', parentId: '4' },
    { id: '43', name: 'Tur & Gezi', slug: 'tur-gezi', parentId: '4' },
    { id: '44', name: 'Kamp Alanı', slug: 'kamp-alani', parentId: '4' },
    // ── Yardımcı Hizmetler subcategories ──
    { id: '51', name: 'Nakliyat', slug: 'nakliyat', parentId: '5' },
    { id: '52', name: 'Tadilat & Dekorasyon', slug: 'tadilat-dekorasyon', parentId: '5' },
    { id: '53', name: 'Temizlik', slug: 'temizlik', parentId: '5' },
    { id: '54', name: 'Tamir & Bakım', slug: 'tamir-bakim', parentId: '5' },
    { id: '55', name: 'Özel Ders', slug: 'ozel-ders', parentId: '5' },
    // ── Sahiplendirme subcategories ──
    { id: '61', name: 'Köpek Sahiplendirme', slug: 'kopek-sahiplendirme', parentId: '6' },
    { id: '62', name: 'Kedi Sahiplendirme', slug: 'kedi-sahiplendirme', parentId: '6' },
    { id: '63', name: 'Kuş Sahiplendirme', slug: 'kus-sahiplendirme', parentId: '6' },
    { id: '64', name: 'Diğer Hayvanlar', slug: 'diger-hayvanlar', parentId: '6' },
    { id: '65', name: 'Evcil Hayvan Malzemeleri', slug: 'evcil-hayvan-malzemeleri', parentId: '6' },
    // ── İş İlanları subcategories ──
    { id: '71', name: 'Tam Zamanlı', slug: 'tam-zamanli', parentId: '7' },
    { id: '72', name: 'Yarı Zamanlı', slug: 'yari-zamanli', parentId: '7' },
    { id: '73', name: 'Freelance', slug: 'freelance', parentId: '7' },
    { id: '74', name: 'Staj', slug: 'staj', parentId: '7' },
];

const USERS: User[] = [
    { id: 'u1', name: 'Ahmet Yılmaz', email: 'demo@example.com', type: 'individual', role: 'user', phone: '05551234567', avatar: 'https://i.pravatar.cc/150?u=u1', verified: true, status: 'active', joinedAt: '2025-06-15T10:00:00Z' },
    { id: 'u2', name: 'Emlak Plus', email: 'corporate@example.com', type: 'corporate', role: 'user', storeName: 'Emlak Plus Gayrimenkul', phone: '02121234567', avatar: 'https://i.pravatar.cc/150?u=u2', verified: true, status: 'active', joinedAt: '2025-03-20T10:00:00Z' },
    { id: 'u3', name: 'Galeri 34', email: 'galeri@example.com', type: 'corporate', role: 'user', storeName: 'Galeri 34 Otomotiv', phone: '02161234567', avatar: 'https://i.pravatar.cc/150?u=u3', verified: true, status: 'active', joinedAt: '2025-01-05T10:00:00Z' },
    { id: 'u4', name: 'Zeynep Kaya', email: 'zeynep@example.com', type: 'individual', role: 'user', phone: '05329876543', avatar: 'https://i.pravatar.cc/150?u=u4', verified: true, status: 'active', joinedAt: '2025-09-10T10:00:00Z' },
    { id: 'u5', name: 'Admin Yönetici', email: 'admin@example.com', type: 'individual', role: 'admin', phone: '05001234567', avatar: 'https://i.pravatar.cc/150?u=u5', verified: true, status: 'active', joinedAt: '2024-12-01T10:00:00Z' },
];

// Mock credential store — replace with hashed passwords + DB in production
const PASSWORDS = new Map<string, string>([
    ['demo@example.com', 'demo'],
    ['corporate@example.com', 'corporate'],
    ['galeri@example.com', 'galeri123'],
    ['zeynep@example.com', 'zeynep123'],
    ['admin@example.com', 'admin'],
]);

const LISTINGS: Listing[] = [
    {
        id: '1001',
        title: 'Kadıköy Merkezde Yenilenmiş 3+1 Daire',
        description: 'Bütün tesisat yenilendi, metroya yürüme mesafesinde. Hemen taşınmaya uygun. Krediye uygun. AİDAT: 850 TL. Apartman yeni boyandı, asansör mevcut.',
        price: 5250000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '11')!,
        location: { city: 'İstanbul', district: 'Kadıköy', neighborhood: 'Caferağa', street: 'Moda Cad.', lat: 40.9880, lng: 29.0250 },
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Bina Yaşı': 25, 'Kat Sayısı': 5, 'Banyo Sayısı': 1, 'Balkon': 'Var', 'Asansör': 'Var', 'Otopark': 'Yok' },
        roomCount: '3+1', netArea: 100, floor: 3, heating: 'Kombi', listingType: 'sale', tier: 'showcase',
        seller: USERS[0], createdAt: '2025-12-15T10:30:00Z', updatedAt: '2025-12-15T10:30:00Z', status: 'active', featured: true,
    },
    {
        id: '1002',
        title: 'Beşiktaş Boğaz Manzaralı 2+1 Residence',
        description: 'Eşsiz boğaz manzarası, geniş balkon, ferah odalar. 7/24 güvenlik, kapalı otopark, havuz, fitness salonu. Profesyonelce dekore edilmiştir.',
        price: 12500000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '11')!,
        location: { city: 'İstanbul', district: 'Beşiktaş', neighborhood: 'Levent', street: 'Sümbül Sok.', lat: 41.0790, lng: 29.0110 },
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Bina Yaşı': 3, 'Kat Sayısı': 25, 'Banyo Sayısı': 2, 'Balkon': 'Var', 'Asansör': 'Var', 'Otopark': 'Kapalı' },
        roomCount: '2+1', netArea: 95, floor: 18, heating: 'Merkezi', listingType: 'sale', tier: 'showcase',
        seller: USERS[1], createdAt: '2025-11-20T14:00:00Z', updatedAt: '2025-11-20T14:00:00Z', status: 'active', featured: true,
    },
    {
        id: '1003',
        title: 'Ankara Çankaya Lüks 4+1 Villa Tipi',
        description: 'Site içerisinde, güvenlikli, kapalı otoparklı, ankastre mutfaklı. Özel bahçe, barbekü alanı. Amerikan mutfak, giyinme odası mevcut.',
        price: 9750000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '11')!,
        location: { city: 'Ankara', district: 'Çankaya', neighborhood: 'Oran', street: 'Kudüs Cad.', lat: 39.8450, lng: 32.8350 },
        images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Bina Yaşı': 2, 'Kat Sayısı': 3, 'Banyo Sayısı': 3, 'Balkon': 'Var', 'Asansör': 'Yok', 'Otopark': 'Açık' },
        roomCount: '4+1', netArea: 220, floor: 1, heating: 'Yerden Isıtma', listingType: 'sale', tier: 'premium',
        seller: USERS[0], createdAt: '2025-10-05T08:00:00Z', updatedAt: '2025-10-05T08:00:00Z', status: 'active', featured: true,
    },
    {
        id: '1004',
        title: 'İzmir Alsancak Deniz Manzaralı Stüdyo',
        description: 'Kordon\'a 2 dakika yürüme mesafesinde. Tam eşyalı, yatırıma uygun. Kısa dönem kiralama potansiyeli yüksek.',
        price: 3200000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '11')!,
        location: { city: 'İzmir', district: 'Konak', neighborhood: 'Alsancak', street: 'Kıbrıs Şehitleri Cad.', lat: 38.4360, lng: 27.1420 },
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Bina Yaşı': 15, 'Kat Sayısı': 8, 'Banyo Sayısı': 1, 'Balkon': 'Var', 'Asansör': 'Var', 'Otopark': 'Yok' },
        roomCount: '1+0', netArea: 45, floor: 6, heating: 'Kombi', listingType: 'sale', tier: 'premium',
        seller: USERS[3], createdAt: '2025-12-01T12:00:00Z', updatedAt: '2025-12-01T12:00:00Z', status: 'active', featured: true,
    },
    {
        id: '1005',
        title: 'Antalya Konyaaltı Sıfır 3+1 Daire',
        description: 'Denize 500m, sıfır bina, akıllı ev sistemi. Havuz, sauna, çocuk oyun alanı mevcut. Yatırım için ideal.',
        price: 4800000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '11')!,
        location: { city: 'Antalya', district: 'Konyaaltı', neighborhood: 'Liman', lat: 36.8520, lng: 30.6080 },
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Bina Yaşı': 0, 'Kat Sayısı': 12, 'Banyo Sayısı': 2, 'Balkon': 'Var', 'Asansör': 'Var', 'Otopark': 'Kapalı' },
        roomCount: '3+1', netArea: 140, floor: 7, heating: 'Merkezi (Pay Ölçer)', listingType: 'sale', tier: 'standard',
        seller: USERS[1], createdAt: '2025-11-10T09:00:00Z', updatedAt: '2025-11-10T09:00:00Z', status: 'pending', featured: false,
    },
    {
        id: '1006',
        title: 'Bursa Nilüfer Satılık Bahçeli Müstakil',
        description: 'Doğa ile iç içe, 350m² bahçe, 2 katlı müstakil ev. Garaj, kış bahçesi, şömine mevcut. Aileler için ideal.',
        price: 7200000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '11')!,
        location: { city: 'Bursa', district: 'Nilüfer', neighborhood: 'Görükle', lat: 40.2280, lng: 28.8520 },
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Bina Yaşı': 8, 'Kat Sayısı': 2, 'Banyo Sayısı': 2, 'Balkon': 'Var', 'Asansör': 'Yok', 'Otopark': 'Açık' },
        roomCount: '5+2', netArea: 280, floor: 0, heating: 'Kombi', listingType: 'sale', tier: 'premium',
        seller: USERS[3], createdAt: '2025-09-20T16:00:00Z', updatedAt: '2025-09-20T16:00:00Z', status: 'active', featured: true,
    },
    {
        id: '1007',
        title: 'Sahibinden 2024 Model BMW 320i, Hatasız',
        description: 'Sadece 8.000 km, garaj arabası. Tramersiz, boyasız. M Sport paket, harman kardon ses sistemi.',
        price: 2850000, currency: 'TL',
        category: CATEGORIES[1],
        location: { city: 'Ankara', district: 'Çankaya', lat: 39.9200, lng: 32.8530 },
        images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Yıl': 2024, 'Km': 8000, 'Renk': 'Beyaz', 'Vites': 'Otomatik', 'Yakıt': 'Benzin', 'Motor': '2.0L Turbo' }, listingType: 'sale', tier: 'standard',
        seller: USERS[2], createdAt: '2025-12-10T11:00:00Z', updatedAt: '2025-12-10T11:00:00Z', status: 'rejected', featured: false,
    },
    {
        id: '1008',
        title: 'Acil Satılık iPhone 15 Pro Max 256GB',
        description: 'Kutulu faturalı, Apple TR garantili. Pil sağlığı %98. Kılıf ve cam hediye.',
        price: 62000, currency: 'TL',
        category: CATEGORIES[2],
        location: { city: 'İzmir', district: 'Karşıyaka', lat: 38.4550, lng: 27.1150 },
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Marka': 'Apple', 'Model': 'iPhone 15 Pro Max', 'Hafıza': '256 GB', 'Renk': 'Titanium', 'Garanti': 'Apple TR' }, listingType: 'sale', tier: 'showcase',
        seller: USERS[0], createdAt: '2025-12-12T15:00:00Z', updatedAt: '2025-12-12T15:00:00Z', status: 'active', featured: true,
    },
    {
        id: '1009',
        title: 'Eskişehir Tepebaşı Kiralık 2+1',
        description: 'Üniversiteye yakın, ulaşıma kolay, eşyalı. Öğrenci ve çalışanlar için uygun. Aidat dahil.',
        price: 15000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '112')!,
        location: { city: 'Eskişehir', district: 'Tepebaşı', neighborhood: 'Batıkent', street: 'Bülent Ecevit Blv.', lat: 39.7900, lng: 30.5000 },
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Bina Yaşı': 5, 'Depozito': '1 Ay', 'Eşya': 'Eşyalı', 'Aidat': 'Dahil' },
        roomCount: '2+1', netArea: 85, floor: 2, heating: 'Doğalgaz (Kombi)', listingType: 'rent', tier: 'standard',
        seller: USERS[3], createdAt: '2025-12-08T10:00:00Z', updatedAt: '2025-12-08T10:00:00Z', status: 'pending', featured: false,
    },
    {
        id: '1010',
        title: 'Trabzon Ortahisar Sıfır Proje 1+1',
        description: 'Boztepe manzaralı, site içi, havuz, otopark dahil. Yabancıya uygun tapulu. Yatırım fırsatı.',
        price: 2100000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '11')!,
        location: { city: 'Trabzon', district: 'Ortahisar', neighborhood: 'Boztepe', lat: 40.9950, lng: 39.7300 },
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Bina Yaşı': 0, 'Kat Sayısı': 15, 'Banyo Sayısı': 1, 'Balkon': 'Var', 'Asansör': 'Var', 'Otopark': 'Kapalı' },
        roomCount: '1+1', netArea: 65, floor: 10, heating: 'Merkezi', listingType: 'sale', tier: 'premium',
        seller: USERS[1], createdAt: '2025-11-25T13:00:00Z', updatedAt: '2025-11-25T13:00:00Z', status: 'active', featured: true,
    },
    {
        id: '1011',
        title: 'Mercedes-Benz C200d AMG 2023 Dizel',
        description: 'Full+Full donanım, gece paketi, panoramik tavan. Değişensiz, boyasız, tramersiz.',
        price: 3450000, currency: 'TL',
        category: CATEGORIES[1],
        location: { city: 'İstanbul', district: 'Ataşehir', lat: 40.9900, lng: 29.1100 },
        images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Yıl': 2023, 'Km': 22000, 'Renk': 'Siyah', 'Vites': 'Otomatik', 'Yakıt': 'Dizel', 'Motor': '1.6L' }, listingType: 'sale', tier: 'premium',
        seller: USERS[2], createdAt: '2025-12-14T09:00:00Z', updatedAt: '2025-12-14T09:00:00Z', status: 'active', featured: false,
    },
    {
        id: '1012',
        title: 'MacBook Pro M3 Pro 14" 512GB',
        description: 'Kutusu açılmamış, Apple TR garantili. Space Black renk. Faturalı.',
        price: 85000, currency: 'TL',
        category: CATEGORIES[2],
        location: { city: 'Ankara', district: 'Yenimahalle', lat: 39.9600, lng: 32.8100 },
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Marka': 'Apple', 'Model': 'MacBook Pro 14"', 'İşlemci': 'M3 Pro', 'RAM': '18 GB', 'SSD': '512 GB' }, listingType: 'sale', tier: 'standard',
        seller: USERS[3], createdAt: '2025-12-13T17:00:00Z', updatedAt: '2025-12-13T17:00:00Z', status: 'active', featured: false,
    },
    // ── Vasıta - Otomobil ──
    {
        id: '1013', title: 'Volkswagen Golf 8 1.5 TSI 2023', description: 'Hatasız, boyasız, 15.000 km. Dijital kokpit, CarPlay, LED farlar.',
        price: 1650000, currency: 'TL', category: CATEGORIES.find(c => c.id === '21')!,
        location: { city: 'İstanbul', district: 'Ümraniye', lat: 41.0250, lng: 29.0980 },
        images: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Yıl': 2023, 'Km': 15000, 'Renk': 'Gri', 'Vites': 'Otomatik', 'Yakıt': 'Benzin' }, listingType: 'sale', tier: 'showcase',
        seller: USERS[2], createdAt: '2025-12-16T10:00:00Z', updatedAt: '2025-12-16T10:00:00Z', status: 'active', featured: true,
    },
    // ── Vasıta - Motosiklet ──
    {
        id: '1014', title: 'Honda CBR 650R 2024 Sıfır Ayarında', description: 'Sadece 1.200 km, ilk sahibinden. Tüm bakımları yapılmış.',
        price: 420000, currency: 'TL', category: CATEGORIES.find(c => c.id === '23')!,
        location: { city: 'Ankara', district: 'Çankaya', lat: 39.9000, lng: 32.8600 },
        images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Yıl': 2024, 'Km': 1200, 'Motor': '650cc', 'Tip': 'Sport' }, listingType: 'sale', tier: 'standard',
        seller: USERS[0], createdAt: '2025-12-15T14:00:00Z', updatedAt: '2025-12-15T14:00:00Z', status: 'active', featured: false,
    },
    // ── Alışveriş - Telefon ──
    {
        id: '1015', title: 'Samsung Galaxy S24 Ultra 512GB', description: 'Garantili, kutulu, tüm aksesuarlar mevcut. S-Pen dahil.',
        price: 55000, currency: 'TL', category: CATEGORIES.find(c => c.id === '32')!,
        location: { city: 'İstanbul', district: 'Şişli', lat: 41.0600, lng: 28.9870 },
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Marka': 'Samsung', 'Model': 'Galaxy S24 Ultra', 'Hafıza': '512 GB', 'Renk': 'Titanium Gray' }, listingType: 'sale', tier: 'premium',
        seller: USERS[3], createdAt: '2025-12-14T11:00:00Z', updatedAt: '2025-12-14T11:00:00Z', status: 'active', featured: true,
    },
    // ── Alışveriş - Ev Eşyaları ──
    {
        id: '1016', title: 'L Koltuk Takımı - Krem Kadife', description: '8 ay kullanılmış, leke yok, çok temiz. Pet-friendly kumaş.',
        price: 18000, currency: 'TL', category: CATEGORIES.find(c => c.id === '33')!,
        location: { city: 'İzmir', district: 'Bornova', lat: 38.4620, lng: 27.2150 },
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Durum': 'Az kullanılmış', 'Renk': 'Krem', 'Marka': 'Bellona' }, listingType: 'sale', tier: 'standard',
        seller: USERS[0], createdAt: '2025-12-10T09:00:00Z', updatedAt: '2025-12-10T09:00:00Z', status: 'active', featured: false,
    },
    // ── Turizm - Apart ──
    {
        id: '1017', title: 'Fethiye Ölüdeniz Havuzlu Villa - Haftalık', description: 'Özel havuzlu, 4 yatak odalı, denize 5 dk. WiFi, klima, otopark dahil.',
        price: 25000, currency: 'TL', category: CATEGORIES.find(c => c.id === '42')!,
        location: { city: 'Muğla', district: 'Fethiye', neighborhood: 'Ölüdeniz', lat: 36.5450, lng: 29.1200 },
        images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Tip': 'Villa', 'Kapasite': '8 Kişi', 'Havuz': 'Özel', 'Süre': 'Haftalık' }, listingType: 'rent', tier: 'showcase',
        seller: USERS[1], createdAt: '2025-12-17T08:00:00Z', updatedAt: '2025-12-17T08:00:00Z', status: 'active', featured: true,
    },
    // ── Turizm - Otel ──
    {
        id: '1018', title: 'Kapadokya Taş Konak Butik Otel - 2 Gece', description: 'Balon manzaralı oda, açık büfe kahvaltı dahil. Çiftlere özel paket.',
        price: 8500, currency: 'TL', category: CATEGORIES.find(c => c.id === '41')!,
        location: { city: 'Nevşehir', district: 'Göreme', lat: 38.6430, lng: 34.8300 },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Tip': 'Butik Otel', 'Süre': '2 Gece', 'Kahvaltı': 'Dahil' }, listingType: 'rent', tier: 'premium',
        seller: USERS[1], createdAt: '2025-12-16T12:00:00Z', updatedAt: '2025-12-16T12:00:00Z', status: 'active', featured: true,
    },
    // ── Yardımcı Hizmetler - Nakliyat ──
    {
        id: '1019', title: 'İstanbul Şehir İçi Evden Eve Nakliyat', description: 'Sigortalı, asansörlü, profesyonel ekip. Paketleme hizmeti dahil.',
        price: 7500, currency: 'TL', category: CATEGORIES.find(c => c.id === '51')!,
        location: { city: 'İstanbul', district: 'Kartal', lat: 40.8900, lng: 29.1900 },
        images: ['https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Hizmet': 'Evden Eve', 'Sigorta': 'Var', 'Asansör': 'Var' }, listingType: 'sale', tier: 'standard',
        seller: USERS[2], createdAt: '2025-12-11T10:00:00Z', updatedAt: '2025-12-11T10:00:00Z', status: 'active', featured: false,
    },
    // ── Yardımcı Hizmetler - Özel Ders ──
    {
        id: '1020', title: 'Matematik Özel Ders - Üniversite Hazırlık', description: 'Boğaziçi mezunu, 10 yıl deneyimli öğretmen. Online/yüz yüze.',
        price: 800, currency: 'TL', category: CATEGORIES.find(c => c.id === '55')!,
        location: { city: 'İstanbul', district: 'Kadıköy', lat: 40.9900, lng: 29.0350 },
        images: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Ders': 'Matematik', 'Seviye': 'Üniversite Hazırlık', 'Format': 'Online/Yüz yüze' }, listingType: 'sale', tier: 'standard',
        seller: USERS[3], createdAt: '2025-12-09T14:00:00Z', updatedAt: '2025-12-09T14:00:00Z', status: 'active', featured: false,
    },
    // ── Sahiplendirme - Köpek ──
    {
        id: '1021', title: 'Golden Retriever Yavrusu Sahiplendirilecek - Ücretsiz', description: 'Yüksek soylu, sağlık kontrolü yapılmış, aşıları tam. İyi bir yuva arıyor. Anne baba görülebilir. SATIŞ DEĞİL, sahiplendirme.',
        price: 0, currency: 'TL', category: CATEGORIES.find(c => c.id === '61')!,
        location: { city: 'Ankara', district: 'Etimesgut', lat: 39.9450, lng: 32.6700 },
        images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Irk': 'Golden Retriever', 'Yaş': '2 Ay', 'Aşı': 'Tam', 'Cinsiyet': 'Erkek', 'Durum': 'Sahiplendirilecek' }, listingType: 'sale', tier: 'premium',
        seller: USERS[0], createdAt: '2025-12-18T09:00:00Z', updatedAt: '2025-12-18T09:00:00Z', status: 'active', featured: true,
    },
    // ── Sahiplendirme - Kedi ──
    {
        id: '1022', title: 'British Shorthair Yavru Sahiplendirilecek - Ücretsiz', description: 'Ev ortamında büyümüş, tuvalet eğitimi verilmiş, çok uysal. İyi bir aile arıyor. SATIŞ DEĞİL, ücretsiz sahiplendirme.',
        price: 0, currency: 'TL', category: CATEGORIES.find(c => c.id === '62')!,
        location: { city: 'İstanbul', district: 'Beşiktaş', lat: 41.0430, lng: 29.0050 },
        images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Irk': 'British Shorthair', 'Yaş': '3 Ay', 'Renk': 'Lilac', 'Cinsiyet': 'Dişi', 'Durum': 'Sahiplendirilecek' }, listingType: 'sale', tier: 'standard',
        seller: USERS[3], createdAt: '2025-12-17T16:00:00Z', updatedAt: '2025-12-17T16:00:00Z', status: 'active', featured: false,
    },
    // ── İş İlanları - Tam Zamanlı ──
    {
        id: '1023', title: 'Senior Frontend Developer - Remote', description: 'React/Next.js deneyimli. Yıllık 600K-900K TL arası. Full remote.',
        price: 0, currency: 'TL', category: CATEGORIES.find(c => c.id === '71')!,
        location: { city: 'İstanbul', district: 'Şişli', lat: 41.0550, lng: 28.9850 },
        images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Pozisyon': 'Frontend Developer', 'Deneyim': '5+ Yıl', 'Çalışma': 'Remote' }, listingType: 'sale', tier: 'showcase',
        seller: USERS[1], createdAt: '2025-12-19T08:00:00Z', updatedAt: '2025-12-19T08:00:00Z', status: 'active', featured: true,
    },
    // ── İş İlanları - Freelance ──
    {
        id: '1024', title: 'Grafik Tasarımcı Aranıyor - Proje Bazlı', description: 'Sosyal medya görselleri, logo tasarımı. Adobe Creative Suite bilgisi şart.',
        price: 0, currency: 'TL', category: CATEGORIES.find(c => c.id === '73')!,
        location: { city: 'Ankara', district: 'Çankaya', lat: 39.9100, lng: 32.8500 },
        images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Pozisyon': 'Grafik Tasarımcı', 'Tip': 'Freelance', 'Araçlar': 'Adobe CC' }, listingType: 'sale', tier: 'standard',
        seller: USERS[2], createdAt: '2025-12-18T14:00:00Z', updatedAt: '2025-12-18T14:00:00Z', status: 'active', featured: false,
    },
];

// ============================================================
// Mock Repository Implementations
// ============================================================

class MockListingRepository implements IListingRepository {
    private data = [...LISTINGS];

    private applyFilters(filter?: FilterState): Listing[] {
        let filtered = [...this.data];

        if (!filter?.adminAll) {
            filtered = filtered.filter(l => l.status === 'active');
        } else if (filter.status) {
            filtered = filtered.filter(l => l.status === filter.status);
        }

        if (!filter) return filtered;

        if (filter.minPrice) filtered = filtered.filter(l => l.price >= filter.minPrice!);
        if (filter.maxPrice) filtered = filtered.filter(l => l.price <= filter.maxPrice!);
        if (filter.city) {
            const q = filter.city.toLowerCase();
            filtered = filtered.filter(l =>
                l.location.city.toLowerCase().includes(q) ||
                l.location.district.toLowerCase().includes(q)
            );
        }
        if (filter.district) {
            const q = filter.district.toLowerCase();
            filtered = filtered.filter(l => l.location.district.toLowerCase().includes(q));
        }
        if (filter.neighborhood) {
            const q = filter.neighborhood.toLowerCase();
            filtered = filtered.filter(l => l.location.neighborhood?.toLowerCase().includes(q));
        }
        if (filter.street) {
            const q = filter.street.toLowerCase();
            filtered = filtered.filter(l => l.location.street?.toLowerCase().includes(q));
        }
        if (filter.query) {
            const q = filter.query.toLowerCase().trim();
            filtered = filtered.filter(l =>
                l.title.toLowerCase().includes(q) ||
                l.description.toLowerCase().includes(q) ||
                l.id.toLowerCase() === q ||
                l.seller.name.toLowerCase().includes(q) ||
                l.seller.storeName?.toLowerCase().includes(q)
            );
        }
        if (filter.listingId) {
            const lid = filter.listingId.trim();
            filtered = filtered.filter(l => l.id === lid);
        }
        if (filter.sellerName) {
            const sn = filter.sellerName.toLowerCase().trim();
            filtered = filtered.filter(l =>
                l.seller.name.toLowerCase().includes(sn) ||
                l.seller.storeName?.toLowerCase().includes(sn)
            );
        }
        if (filter.minArea) filtered = filtered.filter(l => (l.netArea || 0) >= filter.minArea!);
        if (filter.maxArea) filtered = filtered.filter(l => (l.netArea || 0) <= filter.maxArea!);
        if (filter.roomCount && filter.roomCount.length > 0) {
            filtered = filtered.filter(l => l.roomCount && filter.roomCount!.includes(l.roomCount));
        }
        if (filter.category) {
            filtered = filtered.filter(l => l.category.id === filter.category || l.category.parentId === filter.category);
        }
        if (filter.listingType) {
            filtered = filtered.filter(l => l.listingType === filter.listingType);
        }
        if (filter.heating) {
            filtered = filtered.filter(l => l.heating?.toLowerCase().includes(filter.heating!.toLowerCase()));
        }
        if (filter.fuel) {
            filtered = filtered.filter(l => l.attributes['Yakıt']?.toString().toLowerCase().includes(filter.fuel!.toLowerCase()));
        }
        if (filter.gear) {
            filtered = filtered.filter(l => l.attributes['Vites']?.toString().toLowerCase().includes(filter.gear!.toLowerCase()));
        }
        if (filter.year) {
            const minYear = parseInt(filter.year);
            filtered = filtered.filter(l => {
                const y = Number(l.attributes['Yıl']);
                return !isNaN(y) && y >= minYear;
            });
        }
        if (filter.brand) {
            filtered = filtered.filter(l => l.attributes['Marka']?.toString().toLowerCase() === filter.brand!.toLowerCase());
        }
        if (filter.condition) {
            filtered = filtered.filter(l => l.attributes['Durum']?.toString().toLowerCase() === filter.condition!.toLowerCase());
        }
        if (filter.sort === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (filter.sort === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else {
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return filtered;
    }

    async getAll(filter?: FilterState): Promise<Listing[]> {
        return this.applyFilters(filter);
    }

    async getPaginated(filter?: FilterState): Promise<PaginatedResult<Listing>> {
        const filtered = this.applyFilters(filter);
        const page = Math.max(1, filter?.page ?? 1);
        const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, filter?.limit ?? DEFAULT_PAGE_SIZE));
        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const start = (page - 1) * limit;
        const items = filtered.slice(start, start + limit);

        return { items, total, page, limit, totalPages };
    }

    async getFeatured(): Promise<Listing[]> {
        return this.data.filter(l => l.featured && l.status === 'active');
    }

    async getById(id: string): Promise<Listing | null> {
        return this.data.find(l => l.id === id) || null;
    }

    async getByUserId(userId: string): Promise<Listing[]> {
        return this.data.filter(l => l.seller.id === userId);
    }

    async create(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
        const newListing: Listing = {
            ...listing,
            id: `${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.data.push(newListing);
        return newListing;
    }

    async update(id: string, data: Partial<Listing>): Promise<Listing | null> {
        const idx = this.data.findIndex(l => l.id === id);
        if (idx === -1) return null;
        this.data[idx] = { ...this.data[idx], ...data, updatedAt: new Date().toISOString() };
        return this.data[idx];
    }

    async delete(id: string): Promise<boolean> {
        const idx = this.data.findIndex(l => l.id === id);
        if (idx === -1) return false;
        this.data.splice(idx, 1);
        return true;
    }

    async count(filter?: FilterState): Promise<number> {
        return (await this.getAll(filter)).length;
    }
}

class MockUserRepository implements IUserRepository {
    private data = [...USERS];
    private listingRepo: MockListingRepository;

    constructor(listingRepo: MockListingRepository) {
        this.listingRepo = listingRepo;
    }

    async getAll(): Promise<User[]> {
        return [...this.data];
    }

    async getById(id: string): Promise<User | null> {
        return this.data.find(u => u.id === id) || null;
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.data.find(u => u.email === email) || null;
    }

    async getByPhone(phone: string): Promise<User | null> {
        const normalized = normalizePhone(phone);
        return this.data.find(u => u.phone && normalizePhone(u.phone) === normalized) || null;
    }

    async create(user: Omit<User, 'id'>): Promise<User> {
        const newUser: User = {
            ...user,
            id: `u${Date.now()}`,
            role: user.role ?? 'user',
            status: user.status ?? 'active',
            joinedAt: user.joinedAt ?? new Date().toISOString(),
        };
        this.data.push(newUser);
        return newUser;
    }

    async register(input: RegisterInput): Promise<User> {
        const existing = await this.getByEmail(input.email);
        if (existing) {
            throw new Error('EMAIL_EXISTS');
        }
        const user = await this.create({
            name: input.name,
            email: input.email,
            type: input.type,
            phone: input.phone,
            storeName: input.storeName,
            verified: false,
            status: 'pending',
            role: 'user',
        });
        PASSWORDS.set(input.email.toLowerCase(), input.password);
        return user;
    }

    async registerByPhone(phone: string, name?: string): Promise<User> {
        const normalized = normalizePhone(phone);
        const existing = await this.getByPhone(normalized);
        if (existing) return existing;

        return this.create({
            name: name ?? `Kullanıcı ${normalized.slice(-4)}`,
            email: phoneToEmail(normalized),
            phone: normalized,
            type: 'individual',
            verified: true,
            status: 'active',
            role: 'user',
        });
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        const idx = this.data.findIndex(u => u.id === id);
        if (idx === -1) return null;
        this.data[idx] = { ...this.data[idx], ...data };
        return this.data[idx];
    }

    async authenticate(email: string, password: string): Promise<User | null> {
        const normalizedEmail = email.toLowerCase().trim();
        const storedPassword = PASSWORDS.get(normalizedEmail);
        if (!storedPassword || storedPassword !== password) {
            return null;
        }
        const user = this.data.find(u => u.email.toLowerCase() === normalizedEmail);
        if (!user || user.status === 'banned' || user.status === 'pending') {
            return null;
        }
        return user;
    }

    async getListingCount(userId: string): Promise<number> {
        const listings = await this.listingRepo.getByUserId(userId);
        return listings.length;
    }
}

class MockCategoryRepository implements ICategoryRepository {
    private data = [...CATEGORIES];

    async getAll(): Promise<Category[]> {
        return this.data;
    }

    async getById(id: string): Promise<Category | null> {
        return this.data.find(c => c.id === id) || null;
    }

    async getBySlug(slug: string): Promise<Category | null> {
        return this.data.find(c => c.slug === slug) || null;
    }

    async getChildren(parentId: string): Promise<Category[]> {
        return this.data.filter(c => c.parentId === parentId);
    }

    async getRoots(): Promise<Category[]> {
        return this.data.filter(c => !c.parentId);
    }
}

class MockFavoriteRepository implements IFavoriteRepository {
    private data = new Map<string, Set<string>>();

    private key(userId: string, listingId: string) {
        return `${userId}:${listingId}`;
    }

    constructor(private listingRepo: MockListingRepository) {}

    async getByUserId(userId: string): Promise<Listing[]> {
        const ids = this.data.get(userId);
        if (!ids) return [];
        const listings = await Promise.all([...ids].map((id) => this.listingRepo.getById(id)));
        return listings.filter(Boolean) as Listing[];
    }

    async isFavorite(userId: string, listingId: string): Promise<boolean> {
        return this.data.get(userId)?.has(listingId) ?? false;
    }

    async add(userId: string, listingId: string): Promise<void> {
        if (!this.data.has(userId)) this.data.set(userId, new Set());
        this.data.get(userId)!.add(listingId);
    }

    async remove(userId: string, listingId: string): Promise<void> {
        this.data.get(userId)?.delete(listingId);
    }
}

class MockMessageRepository implements IMessageRepository {
    private conversations: Array<{
        id: string;
        listingId: string;
        participantIds: string[];
        messages: Message[];
    }> = [];

    constructor(private listingRepo: MockListingRepository, private userRepo: MockUserRepository) {}

    async getConversationsForUser(userId: string): Promise<Conversation[]> {
        return this.conversations
            .filter((c) => c.participantIds.includes(userId))
            .map((c) => {
                const listing = LISTINGS.find((l) => l.id === c.listingId);
                const otherId = c.participantIds.find((id) => id !== userId) ?? userId;
                const otherUser = USERS.find((u) => u.id === otherId);
                const last = c.messages[c.messages.length - 1];
                return {
                    id: c.id,
                    listingId: c.listingId,
                    listingTitle: listing?.title ?? 'Ilan',
                    otherUserName: otherUser?.name ?? 'Kullanici',
                    lastMessage: last?.body,
                    lastMessageAt: last?.createdAt,
                    unread: c.messages.some((m) => m.senderId !== userId && !m.readAt),
                };
            });
    }

    async getMessages(conversationId: string, userId: string): Promise<Message[]> {
        const conv = this.conversations.find((c) => c.id === conversationId && c.participantIds.includes(userId));
        if (!conv) return [];
        conv.messages.forEach((m) => {
            if (m.senderId !== userId) m.readAt = new Date().toISOString();
        });
        return conv.messages;
    }

    async sendMessage(conversationId: string, senderId: string, body: string): Promise<Message> {
        const conv = this.conversations.find((c) => c.id === conversationId && c.participantIds.includes(senderId));
        if (!conv) throw new Error('FORBIDDEN');
        const sender = await this.userRepo.getById(senderId);
        const message: Message = {
            id: `m${Date.now()}`,
            conversationId,
            senderId,
            senderName: sender?.name ?? 'Kullanici',
            body,
            createdAt: new Date().toISOString(),
        };
        conv.messages.push(message);
        return message;
    }

    async startConversation(listingId: string, buyerId: string, body: string): Promise<Conversation> {
        const listing = await this.listingRepo.getById(listingId);
        if (!listing) throw new Error('LISTING_NOT_FOUND');
        if (listing.seller.id === buyerId) throw new Error('SELF_MESSAGE');

        let conv = this.conversations.find(
            (c) => c.listingId === listingId && c.participantIds.includes(buyerId) && c.participantIds.includes(listing.seller.id)
        );

        if (!conv) {
            conv = {
                id: `c${Date.now()}`,
                listingId,
                participantIds: [buyerId, listing.seller.id],
                messages: [],
            };
            this.conversations.push(conv);
        }

        await this.sendMessage(conv.id, buyerId, body);
        const conversations = await this.getConversationsForUser(buyerId);
        return conversations.find((c) => c.id === conv!.id)!;
    }
}

// ============================================================
// Database Singleton
// When ready for a real DB, replace these with PrismaXxxRepository
// ============================================================

const listingRepository = new MockListingRepository();
const userRepository = new MockUserRepository(listingRepository);

export const db: IDatabase = {
    listings: listingRepository,
    users: userRepository,
    categories: new MockCategoryRepository(),
    favorites: new MockFavoriteRepository(listingRepository),
    messages: new MockMessageRepository(listingRepository, userRepository),
};

// ============================================================
// Backward Compatibility — Exported helpers used by existing pages
// ============================================================

export { CATEGORIES, LISTINGS, USERS };

export const getFeaturedListings = () => db.listings.getFeatured();
export const getListings = (filter?: FilterState) => db.listings.getAll(filter);
export const getPaginatedListings = (filter?: FilterState) => db.listings.getPaginated(filter);
export const getListingById = (id: string) => db.listings.getById(id);
export const getAllUsers = () => db.users.getAll();
