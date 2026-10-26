import type { NearbyPlace, PlaceCategory } from "../types/place";
import { PLACE_CATEGORIES } from "../types/place";

function validateSearch(
  center: google.maps.LatLngLiteral,
  radius: number,
  category: PlaceCategory,
) {
  if (
    !Number.isFinite(center.lat) ||
    center.lat < -90 ||
    center.lat > 90 ||
    !Number.isFinite(center.lng) ||
    center.lng < -180 ||
    center.lng > 180
  ) {
    throw new Error("INVALID_SEARCH_LOCATION");
  }

  if (!Number.isFinite(radius) || radius < 500 || radius > 50000) {
    throw new Error("INVALID_SEARCH_RADIUS");
  }

  if (!PLACE_CATEGORIES.some((item) => item.value === category)) {
    throw new Error("INVALID_SEARCH_CATEGORY");
  }
}

export async function searchNearbyPlaces(
  center: google.maps.LatLngLiteral,
  radius: number,
  category: PlaceCategory,
): Promise<NearbyPlace[]> {
  validateSearch(center, radius, category);

  const { Place } = (await google.maps.importLibrary(
    "places",
  )) as google.maps.PlacesLibrary;

  const { places = [] } = await Place.searchNearby({
    fields: [
      "id",
      "displayName",
      "formattedAddress",
      "location",
      "primaryType",
      "types",
      "googleMapsURI",
    ],
    locationRestriction: {
      center,
      radius,
    },
    includedPrimaryTypes: [category],
    maxResultCount: 20,
    rankPreference: "DISTANCE",
  });

  return places.flatMap((place): NearbyPlace[] => {
    if (!place.id || !place.location) return [];

    const position = {
      lat: place.location.lat(),
      lng: place.location.lng(),
    };

    return [
      {
        id: place.id,
        name: place.displayName ?? "Unnamed place",
        address: place.formattedAddress ?? "Address unavailable",
        position,
        category,
        googleMapsURI: place.googleMapsURI ?? undefined,
      },
    ];
  });
}
