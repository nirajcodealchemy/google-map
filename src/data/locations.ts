import type { MapLocation } from "../types/location";

export const SURAT_CENTER: google.maps.LatLngLiteral = {
  lat: 21.1702,
  lng: 72.8311,
};

export const INITIAL_ZOOM = 12;

export const SURAT_LOCATIONS: MapLocation[] = [
  {
    id: "station",
    name: "Surat Railway Station",
    address: "Railway Station Road, Surat, Gujarat, India",
    position: { lat: 21.2049, lng: 72.8406 },
    category: "Transport",
  },
  {
    id: "dumas",
    name: "Dumas Beach",
    address: "Dumas, Surat, Gujarat, India",
    position: { lat: 21.0872, lng: 72.7156 },
    category: "Beach",
  },
  {
    id: "science",
    name: "Science Centre",
    address: "City Light Road, Surat, Gujarat, India",
    position: { lat: 21.1702, lng: 72.7985 },
    category: "Attraction",
  },
  {
    id: "gopi",
    name: "Gopi Talav",
    address: "Rustampura, Surat, Gujarat, India",
    position: { lat: 21.1886, lng: 72.8293 },
    category: "Attraction",
  },
  {
    id: "sarthana",
    name: "Sarthana Nature Park",
    address: "Sarthana Jakat Naka, Surat, Gujarat, India",
    position: { lat: 21.2307, lng: 72.9002 },
    category: "Nature",
  },
  {
    id: "vr",
    name: "VR Surat",
    address: "Dumas Road, Magdalla, Surat, Gujarat, India",
    position: { lat: 21.1448, lng: 72.75759 },
    category: "Shopping",
  },
];
