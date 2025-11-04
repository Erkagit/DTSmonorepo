import { Truck } from 'lucide-react';
import { Telemetry } from '@/types/delivery';
import Image from 'next/image';

interface MapPlaceholderProps {
  telemetry: Telemetry[];
}

export default function MapPlaceholder({ telemetry }: MapPlaceholderProps) {
  const mapCenterLat = 46.8624;
  const mapCenterLon = 103.8466;

  return (
    <div className="relative w-full h-full bg-gray-200 rounded-xl overflow-hidden">
      {/* Газрын зураг Placeholder */}
      <Image
        src="https://via.placeholder.com/1000x500/A0B2C9/FFFFFF?text=DTS+Map+View"
        alt="Map Placeholder"
        className="w-full h-full object-cover opacity-70"
        width={1000}
        height={500}
        unoptimized
      />
      <div className="absolute top-0 left-0 p-4 text-xs font-semibold text-gray-700">
        Google Maps API (Симуляци хийж байна)
      </div>

      {/* GPS тэмдэглэгээ (Telemetry-д суурилсан) */}
      {telemetry.map((t, index) => (
        <div
          key={t.device_id}
          className="absolute transform -translate-x-1/2 -translate-y-full p-2 bg-red-600 rounded-full shadow-xl animate-pulse"
          style={{ top: `${20 + index * 15}%`, left: `${30 + index * 10}%` }}
          title={`Машин: ${t.device_id}, Lat: ${t.latitude}, Lon: ${t.longitude}`}
        >
          <Truck className="w-4 h-4 text-white" />
        </div>
      ))}

      <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg text-sm text-gray-700">
        Төв: ({mapCenterLat.toFixed(4)}, {mapCenterLon.toFixed(4)})
      </div>
    </div>
  );
}
