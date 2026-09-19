package gps_backend.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GpsDevice {

    private String imei;
    private boolean gpsStatus;
    private LocalDateTime lastConnection;

    public GpsDevice() {
    }

    public GpsDevice(
            String imei,
            boolean gpsStatus,
            LocalDateTime lastConnection) {

        this.imei = imei;
        this.gpsStatus = gpsStatus;
        this.lastConnection = lastConnection;
    }

    @Override
    public String toString() {
        return "GpsDevice{" +
                "imei='" + imei + '\'' +
                ", gpsStatus=" + gpsStatus +
                ", lastConnection=" + lastConnection +
                '}';
    }
}