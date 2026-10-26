import { useEffect, useRef } from "react";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import type { NearbyPlace } from "../types/place";

type Props = {
  places: NearbyPlace[];
  selectedId: string | null;
  onSelect: (place: NearbyPlace) => void;
  loading: boolean;
  error: string;
};

export default function NearbyPlacesList({
  places,
  selectedId,
  onSelect,
  loading,
  error,
}: Props) {
  const placeElements = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (!selectedId) return;

    placeElements.current
      .get(selectedId)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="mt-4 text-sm font-semibold text-slate-700">
          Finding nearby places...
        </p>
        <p className="mt-1 text-xs text-slate-500">
          This may take a few seconds.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="m-3 rounded-xl border border-red-200 bg-red-50 p-4"
      >
        <p className="text-sm font-semibold text-red-800">Search failed</p>
        <p className="mt-1 text-xs leading-5 text-red-700">{error}</p>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <MapPin size={30} className="mx-auto text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-slate-700">
          No places found
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Try a different category, location, or search radius.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3">
      {places.map((place) => {
        const active = selectedId === place.id;

        return (
          <button
            key={place.id}
            ref={(element) => {
              if (element) {
                placeElements.current.set(place.id, element);
              } else {
                placeElements.current.delete(place.id);
              }
            }}
            type="button"
            onClick={() => onSelect(place)}
            aria-pressed={active}
            className={`w-full rounded-xl border p-3 text-left transition cursor-pointer ${
              active
                ? "border-blue-400 bg-blue-50 ring-2 ring-blue-500/10"
                : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <MapPin size={19} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">
                  {place.name}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {place.address}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                  <Navigation size={13} />
                  View on map
                </span>
              </span>

              {place.googleMapsURI && (
                <a
                  href={place.googleMapsURI}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${place.name} in Google Maps`}
                  onClick={(event) => event.stopPropagation()}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-blue-600"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
