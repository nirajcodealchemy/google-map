import MapControls from "./MapControls";
import LocationMarkers from "./LocationMarkers";
import type { MapLocation } from "../types/location";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { INITIAL_ZOOM, SURAT_CENTER, SURAT_LOCATIONS } from "../data/locations";

type Props = {
  mapId?: string;
  onReady: (map: google.maps.Map | null) => void;
};

function MapContents({ mapId, onReady }: Props) {
  const map = useMap();

  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [selected, setSelected] = useState<MapLocation | null>(null);

  useEffect(() => {
    onReady(map ?? null);

    return () => onReady(null);
  }, [map, onReady]);

  const resetMap = useCallback(() => {
    if (!map) return;

    map.setCenter(SURAT_CENTER);
    map.setZoom(INITIAL_ZOOM);
    map.setMapTypeId("roadmap");

    setMapType("roadmap");
    setSelected(null);
  }, [map]);

  const selectLocation = useCallback(
    (location: MapLocation) => {
      setSelected(location);
      map?.panTo(location.position);
      map?.setZoom(15);
    },
    [map],
  );

  const changeMapType = useCallback(
    (type: "roadmap" | "satellite") => {
      setMapType(type);
      map?.setMapTypeId(type);
    },
    [map],
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-100">
      <Map
        mapId={mapId}
        defaultCenter={SURAT_CENTER}
        defaultZoom={INITIAL_ZOOM}
        mapTypeId={mapType}
        gestureHandling="greedy"
        fullscreenControl
        streetViewControl={false}
        mapTypeControl={false}
        zoomControl={false}
        clickableIcons={false}
        className="h-full min-h-screen w-full"
      >
        <LocationMarkers
          locations={SURAT_LOCATIONS}
          selected={selected}
          onSelect={selectLocation}
          onClose={() => setSelected(null)}
        />
      </Map>

      <MapControls
        map={map ?? null}
        mapType={mapType}
        onMapTypeChange={changeMapType}
        onReset={resetMap}
      />

      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-3 py-2 text-xs font-medium text-slate-700 shadow-lg backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Surat, Gujarat, India
      </div>
    </div>
  );
}

export default function GoogleMapView(props: Props) {
  return <MapContents {...props} />;
}
