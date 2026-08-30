'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

type StayMapProps = {
  latitude: number | string;
  longitude: number | string;
  name: string;
  city: string;
};

const StayMapClient = dynamic(
  () => import('./stay-map-client'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-sm text-gray-500">
        Loading map...
      </div>
    ),
  },
) as ComponentType<StayMapProps>;

export default function StayMap(props: StayMapProps) {
  const latitude = Number(props.latitude);
  const longitude = Number(props.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-500">
        Location unavailable
      </div>
    );
  }

  return <StayMapClient {...props} />;
}
