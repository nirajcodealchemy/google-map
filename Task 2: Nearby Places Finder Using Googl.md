Task 2: Nearby Places Finder Using Google Maps
Objective
Build a responsive Nearby Places Finder application that allows users to search for locations and discover nearby places, such as restaurants, cafes, hospitals, and ATMs, using Google Maps and the relevant Google Places APIs.
The application should provide synchronized map and list views, allowing users to explore and filter nearby places interactively.
Functional Requirements
Display an interactive Google Map with a default location.
Provide a search input that supports place autocomplete.
Allow users to select a location and use it as the reference point for nearby searches.
Allow users to search for nearby restaurants, cafes, hospitals, and ATMs.
Display the search results as markers on the map.
Display the same search results in a separate list or side panel.
Show relevant place details, such as name and address, when a marker is selected.
Highlight the corresponding map marker when a user selects a place from the list.
Center the map on the selected place when a user clicks its list item.
Provide category-based filtering for the available place types.
Support distance-based filtering using a configurable search radius.
Display appropriate loading indicators while searching for places.
Handle empty search results, invalid searches, and API errors with appropriate messages.
Ensure the map, search interface, filters, and results list work responsively across desktop and mobile devices.
Technical Requirements
Use functional components and React Hooks.
Implement a clear and reusable component architecture.
Manage search criteria, selected locations, filters, and map interactions using appropriate state management.
Use Google Maps JavaScript API and the relevant Places API functionality.
Configure API keys using environment variables and apply appropriate API key restrictions.
Avoid unnecessary API requests and duplicate map initialization.
Handle asynchronous operations, loading states, and errors appropriately.
Keep the map markers and results list synchronized.
Ensure proper cleanup of event listeners and other resources where applicable.
Deliverables
A fully functional Nearby Places Finder application.
Source code in a Git repository.
A README file containing setup instructions and required API configuration.
An example environment configuration file without actual secrets.
Screenshots demonstrating search, filtering, map markers, and place selection.
A brief explanation of the component structure and state management approach.
Acceptance Criteria
The task will be considered complete when users can search for a location, discover and filter nearby places, view the results on both the map and list, and navigate between results without synchronization issues. Loading, empty-result, and API error states must also work correctly.
Optional Enhancements
Add a button to search near the user's current location, with permission handling.
Implement marker clustering when many places are displayed.
Preserve search filters and selected locations in URL query parameters.
Add unit tests for filtering and selection logic.
