import { useCallback, useState } from "react";
import {
  APIProvider,
  useApiIsLoaded,
  useApiLoadingStatus,
} from "@vis.gl/react-google-maps";
import { MapPin, Navigation, Search } from "lucide-react";

import GoogleMapView from "./components/GoogleMapView";
import MapLoader from "./components/MapLoader";
import MapError from "./components/MapError";
import { SURAT_LOCATIONS } from "./data/locations";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "";

function MapApplication() {
  const status = useApiLoadingStatus();
  const loaded = useApiIsLoaded();

  const [retry, setRetry] = useState(0);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [search, setSearch] = useState("");

  const handleMapReady = useCallback((instance: google.maps.Map | null) => {
    setMap(instance);
  }, []);

  const places = SURAT_LOCATIONS.filter((place) => {
    const query = search.trim().toLowerCase();

    return (
      !query ||
      place.name.toLowerCase().includes(query) ||
      place.address.toLowerCase().includes(query) ||
      place.category.toLowerCase().includes(query)
    );
  });

  const showLocation = (place: (typeof SURAT_LOCATIONS)[number]) => {
    map?.panTo(place.position);
    map?.setZoom(15);
  };

  if (status === "FAILED") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <MapError
          message="The Maps JavaScript API failed to load. Verify your demo key, API configuration, and browser connection."
          onRetry={() => setRetry((value) => value + 1)}
        />
      </main>
    );
  }

  if (!loaded) {
    return <MapLoader />;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="flex max-h-170 min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <h3 className="text-base font-semibold">Explore locations</h3>
              <p className="mt-1 text-sm text-slate-500">
                Find a place in Surat
              </p>

              <div className="relative mt-4">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search places..."
                  aria-label="Search locations"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Popular places
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {places.length}
              </span>
            </div>

            <div className="max-h-[380px] overflow-y-auto px-3 pb-3 lg:max-h-[520px]">
              {places.length > 0 ? (
                <div className="space-y-1">
                  {places.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => showLocation(place)}
                      className="group flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-blue-100 group-hover:text-blue-700">
                        <MapPin size={19} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                          {place.name}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {place.category}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">
                          {place.address}
                        </span>
                      </span>

                      <Navigation
                        size={15}
                        className="mt-1 shrink-0 text-slate-300 transition group-hover:text-blue-600"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-10 text-center">
                  <Search className="mx-auto text-slate-300" size={28} />
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    No places found
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Try another name or category.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-auto border-t border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Navigation size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold">Surat, Gujarat</p>
                  <p className="text-xs text-slate-500">India</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
              <div>
                <h3 className="text-sm font-semibold">Interactive map</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Select a marker or a location to explore
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Map ready
              </span>
            </div>

            <div className="relative h-[60vh] min-h-[420px] w-full sm:h-[70vh] lg:h-[calc(100vh-245px)] lg:min-h-[520px]">
              <GoogleMapView key={retry} onReady={handleMapReady} />
            </div>
          </section>
        </div>

        <footer className="py-5 text-center text-xs text-slate-400">
          Map data and imagery provided by Google Maps.
        </footer>
      </section>
    </main>
  );
}

export default function App() {
  if (!API_KEY) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <MapPin size={28} />
          </span>

          <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            Setup required
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Add your Google Maps demo key
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Create a{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">.env</code>{" "}
            file in your project root and add the following line:
          </p>

          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-emerald-300">
            VITE_GOOGLE_MAPS_API_KEY=your_demo_key_here
          </pre>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Save the file and restart the Vite development server.
          </p>

          <a
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            href="https://developers.google.com/maps/documentation/javascript/demo-key"
            target="_blank"
            rel="noreferrer"
          >
            Learn about the Google Maps demo key
            <Navigation size={16} />
          </a>
        </section>
      </main>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <MapApplication />
    </APIProvider>
  );
}
