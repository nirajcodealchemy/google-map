import { LoaderCircle, MapPin } from "lucide-react";

export default function MapLoader() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-slate-50">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <MapPin size={30} />
        <LoaderCircle
          size={68}
          className="absolute animate-spin text-blue-300"
          strokeWidth={1}
        />
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-slate-800">
          Loading Google Maps
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Preparing your interactive map...
        </p>
      </div>
    </div>
  );
}
