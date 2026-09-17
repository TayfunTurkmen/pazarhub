'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  ChevronDown, ChevronUp, MapPin, Tag, Home, Ruler, Flame, Building,
  Car, Gauge, Calendar, Smartphone, ShieldCheck, Briefcase, Wrench, UserRound,
} from 'lucide-react';
import LocationCascade from '@/components/listing/LocationCascade';
import { CATEGORIES } from '@/services/mockData';
import { resolveFilterConfig } from '@/lib/categoryTree';

const FLOOR_OPTIONS = ['0', '1-3', '4-7', '8-12', '13+'];
const HEATING_OPTIONS = ['Kombi', 'Merkezi', 'Yerden Isıtma', 'Doğalgaz'];
const FUEL_OPTIONS = ['Benzin', 'Dizel', 'Elektrik', 'Hibrit', 'LPG'];
const GEAR_OPTIONS = ['Otomatik', 'Manuel'];
const YEAR_OPTIONS = ['2024', '2023', '2022', '2021', '2020', '2019'];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations('Filters');

  const pathSlug = useMemo(() => {
    const parts = pathname.split('/');
    const catIndex = parts.indexOf('category');
    if (catIndex !== -1 && parts[catIndex + 1]) return parts[catIndex + 1];
    return null;
  }, [pathname]);

  const queryCategory = searchParams.get('category');
  const config = resolveFilterConfig(CATEGORIES, pathSlug, queryCategory);

  const [filters, setFilters] = useState({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    city: searchParams.get('city') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    roomCount: searchParams.getAll('roomCount') || [],
    floor: searchParams.getAll('floor') || [],
    listingType: searchParams.get('listingType') || '',
    heating: searchParams.get('heating') || '',
    fuel: searchParams.get('fuel') || '',
    gear: searchParams.get('gear') || '',
    year: searchParams.get('year') || '',
    brand: searchParams.get('brand') || '',
    district: searchParams.get('district') || '',
    neighborhood: searchParams.get('neighborhood') || '',
    street: searchParams.get('street') || '',
    condition: searchParams.get('condition') || '',
    sellerType: searchParams.get('sellerType') || '',
  });

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    type: false,
    seller: false,
    location: false,
    price: false,
    spec: false,
    rooms: false,
    heating: true,
    floor: true,
    vehicle: false,
    electronics: false,
    condition: false,
    job: false,
    services: false,
  });

  const toggle = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'city') {
        next.district = '';
        next.neighborhood = '';
        next.street = '';
      } else if (key === 'district') {
        next.neighborhood = '';
        next.street = '';
      } else if (key === 'neighborhood') {
        next.street = '';
      }
      return next;
    });
  };

  const preserveParams = (params: URLSearchParams) => {
    for (const key of ['sort', 'query', 'view', 'category', 'tier', 'listingId', 'sellerName']) {
      const value = searchParams.get(key);
      if (value) params.set(key, value);
    }
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    preserveParams(params);
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value as string);
      }
    });
    router.replace(`?${params.toString()}`);
  };

  const handleClear = () => {
    setFilters({
      minPrice: '', maxPrice: '', city: '', district: '', neighborhood: '', street: '',
      minArea: '', maxArea: '', roomCount: [], floor: [], listingType: '', heating: '',
      fuel: '', gear: '', year: '', brand: '', condition: '', sellerType: '',
    });
    const params = new URLSearchParams();
    preserveParams(params);
    router.replace(`?${params.toString()}`);
  };

  const Section = ({
    id, title, icon: Icon, children,
  }: {
    id: string;
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-[var(--color-border)] py-4 last:border-0">
      <button
        type="button"
        onClick={() => toggle(id)}
        className="flex items-center justify-between w-full text-left font-semibold text-[var(--color-foreground)] hover:text-[var(--color-primary)] mb-2 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-[var(--color-primary)]" />}
          <span className="text-sm">{title}</span>
        </div>
        {collapsed[id] ? <ChevronDown size={14} className="text-[var(--color-muted)]" /> : <ChevronUp size={14} className="text-[var(--color-muted)]" />}
      </button>
      {!collapsed[id] && <div className="pt-2">{children}</div>}
    </div>
  );

  const ToggleButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 text-xs font-medium border rounded-xl transition-all ${active
        ? 'bg-[var(--color-navy)] text-[var(--color-brand-yellow)] border-[var(--color-navy)] shadow-sm'
        : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-brand-yellow)]/50 hover:text-[var(--color-brand-yellow)]'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden md:sticky md:top-28 shadow-sm">
      <div className="bg-[var(--color-surface-elevated)] p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 className="font-bold text-[var(--color-foreground)]">{t('filter')}</h3>
        <button type="button" onClick={handleClear} className="text-xs text-[var(--color-muted)] hover:text-rose-500 font-medium transition-colors">
          {t('clear')}
        </button>
      </div>

      <div className="p-4 max-h-[60vh] md:max-h-[calc(100vh-9rem)] overflow-y-auto">
        {config.showListingType && (
          <Section id="type" title={t('listing_type')} icon={Tag}>
            <div className="grid grid-cols-3 gap-2">
              <ToggleButton label={t('all')} active={filters.listingType === ''} onClick={() => handleChange('listingType', '')} />
              <ToggleButton label={t('sale')} active={filters.listingType === 'sale'} onClick={() => handleChange('listingType', 'sale')} />
              <ToggleButton label={t('rent')} active={filters.listingType === 'rent'} onClick={() => handleChange('listingType', 'rent')} />
            </div>
          </Section>
        )}

        <Section id="seller" title={t('seller_type')} icon={UserRound}>
          <div className="grid grid-cols-3 gap-2">
            <ToggleButton label={t('all')} active={filters.sellerType === ''} onClick={() => handleChange('sellerType', '')} />
            <ToggleButton label={t('from_owner')} active={filters.sellerType === 'individual'} onClick={() => handleChange('sellerType', 'individual')} />
            <ToggleButton label={t('from_agency')} active={filters.sellerType === 'corporate'} onClick={() => handleChange('sellerType', 'corporate')} />
          </div>
        </Section>

        <Section id="location" title={t('location')} icon={MapPin}>
          <LocationCascade
            value={{
              city: filters.city,
              district: filters.district,
              neighborhood: filters.neighborhood,
              street: filters.street,
            }}
            onChange={(next) => {
              setFilters((prev) => ({
                ...prev,
                city: next.city,
                district: next.district,
                neighborhood: next.neighborhood,
                street: next.street || '',
              }));
            }}
          />
        </Section>

        <Section id="price" title={t('price_tl')} icon={Tag}>
          <div className="flex gap-2 items-center">
            <Input placeholder={t('min')} type="number" value={filters.minPrice} onChange={(e) => handleChange('minPrice', e.target.value)} className="text-sm" />
            <span className="text-[var(--color-muted)] text-sm">-</span>
            <Input placeholder={t('max')} type="number" value={filters.maxPrice} onChange={(e) => handleChange('maxPrice', e.target.value)} className="text-sm" />
          </div>
        </Section>

        {config.showArea && (
          <Section id="spec" title={t('area_m2')} icon={Ruler}>
            <div className="flex gap-2 items-center">
              <Input placeholder={`${t('min')} m²`} type="number" value={filters.minArea} onChange={(e) => handleChange('minArea', e.target.value)} className="text-sm" />
              <span className="text-[var(--color-muted)] text-sm">-</span>
              <Input placeholder={`${t('max')} m²`} type="number" value={filters.maxArea} onChange={(e) => handleChange('maxArea', e.target.value)} className="text-sm" />
            </div>
          </Section>
        )}

        {config.showRoomCount && (
          <Section id="rooms" title={t('room_count')} icon={Home}>
            <div className="grid grid-cols-3 gap-2">
              {['1+0', '1+1', '2+1', '3+1', '4+1', '5+'].map((room) => (
                <ToggleButton
                  key={room}
                  label={room}
                  active={(filters.roomCount as string[]).includes(room)}
                  onClick={() => {
                    const current = filters.roomCount as string[];
                    const next = current.includes(room) ? current.filter((r) => r !== room) : [...current, room];
                    setFilters((prev) => ({ ...prev, roomCount: next }));
                  }}
                />
              ))}
            </div>
          </Section>
        )}

        {config.showFloor && (
          <Section id="floor" title={t('floor')} icon={Building}>
            <div className="grid grid-cols-3 gap-2">
              {FLOOR_OPTIONS.map((floor) => (
                <ToggleButton
                  key={floor}
                  label={floor === '0' ? 'Giriş' : `Kat ${floor}`}
                  active={(filters.floor as string[]).includes(floor)}
                  onClick={() => {
                    const current = filters.floor as string[];
                    const next = current.includes(floor) ? current.filter((f) => f !== floor) : [...current, floor];
                    setFilters((prev) => ({ ...prev, floor: next }));
                  }}
                />
              ))}
            </div>
          </Section>
        )}

        {config.showHeating && (
          <Section id="heating" title={t('heating')} icon={Flame}>
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton label={t('all')} active={filters.heating === ''} onClick={() => handleChange('heating', '')} />
              {HEATING_OPTIONS.map((heating) => (
                <ToggleButton
                  key={heating}
                  label={heating}
                  active={filters.heating === heating}
                  onClick={() => handleChange('heating', heating)}
                />
              ))}
            </div>
          </Section>
        )}

        {config.showVehicle && (
          <>
            <Section id="vehicle_fuel" title={t('fuel')} icon={Gauge}>
              <div className="grid grid-cols-2 gap-2">
                <ToggleButton label={t('all')} active={filters.fuel === ''} onClick={() => handleChange('fuel', '')} />
                {FUEL_OPTIONS.map((fuel) => (
                  <ToggleButton key={fuel} label={fuel} active={filters.fuel === fuel} onClick={() => handleChange('fuel', fuel)} />
                ))}
              </div>
            </Section>
            <Section id="vehicle_gear" title={t('gear')} icon={Car}>
              <div className="grid grid-cols-2 gap-2">
                <ToggleButton label={t('all')} active={filters.gear === ''} onClick={() => handleChange('gear', '')} />
                {GEAR_OPTIONS.map((gear) => (
                  <ToggleButton key={gear} label={gear} active={filters.gear === gear} onClick={() => handleChange('gear', gear)} />
                ))}
              </div>
            </Section>
            <Section id="vehicle_year" title={t('year')} icon={Calendar}>
              <select
                value={filters.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className="w-full border border-[var(--color-border)] rounded-xl p-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
              >
                <option value="">{t('all_years')}</option>
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>{year}+</option>
                ))}
              </select>
            </Section>
          </>
        )}

        {config.showElectronics && (
          <Section id="elec_brand" title={t('brand')} icon={Smartphone}>
            <select
              value={filters.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-xl p-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            >
              <option value="">{t('all_brands')}</option>
              {['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Sony', 'LG', 'Asus', 'Bellona'].map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </Section>
        )}

        {config.showCondition && (
          <Section id="condition" title={t('condition')} icon={ShieldCheck}>
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton label={t('all')} active={filters.condition === ''} onClick={() => handleChange('condition', '')} />
              <ToggleButton label={t('condition_new')} active={filters.condition === 'Sıfır'} onClick={() => handleChange('condition', 'Sıfır')} />
              <ToggleButton label={t('condition_used')} active={filters.condition === 'İkinci El'} onClick={() => handleChange('condition', 'İkinci El')} />
            </div>
          </Section>
        )}

        {config.showJob && (
          <Section id="job" title={t('job_type')} icon={Briefcase}>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">{t('job_hint')}</p>
          </Section>
        )}

        {config.showServices && (
          <Section id="services" title={t('service_area')} icon={Wrench}>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">{t('service_hint')}</p>
          </Section>
        )}

        <div className="pt-4">
          <Button onClick={handleApply} className="w-full shadow-md py-3 font-bold">
            {t('show_results')}
          </Button>
        </div>
      </div>
    </div>
  );
}
