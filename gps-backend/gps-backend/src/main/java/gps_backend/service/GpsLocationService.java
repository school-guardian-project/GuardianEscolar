package gps_backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import gps_backend.model.GpsLocation;

@Service
public class GpsLocationService {

    private final Map<String, List<GpsLocation>> locations =
            new ConcurrentHashMap<>();

    public void save(GpsLocation location) {

        locations
                .computeIfAbsent(
                        location.getImei(),
                        key -> new ArrayList<>()
                )
                .add(location);
    }

    public GpsLocation getLatest(String imei) {

        List<GpsLocation> gpsLocations =
                locations.get(imei);

        if (gpsLocations == null
                || gpsLocations.isEmpty()) {

            return null;
        }

        return gpsLocations.get(
                gpsLocations.size() - 1
        );
    }

    public List<GpsLocation> getHistory(String imei) {

        return locations.getOrDefault(
                imei,
                new ArrayList<>()
        );
    }
}