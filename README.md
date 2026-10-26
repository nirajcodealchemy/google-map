# Nearby Places Finder

A responsive React application for finding restaurants, cafes, hospitals, and
ATMs near a selected location. Search results stay synchronized between the
map markers and the results list.

## Requirements

- Node.js 20.19+ or 22.12+
- A Google Maps Platform project with billing enabled
- A Google Maps API key with **Maps JavaScript API** and **Places API (New)**
  enabled

## Setup

```sh
npm install
cp .env.example .env
```

Set `VITE_GOOGLE_MAPS_API_KEY` in `.env`, then start the development server:

```sh
npm run dev
```

The key is used by a browser application and is visible to users. Restrict it
in Google Cloud Console to the Maps JavaScript API and Places API (New), and
configure website HTTP referrers for your local development and deployed
domains. Do not commit `.env`.

## Using the finder

1. Search for a city, address, or landmark and select one of Google's
   autocomplete suggestions to set the search center.
2. Choose a category and search radius. Selecting a category or adjusting the
   radius starts a new nearby search.
3. Select a result in the list or click its marker to see its name and address.
   Selecting a list item centers and zooms the map to that place.
4. On small screens, use the Results and Map tabs to switch views. The
   **Use my location** button searches from the browser's current location
   after permission is granted.

The interface shows loading, empty-result, and API/search error states. Google
Maps API failures can also be caused by disabled APIs, billing, or incorrect
key restrictions.

## Components and state

- `src/App.tsx` owns the search center, category, radius, selected place, and
  map state. It coordinates location selection, searches, and mobile tabs.
- `src/components/LocationSearch.tsx` uses the Places API's
  `PlaceAutocompleteElement` to select a search center.
- `src/components/CategoryFilters.tsx` and
  `src/components/NearbyPlacesList.tsx` render category filters and selectable
  results.
- `src/components/GoogleMapView.tsx` renders markers and the selected-place
  info window.
- `src/hooks/useNearbyPlaces.ts` manages loading, errors, and stale-request
  protection. `src/services/placesService.ts` calls Places API nearby search
  and maps results to the app's place type.

## Validation

```sh
npm run build
npm run lint
```

Screenshots require a valid, referrer-restricted Google Maps key and are not
committed because map tiles and search results depend on live Google services.
