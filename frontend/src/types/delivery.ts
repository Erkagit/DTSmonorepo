// Delivery Types
export type DeliveryStatus = 
  | 'Хүлээгдэж байна'
  | 'Ачилт хийгдэж байна'
  | 'Шилжүүлэн ачилт хийгдэж байна - Хятадын экспорт гааль'
  | 'Монгол экспорт гааль'
  | 'Монгол импорт гааль'
  | 'Хүргэлт замдаа явж байна'
  | 'Буулгах хаягт ирсэн'
  | 'Ачаа буусан'
  | 'Буцах хүргэлт'
  | 'Монголын экпорт буцах'
  | 'Хятадын импорт'
  | 'Шилжүүлэн ачилт'
  | 'Дуусгах';

export type DeliveryStatusEnum =
  | 'WAITING'
  | 'LOADING'
  | 'TRANSIT_LOADING_CHINA_EXPORT'
  | 'MONGOLIA_EXPORT_CUSTOMS'
  | 'MONGOLIA_IMPORT_CUSTOMS'
  | 'IN_TRANSIT'
  | 'ARRIVED_AT_DESTINATION'
  | 'UNLOADED'
  | 'RETURN_DELIVERY'
  | 'MONGOLIA_EXPORT_RETURN'
  | 'CHINA_IMPORT'
  | 'TRANSIT_LOADING'
  | 'COMPLETED';

export interface Delivery {
  id: string;
  order_id: string;
  vehicle_id: string | null;
  plate_number: string;
  current_status: DeliveryStatus;
  current_status_enum: DeliveryStatusEnum;
  origin: string;
  destination: string;
  last_updated: string | Date;
  company?: string;
  assigned_to?: string;
}

export interface Telemetry {
  device_id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface User {
  role: string;
  username: string;
}
