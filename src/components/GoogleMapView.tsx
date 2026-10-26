import { useEffect, useRef } from "react";
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";
import type { NearbyPlace } from "../types/place";

type Props = {
  mapId?: string;
  places: NearbyPlace[];
  selectedId: string | null;
  center: google.maps.LatLngLiteral;
  onClose: () => void;
  onSelect: (place: NearbyPlace) => void;
  onMapReady: (map: google.maps.Map | null) => void;
};

function MapContents({
  mapId,
  center,
  places,
  selectedId,
  onSelect,
  onClose,
  onMapReady,
}: Props) {
  const map = useMap();
  const previousCenter = useRef(center);

  useEffect(() => {
    onMapReady(map ?? null);

    return () => onMapReady(null);
  }, [map, onMapReady]);

  useEffect(() => {
    if (!map) return;

    if (
      previousCenter.current.lat !== center.lat ||
      previousCenter.current.lng !== center.lng
    ) {
      map.panTo(center);
      previousCenter.current = center;
    }
  }, [center, map]);

  const selected = places.find((place) => place.id === selectedId) ?? null;

  return (
    <Map
      mapId={mapId ?? "DEMO_MAP_ID"}
      defaultCenter={center}
      defaultZoom={13}
      gestureHandling="greedy"
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl
      className="h-full w-full"
    >
      {places.map((place) => {
        const active = selectedId === place.id;

        return (
          <AdvancedMarker
            key={place.id}
            position={place.position}
            title={place.name}
            onClick={() => onSelect(place)}
            zIndex={active ? 100 : 1}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-white shadow-lg transition ${
                active ? "scale-125 bg-blue-700" : "bg-red-500 hover:scale-110"
              }`}
            >
              <MapPin size={19} fill="currentColor" />
            </div>
          </AdvancedMarker>
        );
      })}

      {selected && (
        <InfoWindow position={selected.position} onCloseClick={onClose}>
          <div className="max-w-[240px] p-1">
            <h3 className="text-sm font-bold text-slate-900">
              {selected.name}
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              {selected.address}
            </p>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
}

export default function GoogleMapView(props: Props) {
  return <MapContents {...props} />;
}
