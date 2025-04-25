import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

interface Station {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  coverage_area: string;
  phone: string;
  operating_hours: string;
  staff_count: number;
  status: 'active' | 'inactive';
}

interface StationMapProps {
  stations: Station[];
  className?: string;
}

// Custom icon for station markers
const stationIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Abuja coordinates
const ABUJA_CENTER = [9.0765, 7.4789];
const COVERAGE_RADIUS = 5000; // 5km radius for coverage area

export default function StationMap({ stations, className = '' }: StationMapProps) {
  return (
    <MapContainer
      center={ABUJA_CENTER}
      zoom={12}
      className={`w-full h-[400px] rounded-lg ${className}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {stations.map((station) => (
        <React.Fragment key={station.id}>
          <Marker
            position={[station.coordinates.latitude, station.coordinates.longitude]}
            icon={stationIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg">{station.name}</h3>
                <p className="text-sm text-gray-600">{station.address}</p>
                <p className="text-sm text-gray-600">Coverage: {station.coverage_area}</p>
                <p className="text-sm text-gray-600">Phone: {station.phone}</p>
                <p className="text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${station.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {station.status}
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Coverage area circle */}
          <Circle
            center={[station.coordinates.latitude, station.coordinates.longitude]}
            pathOptions={{
              fillColor: station.status === 'active' ? '#10B981' : '#EF4444',
              fillOpacity: 0.1,
              color: station.status === 'active' ? '#059669' : '#DC2626',
              weight: 1
            }}
            radius={COVERAGE_RADIUS}
          />
        </React.Fragment>
      ))}
    </MapContainer>
  );
}