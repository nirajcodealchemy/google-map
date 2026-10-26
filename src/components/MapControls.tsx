import {
  Map as MapIcon,
  Minus,
  Plus,
  RotateCcw,
  Satellite,
} from "lucide-react";

type MapControlsProps = {
  map: google.maps.Map | null;
  mapType: "roadmap" | "satellite";
  onMapTypeChange: (type: "roadmap" | "satellite") => void;
  onReset: () => void;
};

export default function MapControls({
  map,
  mapType,
  onMapTypeChange,
  onReset,
}: MapControlsProps) {
  const buttonClass =
    "flex h-10 w-10 items-center cursor-pointer justify-center rounded-xl text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="absolute right-4 top-16 z-10 flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-900/10">
        <button
          type="button"
          aria-label="Zoom in"
          title="Zoom in"
          disabled={!map}
          onClick={() => map?.setZoom((map.getZoom() ?? 12) + 1)}
          className={buttonClass}
        >
          <Plus size={19} />
        </button>

        <div className="mx-2 border-t border-slate-100" />

        <button
          type="button"
          aria-label="Zoom out"
          title="Zoom out"
          disabled={!map}
          onClick={() => map?.setZoom((map.getZoom() ?? 12) - 1)}
          className={buttonClass}
        >
          <Minus size={19} />
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-900/10">
        <button
          type="button"
          title="Reset map"
          aria-label="Reset map"
          onClick={onReset}
          className={buttonClass}
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-900/10">
        <button
          type="button"
          title="Roadmap view"
          aria-label="Roadmap view"
          aria-pressed={mapType === "roadmap"}
          disabled={!map}
          onClick={() => onMapTypeChange("roadmap")}
          className={`${buttonClass} ${
            mapType === "roadmap" ? "bg-blue-50 text-blue-600" : ""
          }`}
        >
          <MapIcon size={18} />
        </button>

        <button
          type="button"
          title="Satellite view"
          aria-label="Satellite view"
          aria-pressed={mapType === "satellite"}
          disabled={!map}
          onClick={() => onMapTypeChange("satellite")}
          className={`${buttonClass} ${
            mapType === "satellite" ? "bg-blue-50 text-blue-600" : ""
          }`}
        >
          <Satellite size={18} />
        </button>
      </div>
    </div>
  );
}
