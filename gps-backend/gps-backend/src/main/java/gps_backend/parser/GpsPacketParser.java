package gps_backend.parser;

import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;

import gps_backend.model.GpsLocation;
import gps_backend.model.GpsTimestampStatus;
import gps_backend.model.PositionType;

@Component
public class GpsPacketParser {

    public static final ZoneOffset VT03F_UTC = ZoneOffset.UTC;
        private static final ZoneId COLOMBIA_ZONE = ZoneId.of("America/Bogota");
        private static final DateTimeFormatter DISPLAY_FORMAT =
                        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public GpsLocation parseLocation(
            byte[] data,
            int length,
            String imei) {

        return parseLocation(data, length, imei, null);
    }

    public GpsLocation parseLocation(
            byte[] data,
            int length,
            String imei,
            Instant receivedAt) {

        if (data == null || length < 22) {
            return null;
        }

        int protocol = data[3] & 0xFF;

        if (protocol != 0x31) {
            return null;
        }

        OffsetDateTime gpsDateTime = parseGpsDate(data, 4, "0x31");

        if (gpsDateTime == null) {
            return null;
        }

        int gpsInfo = data[10] & 0xFF;
        int satellites = gpsInfo & 0x0F;

        long latitudeRaw = readUnsignedInt(data, 11);
        double latitude = latitudeRaw / 1800000.0;

        long longitudeRaw = readUnsignedInt(data, 15);
        double longitude = longitudeRaw / 1800000.0;

        if (longitude > 0) {
            longitude = -longitude;
        }

        double speed = data[19] & 0xFF;

        int courseStatus =
                ((data[20] & 0xFF) << 8)
                        | (data[21] & 0xFF);

        int course = courseStatus & 0x03FF;

        PositionType positionType = detectPositionType(data, length);

        GpsLocation location = new GpsLocation();

        GpsTimestampStatus timestampStatus = determineTimestampStatus(gpsDateTime.toInstant(), receivedAt);

        location.setImei(imei);
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setSpeed(speed);
        location.setCourse(course);
        location.setDateTime(gpsDateTime);
        location.setGpsDateTime(gpsDateTime.toInstant());
        location.setReceivedAt(receivedAt);
        location.setTimestampStatus(timestampStatus);
        location.setStatus("ACTIVE");
        location.setPositionType(positionType);

        printLocation(
                imei,
                gpsDateTime,
                latitude,
                longitude,
                speed,
                course,
                satellites,
                positionType,
                receivedAt,
                timestampStatus
        );

        return location;
    }

