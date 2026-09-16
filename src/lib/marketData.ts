export const MARKET_INDEX = [
  { city: 'İstanbul', sale: 98500, rent: 420, change: 2.4, slug: 'Istanbul' },
  { city: 'Ankara', sale: 54200, rent: 265, change: 1.1, slug: 'Ankara' },
  { city: 'İzmir', sale: 67800, rent: 310, change: 1.8, slug: 'Izmir' },
  { city: 'Bursa', sale: 42100, rent: 198, change: 0.6, slug: 'Bursa' },
  { city: 'Antalya', sale: 61400, rent: 355, change: 3.2, slug: 'Antalya' },
  { city: 'Muğla', sale: 89200, rent: 480, change: 2.9, slug: 'Mugla' },
] as const;

export const NEIGHBORHOOD_GUIDES = [
  {
    name: 'Kadıköy',
    city: 'İstanbul',
    score: 9.4,
    blurb: 'Sahil, kültür ve yatırımın kesiştiği canlı merkez.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe8a2bc3?q=80&w=1200&auto=format&fit=crop',
    saleAvg: 128000,
  },
  {
    name: 'Çankaya',
    city: 'Ankara',
    score: 9.1,
    blurb: 'Merkezi konum, güçlü ulaşım ve yüksek kira talebi.',
    image: 'https://images.unsplash.com/photo-1544986581-efac924a3320?q=80&w=1200&auto=format&fit=crop',
    saleAvg: 64000,
  },
  {
    name: 'Karşıyaka',
    city: 'İzmir',
    score: 8.9,
    blurb: 'Deniz manzarası ve aile yaşamı için dengeli bir semt.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69de5f0?q=80&w=1200&auto=format&fit=crop',
    saleAvg: 72000,
  },
  {
    name: 'Konyaaltı',
    city: 'Antalya',
    score: 8.7,
    blurb: 'Yazlık ve uzun dönem kiralıkta güçlü getiri.',
    image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=1200&auto=format&fit=crop',
    saleAvg: 69500,
  },
] as const;

export const NEW_PROJECTS = [
  {
    name: 'Mavi Körfez Residence',
    city: 'İstanbul',
    district: 'Maltepe',
    units: '2+1 · 3+1',
    priceFrom: 12500000,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1400&auto=format&fit=crop',
    status: 'Satışta',
  },
  {
    name: 'Skonutal Cadde',
    city: 'Ankara',
    district: 'Çankaya',
    units: '1+1 · 2+1',
    priceFrom: 6800000,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop',
    status: 'Ön satış',
  },
  {
    name: 'Ege Terra Villaları',
    city: 'İzmir',
    district: 'Urla',
    units: '4+1 · Villa',
    priceFrom: 24800000,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1400&auto=format&fit=crop',
    status: 'Sınırlı stok',
  },
] as const;

export const PROPERTY_TYPES = [
  { name: 'Konut', slug: 'konut', hint: 'Daire, villa, residence', emoji: '🏠' },
  { name: 'İş Yeri', slug: 'isyeri', hint: 'Ofis, dükkan, plaza', emoji: '🏢' },
  { name: 'Arsa', slug: 'arsa', hint: 'İmarlı, tarla, ticari', emoji: '🌿' },
  { name: 'Yazlık', slug: 'apart-yazlik', hint: 'Sahil ve sayfiye', emoji: '☀️' },
  { name: 'Devremülk', slug: 'devremulk', hint: 'Tatil yatırımı', emoji: '🛎️' },
  { name: 'Turizm', slug: 'turizm', hint: 'Otel ve apart', emoji: '✈️' },
] as const;

export const EXPERT_INSIGHTS = [
  {
    title: '2026 konut endeksi: büyükşehirlerde m² fiyatı ne söylüyor?',
    tag: 'Piyasa',
    read: '6 dk',
    href: '/blog',
  },
  {
    title: 'Kiralık ev ararken kaçınmanız gereken 7 madde',
    tag: 'Rehber',
    read: '4 dk',
    href: '/blog',
  },
  {
    title: 'Yeni proje mi, ikinci el mi? Yatırımcı için net karşılaştırma',
    tag: 'Yatırım',
    read: '8 dk',
    href: '/blog',
  },
] as const;
