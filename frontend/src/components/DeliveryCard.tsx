import { MapPin, Clock, CheckCircle } from 'lucide-react';
import { Delivery, DeliveryStatus, DeliveryStatusEnum } from '@/types/delivery';

// Хүргэлтийн статусын Mongolian ENUM утгууд
const DeliveryStatusMap: Record<DeliveryStatus, string> = {
  'Хүлээгдэж байна': 'text-yellow-500 bg-yellow-100',
  'Ачилт хийгдэж байна': 'text-blue-500 bg-blue-100',
  'Шилжүүлэн ачилт хийгдэж байна - Хятадын экспорт гааль': 'text-indigo-500 bg-indigo-100',
  'Монгол экспорт гааль': 'text-purple-500 bg-purple-100',
  'Монгол импорт гааль': 'text-cyan-500 bg-cyan-100',
  'Хүргэлт замдаа явж байна': 'text-green-600 bg-green-100',
  'Буулгах хаягт ирсэн': 'text-orange-500 bg-orange-100',
  'Ачаа буусан': 'text-red-500 bg-red-100',
  'Буцах хүргэлт': 'text-pink-500 bg-pink-100',
  'Монголын экпорт буцах': 'text-gray-500 bg-gray-100',
  'Хятадын импорт': 'text-teal-500 bg-teal-100',
  'Шилжүүлэн ачилт': 'text-lime-500 bg-lime-100',
  'Дуусгах': 'text-lime-700 bg-lime-200',
};

// Enum-аас Mongolian руу хөрвүүлэх
const EnumToMongolian: Record<DeliveryStatusEnum, DeliveryStatus> = {
  WAITING: 'Хүлээгдэж байна',
  LOADING: 'Ачилт хийгдэж байна',
  TRANSIT_LOADING_CHINA_EXPORT: 'Шилжүүлэн ачилт хийгдэж байна - Хятадын экспорт гааль',
  MONGOLIA_EXPORT_CUSTOMS: 'Монгол экспорт гааль',
  MONGOLIA_IMPORT_CUSTOMS: 'Монгол импорт гааль',
  IN_TRANSIT: 'Хүргэлт замдаа явж байна',
  ARRIVED_AT_DESTINATION: 'Буулгах хаягт ирсэн',
  UNLOADED: 'Ачаа буусан',
  RETURN_DELIVERY: 'Буцах хүргэлт',
  MONGOLIA_EXPORT_RETURN: 'Монголын экпорт буцах',
  CHINA_IMPORT: 'Хятадын импорт',
  TRANSIT_LOADING: 'Шилжүүлэн ачилт',
  COMPLETED: 'Дуусгах',
};

// Дараагийн статусууд
const NextStatusMap: Record<DeliveryStatusEnum, DeliveryStatusEnum | null> = {
  WAITING: 'LOADING',
  LOADING: 'TRANSIT_LOADING_CHINA_EXPORT',
  TRANSIT_LOADING_CHINA_EXPORT: 'MONGOLIA_EXPORT_CUSTOMS',
  MONGOLIA_EXPORT_CUSTOMS: 'MONGOLIA_IMPORT_CUSTOMS',
  MONGOLIA_IMPORT_CUSTOMS: 'IN_TRANSIT',
  IN_TRANSIT: 'ARRIVED_AT_DESTINATION',
  ARRIVED_AT_DESTINATION: 'UNLOADED',
  UNLOADED: 'COMPLETED',
  RETURN_DELIVERY: 'MONGOLIA_EXPORT_RETURN',
  MONGOLIA_EXPORT_RETURN: 'CHINA_IMPORT',
  CHINA_IMPORT: 'TRANSIT_LOADING',
  TRANSIT_LOADING: 'COMPLETED',
  COMPLETED: null,
};

interface DeliveryCardProps {
  delivery: Delivery;
  onStatusUpdate: (id: string, status: DeliveryStatusEnum) => void;
}

export default function DeliveryCard({ delivery, onStatusUpdate }: DeliveryCardProps) {
  const statusClass = DeliveryStatusMap[delivery.current_status] || 'text-gray-500 bg-gray-100';

  // Дараагийн боломжит төлөвийг олох
  const nextStatusEnum = NextStatusMap[delivery.current_status_enum];
  const nextStatus = nextStatusEnum ? EnumToMongolian[nextStatusEnum] : null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500 transition hover:shadow-xl">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-800">{delivery.plate_number}</h3>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClass} whitespace-nowrap`}>
          {delivery.current_status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">
        <strong>Захиалга:</strong> {delivery.order_id}
      </p>

      <div className="space-y-1 text-sm text-gray-700">
        <p className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <strong>Гарал:</strong> {delivery.origin}
        </p>
        <p className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <strong>Очих:</strong> {delivery.destination}
        </p>
        <p className="text-xs text-gray-500 flex items-center mt-2">
          <Clock className="w-3 h-3 mr-1" /> Сүүлийн шинэчлэл: {new Date(delivery.last_updated).toLocaleTimeString('mn-MN')}
        </p>
      </div>

      {nextStatusEnum && delivery.current_status !== 'Дуусгах' && (
        <button
          onClick={() => onStatusUpdate(delivery.id, nextStatusEnum)}
          className="mt-4 w-full flex justify-center items-center py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-150 shadow-md"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {nextStatus}-руу шилжүүлэх
        </button>
      )}
    </div>
  );
}
