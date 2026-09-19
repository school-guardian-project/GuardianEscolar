package gps_backend.parser;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import gps_backend.model.GpsLbsData;

@Component
public class GpsLbsParser {

    public GpsLbsData parse(byte[] data, int length, String imei) {

        if (data == null || length < 22) {
            System.err.println("Paquete LBS demasiado corto.");
            return null;
        }

        int protocol = data[3] & 0xFF;

        if (protocol != 0x50) {
            System.err.println("El paquete no es protocolo 0x50.");
            return null;
        }

        System.out.println();
        System.out.println("========== ANALISIS 0x50 ==========");
        System.out.println("Longitud recibida: " + length);
        System.out.println();

        System.out.println("INDICE | HEX | DECIMAL");
        System.out.println("-----------------------");

        for (int i = 0; i < length; i++) {
            int value = data[i] & 0xFF;

            System.out.printf(
                    "%6d | %02X  | %7d%n",
                    i,
                    value,
                    value
            );
        }

        System.out.println("-----------------------------------");

        try {

            int year = 2000 + bcdToDecimal(data[4]);
            int month = bcdToDecimal(data[5]);
            int day = bcdToDecimal(data[6]);
            int hour = bcdToDecimal(data[7]);
            int minute = bcdToDecimal(data[8]);
            int second = bcdToDecimal(data[9]);

            LocalDateTime dateTime = LocalDateTime.of(
                    year,
                    month,
                    day,
                    hour,
                    minute,
                    second
            );

            int ta = data[10] & 0xFF;
            int mcc = readUnsignedShort(data, 11);
            int mnc = data[13] & 0xFF;

            int lac = readUnsignedShort(data, 14);
            long cellId = readUnsignedInt(data, 16);
            int signalStrength = data[20] & 0xFF;

            GpsLbsData lbs = new GpsLbsData();

            lbs.setImei(imei);
            lbs.setDateTime(dateTime);
            lbs.setTa(ta);
            lbs.setMcc(mcc);
            lbs.setMnc(mnc);
            lbs.setLac(lac);
            lbs.setCellId(cellId);
            lbs.setSignalStrength(signalStrength);
            lbs.setStatus("ACTIVE");

            System.out.println();
            System.out.println("========== LBS 0x50 ==========");
            System.out.println("IMEI: " + lbs.getImei());
            System.out.println("Fecha/hora: " + lbs.getDateTime());
            System.out.println("TA: " + lbs.getTa());
            System.out.println("MCC: " + lbs.getMcc());
            System.out.println("MNC: " + lbs.getMnc());
            System.out.println("LAC: " + lbs.getLac());
            System.out.println("Cell ID: " + lbs.getCellId());
            System.out.println("Signal: " + lbs.getSignalStrength());
            System.out.println("Estado: " + lbs.getStatus());
            System.out.println("==============================");

            return lbs;

        } catch (Exception e) {

            System.err.println(
                    "Error procesando paquete LBS 0x50: "
                    + e.getMessage()
            );

            return null;
        }
    }

    private int readUnsignedShort(byte[] data, int index) {

        return ((data[index] & 0xFF) << 8)
                | (data[index + 1] & 0xFF);
    }

    private long readUnsignedInt(byte[] data, int index) {

        return ((long) (data[index] & 0xFF) << 24)
                | ((long) (data[index + 1] & 0xFF) << 16)
                | ((long) (data[index + 2] & 0xFF) << 8)
                | (long) (data[index + 3] & 0xFF);
    }

    private int bcdToDecimal(byte value) {

        int high = (value >> 4) & 0x0F;
        int low = value & 0x0F;

        return high * 10 + low;
    }
}