import { MapPin, MapPinned } from "lucide-react";
import type { MapLocation } from "../types/location";
import { InfoWindow, Marker } from "@vis.gl/react-google-maps";

type Props = {
  onClose: () => void;
  locations: MapLocation[];
  selected: MapLocation | null;
  onSelect: (location: MapLocation) => void;
};

export default function LocationMarkers({
  onClose,
  onSelect,
  selected,
  locations,
}: Props) {
  return (
    <>
      {locations.map((location) => (
        <Marker
          key={location.id}
          title={location.name}
          position={location.position}
          onClick={() => onSelect(location)}
        />
      ))}

      {selected && (
        <InfoWindow position={selected.position} onCloseClick={onClose}>
          <div className="min-w-[220px] max-w-[280px] p-1 font-sans">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  <MapPinned size={11} />
                  {selected.category}
                </span>

                <h3 className="mt-2 text-sm font-bold leading-5 text-slate-900">
                  {selected.name}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {selected.address}
                </p>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
