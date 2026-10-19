import { useCallback, useEffect, useRef, useState } from "react";
import { GPS_CONFIG } from "@core/config/gps";
import { getCurrentVehicleLocation } from "@core/services/GpsService";

const DEFAULT_FALLBACK_LOCATION = {
  latitude: 2.9273,
  longitude: -75.2819,
};

export default function useGpsTracking(imei = GPS_CONFIG.imei, enabled = true) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const trackingSessionRef = useRef(0);
  const locationRef = useRef(null);

  const scheduleNextPoll = useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchLocation();
    }, GPS_CONFIG.pollingIntervalMs);
  }, [imei]);

  const fetchLocation = useCallback(async () => {
    if (!imei || inFlightRef.current) {
      return;
    }

    const trackingSession = trackingSessionRef.current;
    inFlightRef.current = true;
    console.log("[GPS] Poll started for IMEI:", imei);

    try {
      setLoading(true);

      const data = await getCurrentVehicleLocation(imei, GPS_CONFIG.baseUrl);

      if (!isMountedRef.current || trackingSession !== trackingSessionRef.current) {
        return;
      }

      const previousTimestamp = Date.parse(
        locationRef.current?.receivedAt || locationRef.current?.gpsDateTime || locationRef.current?.dateTime || ""
      );
      const incomingTimestamp = Date.parse(
        data.receivedAt || data.gpsDateTime || data.dateTime || ""
      );
      const isOlderLocation =
        Number.isFinite(previousTimestamp) &&
        Number.isFinite(incomingTimestamp) &&
        incomingTimestamp < previousTimestamp;

      if (isOlderLocation) {
        console.warn("[GPS] Ignored an older location response.");
        return;
      }

      locationRef.current = data;
      setLocation(data);
      setError("");
      setLastUpdated(data.gpsDateTime || data.dateTime || data.receivedAt || null);
      console.log("[GPS] State updated:", data);
    } catch (fetchError) {
      if (!isMountedRef.current || trackingSession !== trackingSessionRef.current) {
        return;
      }

      setError(fetchError?.message || "Error al obtener ubicación.");
      console.error("[GPS] Poll failed:", fetchError);
    } finally {
      if (!isMountedRef.current || trackingSession !== trackingSessionRef.current) {
        return;
      }

      setLoading(false);
      inFlightRef.current = false;
      scheduleNextPoll();
    }
  }, [imei, scheduleNextPoll]);

  useEffect(() => {
    isMountedRef.current = true;

    trackingSessionRef.current += 1;

    if (!enabled) {
      setLoading(false);
      return () => {
        isMountedRef.current = false;
        inFlightRef.current = false;
      };
    }

    fetchLocation();

    return () => {
      isMountedRef.current = false;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      inFlightRef.current = false;
    };
  }, [enabled, fetchLocation]);

  return {
    location: location || null,
    fallbackLocation: DEFAULT_FALLBACK_LOCATION,
    loading,
    error,
    lastUpdated,
    refresh: fetchLocation,
  };
}
