# Implementation Plan: GPS Route Tracing

## Overview
Add real-time GPS route tracing to the Guardian Escolar mobile app by accumulating vehicle position coordinates and rendering them as a polyline on the map. The implementation modifies three existing files without changing existing GPS functionality, polling intervals, or backend communication.

## Files to Modify

### 1. `src/features/gps/hooks/useGpsTracking.js`
**Current state**: Stores only the latest location object in state. Polls backend every 10 seconds via `getCurrentVehicleLocation`.

**Changes needed**:
- Add `routeCoordinates` state (`useState([])`) to accumulate `{ latitude, longitude }` objects
- Add `resetRoute` function to clear accumulated coordinates (for future route management)
- Modify successful poll handler to validate and append new coordinates to the route
- Return `routeCoordinates` and `resetRoute` alongside existing return values

**Coordinate validation rules**:
- Both latitude and longitude must be finite numbers (`Number.isFinite()`)
- Latitude must be in range [-90, 90]
- Longitude must be in range [-180, 180]
- Skip coordinate if identical to last appended point (latitude and longitude match within 0.00001 tolerance)

**Deduplication logic**:
```javascript
const lastCoord = routeCoordinates[routeCoordinates.length - 1];
if (lastCoord && 
    Math.abs(lastCoord.latitude - latitude) < 0.00001 && 
    Math.abs(lastCoord.longitude - longitude) < 0.00001) {
  return; // Skip duplicate position
}
```

**Out-of-order protection**: Reuse existing `isOlderLocation` check (compares timestamps) to prevent adding coordinates from delayed responses.

### 2. `src/features/gps/components/GpsMap.jsx`
**Current state**: Renders `MapView` with `Marker` only. Imports `Marker` from `react-native-maps`.

**Changes needed**:
- Update import: `import MapView, { Marker, Polyline } from "react-native-maps";`
- Add `routeCoordinates` prop with default value `[]`
- Render `<Polyline>` component when `routeCoordinates.length >= 2`
- Keep all existing Marker logic and `useImperativeHandle` unchanged

**Polyline props**:
```javascript
<Polyline
  coordinates={routeCoordinates}
  strokeColor="#1A56DB"
  strokeWidth={3}
  lineCap="round"
  lineJoin="round"
/>
```

**Placement**: Render Polyline inside MapView but before Marker (so line appears below bus icon).

### 3. `src/features/gps/views/LiveTracking/LiveTracking.jsx`
**Current state**: Calls `useGpsTracking()`, destructures `{ location, error, loading, lastUpdated, fallbackLocation }`, passes `location` to `GpsMap`.

**Changes needed**:
- Destructure `routeCoordinates` from `useGpsTracking()` return value
- Pass `routeCoordinates={routeCoordinates}` to `<GpsMap>` component
- No other changes to UI or logic

## Verification Steps

### 1. Build verification
```bash
cd c:\Users\ROJAS\Desktop\ADSO\Guardian Escolar\dvlp-front\dvlp-movil\guardian-escolar
npm start
```

**Expected**: App compiles without errors. Metro bundler starts successfully.

### 2. Static verification (manual)
- Open `LiveTracking.jsx` in editor, confirm `routeCoordinates` is destructured and passed to `GpsMap`
- Open `GpsMap.jsx`, confirm `Polyline` is imported and rendered conditionally
- Open `useGpsTracking.js`, confirm `routeCoordinates` state exists and coordinates are appended with validation

### 3. Runtime verification (requires GPS data)
**Prerequisite**: Backend must be running with GPS device sending positions.

**Test sequence**:
1. Launch app, navigate to Live Tracking screen
2. Wait for initial location marker to appear (existing functionality)
3. As vehicle moves and new positions arrive (every 10 seconds), observe:
   - Marker updates position (existing)
   - Blue polyline appears after second distinct position
   - Line extends with each new distinct position
   - Line does not extend when position hasn't changed
   - Line maintains chronological order of positions

### 4. Coordinate validation test cases
The hook should handle:
- Invalid coordinates (NaN, null, undefined) → skip
- Out-of-range latitude (e.g., 91) → skip  
- Out-of-range longitude (e.g., -181) → skip
- Identical coordinates → skip (no duplicate points)
- Valid coordinates → append to route

## Dependencies & Constraints
- **No new dependencies**: `react-native-maps` already provides `Polyline`
- **No backend changes**: Uses existing `/api/gps/devices/{imei}/location` endpoint
- **No polling changes**: Maintains 10-second interval from `GPS_CONFIG.pollingIntervalMs`
- **No protocol changes**: TCP port 8842 and Kong configuration remain unchanged
- **Existing functionality preserved**: Vehicle marker, map controls, status display all remain

## Implementation Order
1. **First**: Modify `useGpsTracking.js` to accumulate route coordinates with validation
2. **Second**: Update `GpsMap.jsx` to import and render Polyline
3. **Third**: Update `LiveTracking.jsx` to pass routeCoordinates to GpsMap
4. **Fourth**: Test build and verify no regressions

## Edge Cases
- **Empty routeCoordinates**: Polyline not rendered (requires ≥2 points)
- **Single coordinate**: No line drawn (needs at least 2 points to form a segment)
- **App restart**: Route resets (coordinates stored in React state, not persisted)
- **Multiple vehicles**: Currently single IMEI configuration; route corresponds to configured vehicle
- **GPS signal loss**: Polling continues; invalid positions skipped; valid positions resume line when signal returns

## Notes
- Line color (#1A56DB) matches bus marker blue for visual consistency
- Stroke width 3px provides clear visibility without obscuring map details
- Round line caps/joins create smooth appearance for GPS trajectory
- Coordinate validation prevents drawing invalid or impossible positions
- Deduplication reduces visual noise from stationary vehicle positions