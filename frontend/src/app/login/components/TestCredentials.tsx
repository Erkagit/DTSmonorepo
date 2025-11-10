import { Lock } from 'lucide-react';

interface Credential {
  role: string;
  email: string;
  password: string;
}

const credentials: Credential[] = [
  {
    role: 'Админ',
    email: 'admin@dts.local',
    password: 'password123',
  },
  {
    role: 'Харилцагчийн Админ',
    email: 'client@acme.local',
    password: 'password123',
  },
];

export function TestCredentials() {
  return (
    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <p className="text-xs sm:text-sm lg:text-base font-semibold text-blue-900 mb-2 sm:mb-3 flex items-center gap-2">
          <Lock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          Туршилтын нэвтрэх мэдээлэл
        </p>
        <div className="space-y-2 text-xs sm:text-sm">
          {credentials.map((cred, index) => (
            <div key={index} className="bg-white rounded p-2 sm:p-3">
              <p className="font-medium text-gray-900">{cred.role}</p>
              <p className="text-gray-600 break-all">
                Имэйл:{' '}
                <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px] sm:text-xs lg:text-sm">
                  {cred.email}
                </code>
              </p>
              <p className="text-gray-600">
                Нууц үг:{' '}
                <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px] sm:text-xs lg:text-sm">
                  {cred.password}
                </code>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
