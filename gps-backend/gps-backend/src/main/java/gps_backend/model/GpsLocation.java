package gps_backend.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GpsLocation {

    private String imei;
    private double latitude;
    private double longitude;
    private double speed;
    private double course;
    private LocalDateTime dateTime;
    private String status;

    public GpsLocation() {
    }

    public GpsLocation(
            String imei,
            double latitude,
            double longitude,
            double speed,
            double course,
            LocalDateTime dateTime,
            String status) {

        this.imei = imei;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
        this.course = course;
        this.dateTime = dateTime;
        this.status = status;
    }

    @Override
    public String toString() {
        return "GpsLocation{" +
                "imei='" + imei + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", speed=" + speed +
                ", course=" + course +
                ", dateTime=" + dateTime +
                ", status='" + status + '\'' +
                '}';
    }
}