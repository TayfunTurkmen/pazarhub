'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  loadLocationData,
  type CityData,
  type DistrictData,
  type NeighborhoodData,
} from '@/services/locationData';

export type LocationValue = {
  city: string;
  district: string;
  neighborhood: string;
  street?: string;
};

type Props = {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
  /** Show neighborhood select (default true) */
  showNeighborhood?: boolean;
  /** Compact layout for hero / inline forms */
  compact?: boolean;
  className?: string;
  selectClassName?: string;
};

const selectBase =
  'w-full border border-[var(--color-border)] rounded-xl p-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-colors';

export default function LocationCascade({
  value,
  onChange,
  showNeighborhood = true,
  compact = false,
  className = '',
  selectClassName = '',
}: Props) {
  const t = useTranslations('Filters');
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadLocationData()
      .then((data) => {
        if (!cancelled) setCities(data);
      })
      .catch(() => {
        if (!cancelled) setCities([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCity = useMemo(
    () => cities.find((c) => c.name === value.city),
    [cities, value.city],
  );
  const selectedDistrict = useMemo(
    () => selectedCity?.districts?.find((d) => d.name === value.district),
    [selectedCity, value.district],
  );

  const handleCity = (city: string) => {
    onChange({ city, district: '', neighborhood: '', street: '' });
  };
  const handleDistrict = (district: string) => {
    onChange({ ...value, district, neighborhood: '', street: '' });
  };
  const handleNeighborhood = (neighborhood: string) => {
    onChange({ ...value, neighborhood, street: '' });
  };

  const cls = `${selectBase} ${selectClassName}`.trim();

  return (
    <div className={`flex flex-col gap-2 ${compact ? 'sm:flex-row sm:flex-wrap' : ''} ${className}`.trim()}>
      <select
        value={value.city}
        onChange={(e) => handleCity(e.target.value)}
        disabled={loading}
        className={cls}
        aria-label={t('province_all')}
      >
        <option value="">{loading ? t('loading_locations') : t('province_all')}</option>
        {cities.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      {selectedCity?.districts && selectedCity.districts.length > 0 && (
        <select
          value={value.district}
          onChange={(e) => handleDistrict(e.target.value)}
          className={cls}
          aria-label={t('district_all')}
        >
          <option value="">{t('district_all')}</option>
          {selectedCity.districts.map((dist: DistrictData) => (
            <option key={dist.id} value={dist.name}>
              {dist.name}
            </option>
          ))}
        </select>
      )}

      {showNeighborhood && selectedDistrict?.neighborhoods && selectedDistrict.neighborhoods.length > 0 && (
        <select
          value={value.neighborhood}
          onChange={(e) => handleNeighborhood(e.target.value)}
          className={cls}
          aria-label={t('neighborhood_all')}
        >
          <option value="">{t('neighborhood_all')}</option>
          {selectedDistrict.neighborhoods.map((neigh: NeighborhoodData) => (
            <option key={neigh.id} value={neigh.name}>
              {neigh.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
