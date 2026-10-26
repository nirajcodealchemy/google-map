// import { useCallback, useRef, useState } from "react";
// import { searchNearbyPlaces } from "../services/placesService";
// import type { NearbyPlace, PlaceCategory } from "../types/place";

// function getSearchErrorMessage(error: unknown): string {
//   const message =
//     error instanceof Error
//       ? error.message
//       : typeof error === "string"
//         ? error
//         : error &&
//             typeof error === "object" &&
//             "message" in error &&
//             typeof error.message === "string"
//           ? error.message
//           : "";

//   if (/INVALID_SEARCH_LOCATION/i.test(message)) {
//     return "The selected location is invalid. Search for a valid address, city, or landmark and try again.";
//   }

//   if (/INVALID_SEARCH_RADIUS/i.test(message)) {
//     return "The search radius is invalid. Choose a radius between 500 m and 50 km.";
//   }

//   if (/INVALID_SEARCH_CATEGORY|INVALID_ARGUMENT/i.test(message)) {
//     return "This search request is invalid. Check the selected category and search settings, then try again.";
//   }

//   if (/RESOURCE_EXHAUSTED|OVER_QUERY_LIMIT|quota exceeded/i.test(message)) {
//     return "Google Places search quota has been exceeded. Check your Places API quota and billing in Google Cloud Console.";
//   }

//   if (/REQUEST_DENIED|API_KEY_INVALID|PERMISSION_DENIED|not authorized/i.test(message)) {
//     return "Google Places rejected this request. Verify the Places API (New), billing, and API key restrictions are configured.";
//   }

//   return "Could not search nearby places. Check your API key, Places API configuration, and internet connection.";
// }

// export function useNearbyPlaces() {
//   const [places, setPlaces] = useState<NearbyPlace[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const requestId = useRef(0);

//   const search = useCallback(
//     async (
//       center: google.maps.LatLngLiteral,
//       radius: number,
//       category: PlaceCategory,
//     ): Promise<boolean> => {
//       const currentRequest = ++requestId.current;

//       setLoading(true);
//       setError("");
//       setPlaces([]);

//       try {
//         const results = await searchNearbyPlaces(center, radius, category);

//         if (currentRequest !== requestId.current) return false;

//         setPlaces(results);
//         return results.length === 0;
//       } catch (err) {
//         if (currentRequest !== requestId.current) return false;

//         console.error("Nearby Places search failed:", err);
//         setPlaces([]);
//         setError(getSearchErrorMessage(err));
//         return false;
//       } finally {
//         if (currentRequest === requestId.current) {
//           setLoading(false);
//         }
//       }
//     },
//     [],
//   );

//   return { places, loading, error, search };
// }

import { useCallback, useRef, useState } from "react";
import { searchNearbyPlaces } from "../services/placesService";
import type { NearbyPlace, PlaceCategory } from "../types/place";

function getSearchErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (/RESOURCE_EXHAUSTED|quota exceeded/i.test(error.message)) {
      return "Google Places search quota has been exceeded. Check your Places API quota and billing.";
    }

    if (/REQUEST_DENIED|API_KEY_INVALID|not authorized/i.test(error.message)) {
      return "Google Places rejected this API key. Check your API configuration.";
    }
  }

  return "Could not search nearby places. Check your API key and internet connection.";
}

export function useNearbyPlaces() {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const search = useCallback(
    async (
      center: google.maps.LatLngLiteral,
      radius: number,
      category: PlaceCategory,
    ): Promise<boolean> => {
      const currentRequest = ++requestId.current;

      setLoading(true);
      setError("");
      setPlaces([]);

      try {
        const results = await searchNearbyPlaces(center, radius, category);

        if (currentRequest !== requestId.current) {
          return false;
        }

        setPlaces(results);

        // true means the search returned no nearby places.
        return results.length === 0;
      } catch (err) {
        if (currentRequest !== requestId.current) {
          return false;
        }

        console.error("Nearby Places search failed:", err);
        setPlaces([]);
        setError(getSearchErrorMessage(err));

        return false;
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  return { places, loading, error, search };
}
