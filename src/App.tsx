import MapControls from "./components/MapControls";
import GoogleMapView from "./components/GoogleMapView";
import LocationSearch from "./components/LocationSearch";
import { useNearbyPlaces } from "./hooks/useNearbyPlaces";
import CategoryFilters from "./components/CategoryFilters";
import NearbyPlacesList from "./components/NearbyPlacesList";
import NoResultsModal from "./components/NoResultsModal";
import {
  PLACE_CATEGORIES,
  type NearbyPlace,
  type PlaceCategory,
} from "./types/place";
import { useCallback, useEffect, useRef, useState } from "react";
import { APIProvider, useApiIsLoaded } from "@vis.gl/react-google-maps";
import {
  LocateFixed,
  MapPinned,
  Navigation,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "";
const SURAT_CENTER = { lat: 21.1802, lng: 72.8311 };

function NearbyPlacesApp() {
  const loaded = useApiIsLoaded();

  const initialSearchStarted = useRef(false);
  const [radius, setRadius] = useState(2000);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { places, loading, error, search } = useNearbyPlaces();
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"list" | "map">("list");
  const [category, setCategory] = useState<PlaceCategory>("restaurant");
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [locationLabel, setLocationLabel] = useState("Surat, Gujarat, India");
  const [locationQuery, setLocationQuery] = useState("");
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(SURAT_CENTER);
  const [mapCenter, setMapCenter] =
    useState<google.maps.LatLngLiteral>(SURAT_CENTER);
  const [inputError, setInputError] = useState("");
  const radiusSearchTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [locationError, setLocationError] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const cancelPendingRadiusSearch = useCallback(() => {
    if (radiusSearchTimeout.current !== null) {
      clearTimeout(radiusSearchTimeout.current);
      radiusSearchTimeout.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      if (radiusSearchTimeout.current) {
        clearTimeout(radiusSearchTimeout.current);
      }
    },
    [],
  );
  useEffect(() => {
    return () => {
      if (radiusSearchTimeout.current !== null) {
        clearTimeout(radiusSearchTimeout.current);
      }
    };
  }, []);

  const mapSectionRef = useRef<HTMLElement | null>(null);

  const startSearch = useCallback(
    (
      searchCenter: google.maps.LatLngLiteral,
      searchRadius: number,
      searchCategory: PlaceCategory,
    ) => {
      cancelPendingRadiusSearch();
      setSelectedId(null);
      setShowNoResultsModal(false);

      void search(searchCenter, searchRadius, searchCategory).then(
        (noResults) => {
          console.log(noResults);
          if (noResults) {
            setShowNoResultsModal(true);
          }
        },
      );
    },
    [cancelPendingRadiusSearch, search],
  );

  const handleMapReady = useCallback(
    (instance: google.maps.Map | null) => {
      setMap(instance);

      if (instance && !initialSearchStarted.current) {
        initialSearchStarted.current = true;

        startSearch(SURAT_CENTER, 2000, "restaurant");
      }
    },
    [startSearch],
  );
  const runSearch = useCallback(
    (nextCenter = center, nextRadius = radius, nextCategory = category) => {
      startSearch(nextCenter, nextRadius, nextCategory);
    },
    [center, radius, category, startSearch],
  );

  const handleLocationSelect = useCallback(
    (location: google.maps.LatLngLiteral, label: string) => {
      setCenter(location);
      setMapCenter(location);
      setLocationLabel(label);
      setSelectedId(null);
      map?.panTo(location);
      map?.setZoom(14);
      runSearch(location, radius, category);
    },
    [map, radius, category, runSearch],
  );

  const handleCategoryChange = (nextCategory: PlaceCategory) => {
    cancelPendingRadiusSearch();
    setCategory(nextCategory);
    startSearch(center, radius, nextCategory);
  };

  const handleRadiusChange = (nextRadius: number) => {
    setRadius(nextRadius);
    setSelectedId(null);

    // Cancel the previous pending API call.
    cancelPendingRadiusSearch();

    // Start a new timer after every slider movement.
    radiusSearchTimeout.current = setTimeout(() => {
      radiusSearchTimeout.current = null;
      startSearch(center, nextRadius, category);
    }, 500);
  };

  const handlePlaceSelect = (place: NearbyPlace) => {
    setSelectedId(place.id);
    setMapCenter(place.position);
    map?.panTo(place.position);
    map?.setZoom(16);
    setMobileTab("map");
  };

  const handleMapTypeChange = useCallback(
    (type: "roadmap" | "satellite") => {
      setMapType(type);
      map?.setMapTypeId(type);
    },
    [map],
  );

  const handleMapReset = () => {
    setSelectedId(null);
    setMapCenter(center);
    map?.panTo(center);
    map?.setZoom(13);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError({
        title: "Location Not Supported",
        message:
          "Your browser does not support location access. Please use a modern browser to find nearby places.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = {
          lat: coords.latitude,
          lng: coords.longitude,
        };

        setLocationError(null);
        setCenter(location);
        setMapCenter(location);
        setLocationLabel("Your current location");
        setMobileTab("map");

        map?.panTo(location);
        map?.setZoom(14);

        runSearch(location, radius, category);

        setTimeout(() => {
          mapSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      },
      (error: GeolocationPositionError) => {
        console.error("Geolocation error:", error);

        if (!window.isSecureContext) {
          setLocationError({
            title: "Secure Connection Required",
            message:
              "Your location requires a secure connection. Open this app using HTTPS or localhost, then try again.",
          });
          return;
        }

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError({
              title: "Location Permission Denied",
              message:
                "Location access is blocked. Allow location permission in your browser settings and try again.",
            });
            break;

          case error.POSITION_UNAVAILABLE:
            setLocationError({
              title: "Location Unavailable",
              message:
                "We couldn't determine your current location. Check your device's location services and try again.",
            });
            break;

          case error.TIMEOUT:
            setLocationError({
              title: "Location Request Timed Out",
              message:
                "Finding your location took too long. Please check your connection and try again.",
            });
            break;

          default:
            setLocationError({
              title: "Unable to Find Location",
              message:
                "Something went wrong while accessing your location. Please try again.",
            });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading Nearby Places Finder...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {showNoResultsModal && (
        <NoResultsModal
          location={locationLabel}
          categoryLabel={
            PLACE_CATEGORIES.find((item) => item.value === category)?.label ??
            "places"
          }
          onClose={() => setShowNoResultsModal(false)}
        />
      )}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <MapPinned size={24} />
            </span>
            <div>
              <h1 className="text-lg font-bold sm:text-xl">Nearby Places</h1>
              <p className="text-xs text-slate-500">
                Explore what's around you
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCurrentLocation}
            className="inline-flex items-center gap-2 rounded-xl border cursor-pointer border-slate-200 px-3 py-2.5 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-700"
          >
            <LocateFixed size={17} />
            <span className="hidden sm:inline">Use my location</span>
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Find places near you
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Search a location, choose a category, and explore nearby results.
          </p>
        </div>

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex-row justify-between items-center gap-4 sm:flex">
            <div className="w-full">
              <label className="mb-2 block text-sm font-semibold">
                Search location
              </label>
              <LocationSearch
                onQueryChange={setLocationQuery}
                onLocationSelect={handleLocationSelect}
                setInputError={setInputError}
              />
              <p className="mt-2 truncate text-xs text-slate-500">
                <Navigation size={13} className="mr-1 inline" />
                Search center: {locationLabel}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => runSearch()}
                disabled={loading || !locationQuery.trim() || !!inputError}
                className="inline-flex mt-4 sm:w-auto text-nowrap h-[58px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold w-full text-white transition sm:mt-0 hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed  disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw size={17} className="animate-spin" />
                ) : (
                  <Search size={17} />
                )}
                Search nearby
              </button>
              <span className="text-sm text-white">
                {inputError ? "." : ""}
                {/* {inputError} */}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.65fr)]">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-blue-600" />
                <h3 className="text-sm font-semibold">Place category</h3>
              </div>
              <CategoryFilters
                category={category}
                onChange={handleCategoryChange}
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label htmlFor="radius" className="text-sm font-semibold">
                  Search radius
                </label>
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-bold text-blue-700">
                  {radius >= 1000
                    ? `${(radius / 1000).toFixed(1)} km`
                    : `${radius} m`}
                </span>
              </div>

              <input
                id="radius"
                type="range"
                min={500}
                max={50000}
                step={500}
                value={radius}
                onChange={(event) =>
                  handleRadiusChange(Number(event.target.value))
                }
                className="w-full cursor-pointer accent-blue-600"
              />

              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>500 m</span>
                <span>50 km</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 flex gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileTab("list")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold cursor-pointer ${
              mobileTab === "list"
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            Results ({places.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("map")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold cursor-pointer ${
              mobileTab === "map"
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            Map
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside
            className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
              mobileTab === "list" ? "block" : "hidden"
            } lg:block`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div>
                <h3 className="font-semibold">Nearby places</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {loading ? "Searching..." : `${places.length} results found`}
                </p>
              </div>
              <span className="rounded-xl bg-slate-100 p-2 text-slate-500">
                <MapPinned size={19} />
              </span>
            </div>

            <div className="max-h-[65vh] min-h-[300px] overflow-y-auto">
              <NearbyPlacesList
                places={places}
                selectedId={selectedId}
                onSelect={handlePlaceSelect}
                loading={loading}
                error={error}
              />
            </div>
          </aside>

          <section
            ref={mapSectionRef}
            className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
              mobileTab === "map" ? "block" : "hidden"
            } lg:block`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold">Interactive map</h3>
                <p className="mt-1 max-w-[230px] truncate text-xs text-slate-500">
                  {locationLabel}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                {places.length} places
              </span>
            </div>

            <div className="relative h-[65vh] min-h-[420px] w-full lg:h-[calc(100vh-290px)] lg:min-h-[540px]">
              <GoogleMapView
                center={mapCenter}
                mapId="DEMO_MAP_ID"
                places={places}
                selectedId={selectedId}
                onSelect={handlePlaceSelect}
                onClose={() => setSelectedId(null)}
                onMapReady={handleMapReady}
              />
              <MapControls
                map={map}
                mapType={mapType}
                onMapTypeChange={handleMapTypeChange}
                onReset={handleMapReset}
              />
            </div>
          </section>
        </div>

        <footer className="py-5 text-center text-xs text-slate-400">
          Place information and map data provided by Google Maps.
        </footer>
      </section>

      {locationError && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLocationError(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="location-error-title"
            aria-describedby="location-error-description"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <LocateFixed size={25} />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="location-error-title"
                  className="text-lg font-bold text-slate-900"
                >
                  {locationError.title}
                </h2>

                <p
                  id="location-error-description"
                  className="mt-2 text-sm leading-6 text-slate-600"
                >
                  {locationError.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setLocationError(null)}
                aria-label="Close location error"
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setLocationError(null);
                  handleCurrentLocation();
                }}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function App() {
  const [apiError, setApiError] = useState(false);
  const handleApiError = useCallback((error: unknown) => {
    console.error("Google Maps failed to load:", error);
    setApiError(true);
  }, []);

  if (!API_KEY) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold">Google Maps setup required</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Copy .env.example to .env, add your Google Maps API key, and restart
            Vite. Enable Maps JavaScript API and Places API (New), enable
            billing, and allow this site in the key's HTTP referrer
            restrictions.
          </p>
        </div>
      </main>
    );
  }

  if (apiError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Google Maps could not load
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Verify your API key, billing account, enabled Maps JavaScript API
            and Places API (New), and HTTP referrer restrictions. Then reload
            the page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <APIProvider
      apiKey={API_KEY}
      libraries={["places"]}
      onError={handleApiError}
    >
      <NearbyPlacesApp />
    </APIProvider>
  );
}
