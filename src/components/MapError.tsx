import { AlertTriangle, RefreshCw } from "lucide-react";

interface MapErrorProps {
  message: string;
  onRetry?: () => void;
}

export default function MapError({ message, onRetry }: MapErrorProps) {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-slate-50 p-5">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle size={30} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Unable to load the map
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <RefreshCw size={17} />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
