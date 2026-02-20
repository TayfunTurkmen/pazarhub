import { Listing, Category, User, FilterState } from '@/types';
import { IListingRepository, IUserRepository, ICategoryRepository, IDatabase } from './repository';

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
    { id: 'u1', name: 'Ahmet Yılmaz', email: 'demo@example.com', type: 'individual', role: 'user', phone: '05551234567', avatar: 'https://i.pravatar.cc/150?u=u1', verified: true },
    { id: 'u2', name: 'Emlak Plus', email: 'info@emlakplus.com', type: 'corporate', role: 'user', storeName: 'Emlak Plus Gayrimenkul', phone: '02121234567', avatar: 'https://i.pravatar.cc/150?u=u2', verified: true },
    { id: 'u3', name: 'Galeri 34', email: 'galeri@example.com', type: 'corporate', role: 'user', storeName: 'Galeri 34 Otomotiv', phone: '02161234567', avatar: 'https://i.pravatar.cc/150?u=u3', verified: true },
    { id: 'u4', name: 'Zeynep Kaya', email: 'zeynep@example.com', type: 'individual', role: 'user', phone: '05329876543', avatar: 'https://i.pravatar.cc/150?u=u4', verified: true },
    { id: 'u5', name: 'Admin Yönetici', email: 'admin@example.com', type: 'individual', role: 'admin', phone: '05001234567', avatar: 'https://i.pravatar.cc/150?u=u5', verified: true },
];

