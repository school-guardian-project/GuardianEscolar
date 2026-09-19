package gps_backend.parser;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import gps_backend.model.GpsLocation;

@Component
public class GpsPacketParser {

    /**
     Analiza un paquete de ubicación 0x31.
     
      Estructura utilizada:
      78 78
      LENGTH
      PROTOCOL
      DATE 6
      GPS INFO 1
      LAT 4
      LON 4
      SPEED 1
      COURSE/STATUS 2
     */
    public GpsLocation parseLocation(
            byte[] data,
            int length,
            String imei) {

        if (data == null || length < 22) {
            return null;
        }

        int protocol = data[3] & 0xFF;

        if (protocol != 0x31) {
            return null;
        }

        // FECHA Y HORA

        int year = 2000 + bcdToDecimal(data[4]);
        int month = bcdToDecimal(data[5]);
        int day = bcdToDecimal(data[6]);
        int hour = bcdToDecimal(data[7]);
        int minute = bcdToDecimal(data[8]);
        int second = bcdToDecimal(data[9]);

        LocalDateTime dateTime;

        try {
            dateTime = LocalDateTime.of(
                    year,
                    month,
                    day,
                    hour,
                    minute,
                    second
            );
        } catch (Exception e) {
            System.err.println(
                    "Fecha GPS inválida: "
                            + e.getMessage()
            );
            return null;
        }

  
        // GPS INFO

        int gpsInfo = data[10] & 0xFF;

        // Los 4 bits inferiores representan
        // el número de satélites.
        int satellites = gpsInfo & 0x0F;

        // LATITUD
        long latitudeRaw = readUnsignedInt(
                data,
                11
        );

        double latitude =
                latitudeRaw / 1800000.0;

        // LONGITUD


        long longitudeRaw = readUnsignedInt(
                data,
                15
        );

        double longitude =
                longitudeRaw / 1800000.0;

        if (longitude > 0) {
            longitude = -longitude;
        }

        // VELOCIDAD

        double speed = data[19] & 0xFF;

        // CURSO
        int courseStatus =
                ((data[20] & 0xFF) << 8)
                        | (data[21] & 0xFF);

        int course = courseStatus & 0x03FF;


        // CREAR MODELO


        GpsLocation location = new GpsLocation();

        location.setImei(imei);
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setSpeed(speed);
        location.setCourse(course);
        location.setDateTime(dateTime);
        location.setStatus("ACTIVE");

        System.out.println();
        System.out.println(
                "========== GPS LOCATION =========="
        );

        System.out.println(
                "IMEI: " + imei
        );

        System.out.println(
                "Fecha: " + dateTime
        );

        System.out.printf(
                "Latitud: %.6f%n",
                latitude
        );

        System.out.printf(
                "Longitud: %.6f%n",
                longitude
        );

        System.out.println(
                "Velocidad: " + speed + " km/h"
        );

        System.out.println(
                "Curso: " + course + "°"
        );

        System.out.println(
                "Satélites: " + satellites
        );

        System.out.println(
                "=================================="
        );

        return location;
    }

    private long readUnsignedInt(
            byte[] data,
            int index) {

        return ((long) (data[index] & 0xFF) << 24)
                | ((long) (data[index + 1] & 0xFF) << 16)
                | ((long) (data[index + 2] & 0xFF) << 8)
                | ((long) (data[index + 3] & 0xFF));
    }

    private int bcdToDecimal(byte value) {

        int b = value & 0xFF;

        return ((b >> 4) * 10)
                + (b & 0x0F);
    }
}