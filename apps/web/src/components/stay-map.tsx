'use client';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

type StayMapProps = {
  latitude: number | string;
  longitude: number | string;
  name: string;
  city: string;
};

const stayIcon = L.divIcon({
  className: '',
  html: `
    <div
      style="
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        background: #111827;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "
    ></div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function StayMap({
  latitude,
  longitude,
  name,
  city,
}: StayMapProps) {
  const position: [number, number] = [
    Number(latitude),
    Number(longitude),
  ];

  if (
    !Number.isFinite(position[0]) ||
    !Number.isFinite(position[1])
  ) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-500">
        Location unavailable
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="h-80 w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={stayIcon}>
          <Popup>
            <strong>{name}</strong>
            <br />
            {city}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
