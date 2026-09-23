package gps_backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import gps_backend.model.GpsLocation;
import gps_backend.model.PositionType;

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

        System.out.println(
                "Ubicación guardada como "
                        + location.getPositionType()
                        + " para "
                        + location.getImei()
        );
    }

    public GpsLocation getLatest(String imei) {

        List<GpsLocation> gpsLocations =
                locations.get(imei);

        if (gpsLocations == null
                || gpsLocations.isEmpty()) {

            return null;
        }

                for (int i = gpsLocations.size() - 1; i >= 0; i--) {
                        GpsLocation location = gpsLocations.get(i);

                        if (location.getPositionType() == PositionType.REAL_TIME) {
                                return location;
                        }
                }

                return gpsLocations.get(gpsLocations.size() - 1);
    }

    public List<GpsLocation> getHistory(String imei) {

        return locations.getOrDefault(
                imei,
                new ArrayList<>()
        );
    }
}