    public static OffsetDateTime parseGpsDate(
            byte[] data,
            int startIndex,
            String protocolLabel) {

        if (data == null || data.length < startIndex + 6) {
            throw new IllegalArgumentException(
                    "Paquete GPS incompleto para fecha en " + protocolLabel
            );
        }

        int yy = decodeGpsDateByte(data[startIndex]);
        int mm = decodeGpsDateByte(data[startIndex + 1]);
        int dd = decodeGpsDateByte(data[startIndex + 2]);
        int hh = decodeGpsDateByte(data[startIndex + 3]);
        int mi = decodeGpsDateByte(data[startIndex + 4]);
        int ss = decodeGpsDateByte(data[startIndex + 5]);

        int year = 2000 + yy;

        try {
            return OffsetDateTime.of(
                    year,
                    mm,
                    dd,
                    hh,
                    mi,
                    ss,
                    0,
                    VT03F_UTC
            );
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Fecha GPS inválida para " + protocolLabel + ": "
                            + year + "-" + mm + "-" + dd + " "
                            + hh + ":" + mi + ":" + ss,
                    e
            );
        }
    }

    public void parseAlarm(
            byte[] data,
            int length,
            String imei) {

        parseAlarm(data, length, imei, null);
    }

    public void parseAlarm(
            byte[] data,
            int length,
            String imei,
            Instant receivedAt) {

        if (data == null || length < 10) {
            return;
        }

        int protocol = data[3] & 0xFF;

        if (protocol != 0x32) {
            return;
        }

        System.out.println();
        System.out.println("========== GPS ALARMA ==========");
        System.out.println("IMEI: " + imei);
        System.out.println("Longitud recibida: " + length);

        System.out.println();
        System.out.println("Paquete hexadecimal:");

        printHex(data, length);

        System.out.println();
        System.out.println("ÍNDICE | HEX | DECIMAL");
        System.out.println("-----------------------");

        for (int i = 0; i < length; i++) {

            int value = data[i] & 0xFF;

            System.out.printf(
                    "%5d | %02X  | %7d%n",
                    i,
                    value,
                    value
            );
        }

        System.out.println();
        System.out.println(
                "Protocolo: 0x"
                        + String.format("%02X", protocol)
        );

        System.out.println();
        System.out.println(
                "Primeros 6 bytes después del protocolo:"
        );

        for (int i = 4; i <= 9 && i < length; i++) {

            int value = data[i] & 0xFF;

            System.out.printf(
                    "data[%d] = %02X%n",
                    i,
                    value
            );
        }

        if (length >= 10) {
            OffsetDateTime gpsTimestamp = parseGpsDate(data, 4, "0x32");

            System.out.println();
            System.out.println(
                    "Interpretación UTC de data[4..9]:"
            );

            System.out.println(
                    "GPS date: " + gpsTimestamp + " (UTC)"
            );
            System.out.println(
                    "Colombia: " + gpsTimestamp.withOffsetSameInstant(ZoneOffset.of("-05:00"))
            );
            System.out.println(
                    "Server received Colombia: "
                            + formatColombiaTime(receivedAt)
            );
            System.out.println(
                    "Timestamp status: " + determineTimestampStatus(
                            gpsTimestamp.toInstant(),
                            receivedAt
                    )
            );
        }

        System.out.println();
        System.out.println("================================");
    }

    private void printLocation(
            String imei,
            OffsetDateTime dateTime,
            double latitude,
            double longitude,
            double speed,
            int course,
            int satellites,
            PositionType positionType,
            Instant receivedAt,
            GpsTimestampStatus timestampStatus) {

        System.out.println();
        System.out.println("========== GPS 0x31 ==========");
        System.out.println("IMEI: " + imei);
        System.out.println("GPS date: " + dateTime + " (UTC)");
        System.out.println("Colombia: " + dateTime.withOffsetSameInstant(ZoneOffset.of("-05:00")));
        System.out.println(
                "Server received Colombia: "
                        + formatColombiaTime(receivedAt)
        );
        System.out.println("Timestamp status: " + timestampStatus);

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
                "Tipo de posición: " + positionType
        );

        System.out.println("==================================");
    }

    public static GpsTimestampStatus determineTimestampStatus(
            Instant gpsDateTime,
            Instant receivedAt) {

        if (gpsDateTime == null || receivedAt == null) {
            return GpsTimestampStatus.INVALID;
        }

        Duration difference = Duration.between(gpsDateTime, receivedAt);
        long seconds = Math.abs(difference.getSeconds());

        if (seconds <= 300) {
            return GpsTimestampStatus.VALID;
        }

        return GpsTimestampStatus.STALE;
    }

        private static String formatColombiaTime(Instant instant) {
                if (instant == null) {
                        return "NO DISPONIBLE";
                }

                return instant.atZone(COLOMBIA_ZONE).format(DISPLAY_FORMAT);
        }

    private PositionType detectPositionType(
            byte[] data,
            int length) {

        // 0x31 variants with the standard upload extension have three bytes
        // immediately before serial, CRC and the 0D 0A footer.
        int extensionStart = length - 9;
        int reUploadIndex = length - 7;

        if (extensionStart >= 22
                && length >= 31
                && isStandardFrameLength(data, length)) {

            int uploadMode = data[extensionStart + 1] & 0xFF;
            int reUpload = data[reUploadIndex] & 0xFF;

            System.out.printf(
                    "Extensión 0x31: uploadMode=data[%d]=0x%02X, "
                            + "reUpload=data[%d]=0x%02X%n",
                    extensionStart + 1,
                    uploadMode,
                    reUploadIndex,
                    reUpload
            );

            return reUpload == 0
                    ? PositionType.REAL_TIME
                    : PositionType.RE_UPLOAD;
        }

        System.out.println(
                "Tipo de posición: DESCONOCIDO "
                        + "(la trama 0x31 no contiene la extensión "
                        + "upload/re-upload esperada)"
        );

        return PositionType.UNKNOWN;
    }

    private boolean isStandardFrameLength(
            byte[] data,
            int length) {

        return length >= 5
                && (data[0] & 0xFF) == 0x78
                && (data[1] & 0xFF) == 0x78
                && ((data[2] & 0xFF) + 5) == length
                && (data[length - 2] & 0xFF) == 0x0D
                && (data[length - 1] & 0xFF) == 0x0A;
    }

    private long readUnsignedInt(
            byte[] data,
            int index) {

        return ((long) (data[index] & 0xFF) << 24)
                | ((long) (data[index + 1] & 0xFF) << 16)
                | ((long) (data[index + 2] & 0xFF) << 8)
                | ((long) (data[index + 3] & 0xFF));
    }

    private static int decodeGpsDateByte(byte value) {
        int decoded = value & 0xFF;

        if (decoded < 0 || decoded > 99) {
            throw new IllegalArgumentException(
                    "Byte de fecha GPS fuera de rango: 0x"
                            + String.format("%02X", value)
            );
        }

        return decoded;
    }

    private void printHex(
            byte[] data,
            int length) {

        for (int i = 0; i < length; i++) {

            System.out.printf(
                    "%02X ",
                    data[i] & 0xFF
            );
        }

        System.out.println();
    }
}

