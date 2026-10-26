import { useEffect, useRef, useState } from "react";

type Props = {
  onQueryChange: (query: string) => void;
  setInputError: (value: string) => void;
  onLocationSelect: (
    location: google.maps.LatLngLiteral,

    label: string,
  ) => void;
};

type PlacesLibrary = google.maps.PlacesLibrary;
type PlaceSuggestion = google.maps.places.AutocompleteSuggestion;

export default function LocationSearch({
  onQueryChange,
  setInputError,
  onLocationSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [placesLibrary, setPlacesLibrary] = useState<PlacesLibrary | null>(
    null,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const requestIdRef = useRef(0);

  const onLocationSelectRef = useRef(onLocationSelect);
  const onQueryChangeRef = useRef(onQueryChange);

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
    onQueryChangeRef.current = onQueryChange;
  }, [onLocationSelect, onQueryChange]);

  // Load Google's Places library once.
  useEffect(() => {
    let cancelled = false;

    async function loadPlaces() {
      try {
        const library = (await google.maps.importLibrary(
          "places",
        )) as PlacesLibrary;

        if (!cancelled) {
          setPlacesLibrary(library);
        }
      } catch (cause) {
        console.error("Failed to load Places library:", cause);

        if (!cancelled) {
          setError("Location search could not be loaded. Please try again.");
          setInputError(
            "Location search could not be loaded. Please try again.",
          );
        }
      }
    }

    void loadPlaces();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch suggestions as the user types, with a short debounce.
  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const trimmedQuery = query.trim();

    if (!placesLibrary || trimmedQuery.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      setInputError("");

      try {
        if (!sessionTokenRef.current) {
          sessionTokenRef.current =
            new placesLibrary.AutocompleteSessionToken();
        }

        const { suggestions: results } =
          await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            {
              input: trimmedQuery,
              sessionToken: sessionTokenRef.current,
              language: "en",
              region: "in",
            },
          );

        // Ignore responses for older input.
        if (requestId !== requestIdRef.current) return;

        const placeResults = results.filter((item) => item.placePrediction);

        setSuggestions(placeResults);

        if (placeResults.length === 0) {
          setError("No matching locations found. Try another search.");
          setInputError("No matching locations found. Try another search.");
        }
      } catch (cause) {
        if (requestId !== requestIdRef.current) return;

        console.error("Autocomplete request failed:", cause);
        setSuggestions([]);
        setError("Could not load suggestions. Please try again.");
        setInputError("Could not load suggestions. Please try again.");
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query, placesLibrary]);

  if (query.trim().length > 0 && query.trim().length < 3) {
    setInputError("Enter at least 3 characters to search");
  }
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setInputError(value);
    onQueryChangeRef.current(value);
    setError("");
    setInputError("");
  };

  const handleSelect = async (suggestion: PlaceSuggestion) => {
    const prediction = suggestion.placePrediction;
    if (!prediction) return;

    // Invalidate any pending autocomplete response.
    requestIdRef.current++;

    setLoading(true);
    setError("");
    setInputError("");
    setSuggestions([]);

    try {
      const place = prediction.toPlace();

      await place.fetchFields({
        fields: ["displayName", "formattedAddress", "location"],
      });

      if (!place.location) {
        setError("This result does not have a valid location.");
        setInputError("This result does not have a valid location.");
        return;
      }

      const label =
        place.formattedAddress ??
        place.displayName ??
        prediction.text.toString();

      setQuery(label);
      onQueryChangeRef.current(label);

      onLocationSelectRef.current(
        {
          lat: place.location.lat(),
          lng: place.location.lng(),
        },
        label,
      );

      // A selected place completes the autocomplete session.
      sessionTokenRef.current = null;
      inputRef.current?.blur();
      setIsFocused(false);
    } catch (cause) {
      console.error("Could not select location:", cause);
      setError("Could not load this location. Please try another.");
      setInputError("Could not load this location. Please try another.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setSuggestions([]);
      setIsFocused(false);
      inputRef.current?.blur();
    }

    if (event.key === "Enter" && suggestions.length > 0) {
      event.preventDefault();
      void handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-2 py-1 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Allow dropdown buttons to receive their click first.
              window.setTimeout(() => setIsFocused(false), 150);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search a city, address, or landmark..."
            autoComplete="off"
            aria-label="Search location"
            aria-expanded={isFocused && suggestions.length > 0}
            className="block min-h-12 w-full rounded-xl border-0 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none shadow-none ring-0 placeholder:text-slate-400 focus:border-0 focus:outline-none focus:shadow-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          />
        </div>

        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          </div>
        )}

        {isFocused && suggestions.length > 0 && (
          <ul
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => {
              const prediction = suggestion.placePrediction;
              if (!prediction) return null;

              return (
                <li key={prediction.placeId ?? index} role="option">
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => void handleSelect(suggestion)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition cursor-pointer hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                  >
                    <span className="mt-0.5 text-slate-400">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                    </span>

                    <span className="min-w-0 flex-1 text-sm text-slate-700">
                      {prediction.text.toString()}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}

      {query.trim().length > 0 && query.trim().length < 3 && (
        <p className="mt-2 text-xs text-red-600">
          Enter at least 3 characters to search.
        </p>
      )}
    </div>
  );
}