const LISTINGS: Listing[] = [
    {
        id: '1001',
        title: 'Kadıköy Merkezde Yenilenmiş 3+1 Daire',
        description: 'Bütün tesisat yenilendi, metroya yürüme mesafesinde. Hemen taşınmaya uygun. Krediye uygun. AİDAT: 850 TL. Apartman yeni boyandı, asansör mevcut.',
        price: 5250000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '11')!,
        location: { city: 'İstanbul', district: 'Kadıköy', neighborhood: 'Caferağa' },
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
        location: { city: 'İstanbul', district: 'Beşiktaş', neighborhood: 'Levent' },
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
        location: { city: 'Ankara', district: 'Çankaya', neighborhood: 'Oran' },
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
        location: { city: 'İzmir', district: 'Konak', neighborhood: 'Alsancak' },
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
        location: { city: 'Antalya', district: 'Konyaaltı', neighborhood: 'Liman' },
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Bina Yaşı': 0, 'Kat Sayısı': 12, 'Banyo Sayısı': 2, 'Balkon': 'Var', 'Asansör': 'Var', 'Otopark': 'Kapalı' },
        roomCount: '3+1', netArea: 140, floor: 7, heating: 'Merkezi (Pay Ölçer)', listingType: 'sale', tier: 'standard',
        seller: USERS[1], createdAt: '2025-11-10T09:00:00Z', updatedAt: '2025-11-10T09:00:00Z', status: 'active', featured: false,
    },
    {
        id: '1006',
        title: 'Bursa Nilüfer Satılık Bahçeli Müstakil',
        description: 'Doğa ile iç içe, 350m² bahçe, 2 katlı müstakil ev. Garaj, kış bahçesi, şömine mevcut. Aileler için ideal.',
        price: 7200000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '11')!,
        location: { city: 'Bursa', district: 'Nilüfer', neighborhood: 'Görükle' },
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
        location: { city: 'Ankara', district: 'Çankaya' },
        images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Yıl': 2024, 'Km': 8000, 'Renk': 'Beyaz', 'Vites': 'Otomatik', 'Yakıt': 'Benzin', 'Motor': '2.0L Turbo' }, listingType: 'sale', tier: 'standard',
        seller: USERS[2], createdAt: '2025-12-10T11:00:00Z', updatedAt: '2025-12-10T11:00:00Z', status: 'active', featured: false,
    },
    {
        id: '1008',
        title: 'Acil Satılık iPhone 15 Pro Max 256GB',
        description: 'Kutulu faturalı, Apple TR garantili. Pil sağlığı %98. Kılıf ve cam hediye.',
        price: 62000, currency: 'TL',
        category: CATEGORIES[2],
        location: { city: 'İzmir', district: 'Karşıyaka' },
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
        location: { city: 'Eskişehir', district: 'Tepebaşı', neighborhood: 'Batıkent' },
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Bina Yaşı': 5, 'Depozito': '1 Ay', 'Eşya': 'Eşyalı', 'Aidat': 'Dahil' },
        roomCount: '2+1', netArea: 85, floor: 2, heating: 'Doğalgaz (Kombi)', listingType: 'rent', tier: 'standard',
        seller: USERS[3], createdAt: '2025-12-08T10:00:00Z', updatedAt: '2025-12-08T10:00:00Z', status: 'active', featured: false,
    },
    {
        id: '1010',
        title: 'Trabzon Ortahisar Sıfır Proje 1+1',
        description: 'Boztepe manzaralı, site içi, havuz, otopark dahil. Yabancıya uygun tapulu. Yatırım fırsatı.',
        price: 2100000, currency: 'TL',
        category: CATEGORIES.find(c => c.id === '11')!,
        location: { city: 'Trabzon', district: 'Ortahisar', neighborhood: 'Boztepe' },
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
        location: { city: 'İstanbul', district: 'Ataşehir' },
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
        location: { city: 'Ankara', district: 'Yenimahalle' },
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Marka': 'Apple', 'Model': 'MacBook Pro 14"', 'İşlemci': 'M3 Pro', 'RAM': '18 GB', 'SSD': '512 GB' }, listingType: 'sale', tier: 'standard',
        seller: USERS[3], createdAt: '2025-12-13T17:00:00Z', updatedAt: '2025-12-13T17:00:00Z', status: 'active', featured: false,
    },
    // ── Vasıta - Otomobil ──
    {
        id: '1013', title: 'Volkswagen Golf 8 1.5 TSI 2023', description: 'Hatasız, boyasız, 15.000 km. Dijital kokpit, CarPlay, LED farlar.',
        price: 1650000, currency: 'TL', category: CATEGORIES.find(c => c.id === '21')!,
        location: { city: 'İstanbul', district: 'Ümraniye' },
        images: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Yıl': 2023, 'Km': 15000, 'Renk': 'Gri', 'Vites': 'Otomatik', 'Yakıt': 'Benzin' }, listingType: 'sale', tier: 'showcase',
        seller: USERS[2], createdAt: '2025-12-16T10:00:00Z', updatedAt: '2025-12-16T10:00:00Z', status: 'active', featured: true,
    },
    // ── Vasıta - Motosiklet ──
    {
        id: '1014', title: 'Honda CBR 650R 2024 Sıfır Ayarında', description: 'Sadece 1.200 km, ilk sahibinden. Tüm bakımları yapılmış.',
        price: 420000, currency: 'TL', category: CATEGORIES.find(c => c.id === '23')!,
        location: { city: 'Ankara', district: 'Çankaya' },
        images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Yıl': 2024, 'Km': 1200, 'Motor': '650cc', 'Tip': 'Sport' }, listingType: 'sale', tier: 'standard',
        seller: USERS[0], createdAt: '2025-12-15T14:00:00Z', updatedAt: '2025-12-15T14:00:00Z', status: 'active', featured: false,
    },
    // ── Alışveriş - Telefon ──
    {
        id: '1015', title: 'Samsung Galaxy S24 Ultra 512GB', description: 'Garantili, kutulu, tüm aksesuarlar mevcut. S-Pen dahil.',
        price: 55000, currency: 'TL', category: CATEGORIES.find(c => c.id === '32')!,
        location: { city: 'İstanbul', district: 'Şişli' },
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Marka': 'Samsung', 'Model': 'Galaxy S24 Ultra', 'Hafıza': '512 GB', 'Renk': 'Titanium Gray' }, listingType: 'sale', tier: 'premium',
        seller: USERS[3], createdAt: '2025-12-14T11:00:00Z', updatedAt: '2025-12-14T11:00:00Z', status: 'active', featured: true,
    },
    // ── Alışveriş - Ev Eşyaları ──
    {
        id: '1016', title: 'L Koltuk Takımı - Krem Kadife', description: '8 ay kullanılmış, leke yok, çok temiz. Pet-friendly kumaş.',
        price: 18000, currency: 'TL', category: CATEGORIES.find(c => c.id === '33')!,
        location: { city: 'İzmir', district: 'Bornova' },
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Durum': 'Az kullanılmış', 'Renk': 'Krem', 'Marka': 'Bellona' }, listingType: 'sale', tier: 'standard',
        seller: USERS[0], createdAt: '2025-12-10T09:00:00Z', updatedAt: '2025-12-10T09:00:00Z', status: 'active', featured: false,
    },
    // ── Turizm - Apart ──
    {
        id: '1017', title: 'Fethiye Ölüdeniz Havuzlu Villa - Haftalık', description: 'Özel havuzlu, 4 yatak odalı, denize 5 dk. WiFi, klima, otopark dahil.',
        price: 25000, currency: 'TL', category: CATEGORIES.find(c => c.id === '42')!,
        location: { city: 'Muğla', district: 'Fethiye', neighborhood: 'Ölüdeniz' },
        images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Tip': 'Villa', 'Kapasite': '8 Kişi', 'Havuz': 'Özel', 'Süre': 'Haftalık' }, listingType: 'rent', tier: 'showcase',
        seller: USERS[1], createdAt: '2025-12-17T08:00:00Z', updatedAt: '2025-12-17T08:00:00Z', status: 'active', featured: true,
    },
    // ── Turizm - Otel ──
    {
        id: '1018', title: 'Kapadokya Taş Konak Butik Otel - 2 Gece', description: 'Balon manzaralı oda, açık büfe kahvaltı dahil. Çiftlere özel paket.',
        price: 8500, currency: 'TL', category: CATEGORIES.find(c => c.id === '41')!,
        location: { city: 'Nevşehir', district: 'Göreme' },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Tip': 'Butik Otel', 'Süre': '2 Gece', 'Kahvaltı': 'Dahil' }, listingType: 'rent', tier: 'premium',
        seller: USERS[1], createdAt: '2025-12-16T12:00:00Z', updatedAt: '2025-12-16T12:00:00Z', status: 'active', featured: true,
    },
    // ── Yardımcı Hizmetler - Nakliyat ──
    {
        id: '1019', title: 'İstanbul Şehir İçi Evden Eve Nakliyat', description: 'Sigortalı, asansörlü, profesyonel ekip. Paketleme hizmeti dahil.',
        price: 7500, currency: 'TL', category: CATEGORIES.find(c => c.id === '51')!,
        location: { city: 'İstanbul', district: 'Kartal' },
        images: ['https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Hizmet': 'Evden Eve', 'Sigorta': 'Var', 'Asansör': 'Var' }, listingType: 'sale', tier: 'standard',
        seller: USERS[2], createdAt: '2025-12-11T10:00:00Z', updatedAt: '2025-12-11T10:00:00Z', status: 'active', featured: false,
    },
    // ── Yardımcı Hizmetler - Özel Ders ──
    {
        id: '1020', title: 'Matematik Özel Ders - Üniversite Hazırlık', description: 'Boğaziçi mezunu, 10 yıl deneyimli öğretmen. Online/yüz yüze.',
        price: 800, currency: 'TL', category: CATEGORIES.find(c => c.id === '55')!,
        location: { city: 'İstanbul', district: 'Kadıköy' },
        images: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Ders': 'Matematik', 'Seviye': 'Üniversite Hazırlık', 'Format': 'Online/Yüz yüze' }, listingType: 'sale', tier: 'standard',
        seller: USERS[3], createdAt: '2025-12-09T14:00:00Z', updatedAt: '2025-12-09T14:00:00Z', status: 'active', featured: false,
    },
    // ── Sahiplendirme - Köpek ──
    {
        id: '1021', title: 'Golden Retriever Yavrusu Sahiplendirilecek - Ücretsiz', description: 'Yüksek soylu, sağlık kontrolü yapılmış, aşıları tam. İyi bir yuva arıyor. Anne baba görülebilir. SATIŞ DEĞİL, sahiplendirme.',
        price: 0, currency: 'TL', category: CATEGORIES.find(c => c.id === '61')!,
        location: { city: 'Ankara', district: 'Etimesgut' },
        images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Irk': 'Golden Retriever', 'Yaş': '2 Ay', 'Aşı': 'Tam', 'Cinsiyet': 'Erkek', 'Durum': 'Sahiplendirilecek' }, listingType: 'sale', tier: 'premium',
        seller: USERS[0], createdAt: '2025-12-18T09:00:00Z', updatedAt: '2025-12-18T09:00:00Z', status: 'active', featured: true,
    },
    // ── Sahiplendirme - Kedi ──
    {
        id: '1022', title: 'British Shorthair Yavru Sahiplendirilecek - Ücretsiz', description: 'Ev ortamında büyümüş, tuvalet eğitimi verilmiş, çok uysal. İyi bir aile arıyor. SATIŞ DEĞİL, ücretsiz sahiplendirme.',
        price: 0, currency: 'TL', category: CATEGORIES.find(c => c.id === '62')!,
        location: { city: 'İstanbul', district: 'Beşiktaş' },
        images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Irk': 'British Shorthair', 'Yaş': '3 Ay', 'Renk': 'Lilac', 'Cinsiyet': 'Dişi', 'Durum': 'Sahiplendirilecek' }, listingType: 'sale', tier: 'standard',
        seller: USERS[3], createdAt: '2025-12-17T16:00:00Z', updatedAt: '2025-12-17T16:00:00Z', status: 'active', featured: false,
    },
    // ── İş İlanları - Tam Zamanlı ──
    {
        id: '1023', title: 'Senior Frontend Developer - Remote', description: 'React/Next.js deneyimli. Yıllık 600K-900K TL arası. Full remote.',
        price: 0, currency: 'TL', category: CATEGORIES.find(c => c.id === '71')!,
        location: { city: 'İstanbul', district: 'Şişli' },
        images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop'],
        attributes: { 'Pozisyon': 'Frontend Developer', 'Deneyim': '5+ Yıl', 'Çalışma': 'Remote' }, listingType: 'sale', tier: 'showcase',
        seller: USERS[1], createdAt: '2025-12-19T08:00:00Z', updatedAt: '2025-12-19T08:00:00Z', status: 'active', featured: true,
    },
    // ── İş İlanları - Freelance ──
    {
        id: '1024', title: 'Grafik Tasarımcı Aranıyor - Proje Bazlı', description: 'Sosyal medya görselleri, logo tasarımı. Adobe Creative Suite bilgisi şart.',
        price: 0, currency: 'TL', category: CATEGORIES.find(c => c.id === '73')!,
        location: { city: 'Ankara', district: 'Çankaya' },
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

    async getAll(filter?: FilterState): Promise<Listing[]> {
        let filtered = [...this.data];

        if (filter) {
            if (filter.minPrice) filtered = filtered.filter(l => l.price >= filter.minPrice!);
            if (filter.maxPrice) filtered = filtered.filter(l => l.price <= filter.maxPrice!);
            if (filter.city) {
                const q = filter.city.toLowerCase();
                filtered = filtered.filter(l =>
                    l.location.city.toLowerCase().includes(q) ||
                    l.location.district.toLowerCase().includes(q)
                );
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
            // Dedicated listing ID search
            if (filter.listingId) {
                const lid = filter.listingId.trim();
                filtered = filtered.filter(l => l.id === lid);
            }
            // Dedicated seller/store name search
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
            // Sorting
            if (filter.sort === 'price_asc') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (filter.sort === 'price_desc') {
                filtered.sort((a, b) => b.price - a.price);
            } else {
                // Default: newest first
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
        }

        return filtered;
    }

    async getFeatured(): Promise<Listing[]> {
        return this.data.filter(l => l.featured);
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

    async getById(id: string): Promise<User | null> {
        return this.data.find(u => u.id === id) || null;
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.data.find(u => u.email === email) || null;
    }

    async create(user: Omit<User, 'id'>): Promise<User> {
        const newUser: User = { ...user, id: `u${Date.now()}` };
        this.data.push(newUser);
        return newUser;
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        const idx = this.data.findIndex(u => u.id === id);
        if (idx === -1) return null;
        this.data[idx] = { ...this.data[idx], ...data };
        return this.data[idx];
    }

    async authenticate(email: string, password: string): Promise<User | null> {
        // Mock credentials:
        // demo@example.com / demo  → regular user
        // admin@example.com / admin → admin user
        if (email === 'demo@example.com' && password === 'demo') {
            return this.data.find(u => u.email === email) || null;
        }
        if (email === 'admin@example.com' && password === 'admin') {
            return this.data.find(u => u.email === email) || null;
        }
        return null;
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

// ============================================================
// Database Singleton
// When ready for a real DB, replace these with PrismaXxxRepository
// ============================================================

export const db: IDatabase = {
    listings: new MockListingRepository(),
    users: new MockUserRepository(),
    categories: new MockCategoryRepository(),
};

// ============================================================
// Backward Compatibility — Exported helpers used by existing pages
// ============================================================

export { CATEGORIES, LISTINGS };

export const getFeaturedListings = () => db.listings.getFeatured();
export const getListings = (filter?: any) => db.listings.getAll(filter);
export const getListingById = (id: string) => db.listings.getById(id);
