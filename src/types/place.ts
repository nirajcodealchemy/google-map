export type PlaceCategory = "restaurant" | "cafe" | "hospital" | "atm";

export interface NearbyPlace {
  id: string;
  name: string;
  address: string;
  position: google.maps.LatLngLiteral;
  category: PlaceCategory;
  googleMapsURI?: string;
}

export const PLACE_CATEGORIES: {
  label: string;
  value: PlaceCategory;
}[] = [
  { label: "Restaurants", value: "restaurant" },
  { label: "Cafes", value: "cafe" },
  { label: "Hospitals", value: "hospital" },
  { label: "ATMs", value: "atm" },
];
