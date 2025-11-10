import { Lock } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-start gap-2 animate-shake">
      <Lock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0 mt-0.5" />
      <span className="text-xs sm:text-sm lg:text-base">{message}</span>
    </div>
  );
}
