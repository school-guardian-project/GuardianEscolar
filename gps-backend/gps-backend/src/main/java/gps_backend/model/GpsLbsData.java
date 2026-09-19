package gps_backend.model;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GpsLbsData {

    private String imei;
    private LocalDateTime dateTime;

    private int ta;
    private int mcc;
    private int mnc;

    private int lac;
    private long cellId;
    private int signalStrength;

    private String status;

    @Override
    public String toString() {
        return "GpsLbsData{" +
                "imei='" + imei + '\'' +
                ", dateTime=" + dateTime +
                ", ta=" + ta +
                ", mcc=" + mcc +
                ", mnc=" + mnc +
                ", lac=" + lac +
                ", cellId=" + cellId +
                ", signalStrength=" + signalStrength +
                ", status='" + status + '\'' +
                '}';
    }
}