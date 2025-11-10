import { Truck } from 'lucide-react';

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center mb-6 sm:mb-8">
      <div className="p-3 sm:p-4 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-3 sm:mb-4">
        <Truck className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
        Тавтай морилно уу
      </h1>
      <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-2 text-center">
        Ачир Байрон ХХК-ийн хүргэлтийн системд нэвтрэх
      </p>
    </div>
  );
}
