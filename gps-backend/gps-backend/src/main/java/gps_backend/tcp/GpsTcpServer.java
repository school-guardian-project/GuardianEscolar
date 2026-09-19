package gps_backend.tcp;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import gps_backend.model.GpsLbsData;
import gps_backend.model.GpsLocation;
import gps_backend.parser.GpsLbsParser;
import gps_backend.parser.GpsPacketParser;
import gps_backend.service.GpsDeviceService;
import gps_backend.service.GpsLocationService;

@Component
public class GpsTcpServer {

    private static final int PORT = 8842;

    private final GpsLocationService gpsLocationService;
    private final GpsDeviceService gpsDeviceService;
    private final GpsPacketParser gpsPacketParser;
    private final GpsLbsParser gpsLbsParser;

    private final Map<String, Socket> gpsConnections =
            new ConcurrentHashMap<>();

    public GpsTcpServer(
            GpsLocationService gpsLocationService,
            GpsDeviceService gpsDeviceService,
            GpsPacketParser gpsPacketParser,
            GpsLbsParser gpsLbsParser) {

        this.gpsLocationService = gpsLocationService;
        this.gpsDeviceService = gpsDeviceService;
        this.gpsPacketParser = gpsPacketParser;
        this.gpsLbsParser = gpsLbsParser;
    }

    // ============================================================
    // INICIAR SERVIDOR TCP
    // ============================================================

    public void start() {

        Thread serverThread = new Thread(() -> {

            try (ServerSocket serverSocket = new ServerSocket(PORT)) {

                System.out.println();
                System.out.println("=================================");
                System.out.println("   GPS TCP SERVER INICIADO");
                System.out.println("   Puerto: " + PORT);
                System.out.println("=================================");
                System.out.println();

                while (!Thread.currentThread().isInterrupted()) {

                    Socket socket = serverSocket.accept();

                    System.out.println(
                            "GPS conectado desde: "
                            + socket.getRemoteSocketAddress()
                    );

                    Thread gpsThread = new Thread(
                            () -> handleGpsConnection(socket),
                            "gps-client-" + socket.getPort()
                    );

                    gpsThread.start();
                }

            } catch (IOException e) {

                System.err.println(
                        "Error iniciando servidor TCP: "
                        + e.getMessage()
                );
            }

        }, "gps-tcp-server");

        serverThread.start();
    }

    // ============================================================
    // MANEJAR CONEXIÓN GPS
    // ============================================================

    private void handleGpsConnection(Socket socket) {

        String currentImei = null;

        try (
                InputStream inputStream = socket.getInputStream()
        ) {

            byte[] buffer = new byte[4096];

            while (true) {

                int bytesRead = inputStream.read(buffer);

                if (bytesRead == -1) {
                    break;
                }

                if (bytesRead == 0) {
                    continue;
                }

                byte[] data = new byte[bytesRead];

                System.arraycopy(
                        buffer,
                        0,
                        data,
                        0,
                        bytesRead
                );

                System.out.println();
                System.out.println(
                        "Datos recibidos (" + bytesRead + " bytes):"
                );

                System.out.println(bytesToHex(data));

                String detectedImei = processPacket(
                        socket,
                        data,
                        bytesRead,
                        currentImei
                );

                if (detectedImei != null) {

                    currentImei = detectedImei;

                    gpsConnections.put(
                            currentImei,
                            socket
                    );
                }
            }

        } catch (IOException e) {

            System.err.println(
                    "Error en conexión GPS: "
                    + e.getMessage()
            );

        } finally {

            if (currentImei != null) {

                gpsConnections.remove(
                        currentImei,
                        socket
                );
            }

            try {
                socket.close();
            } catch (IOException ignored) {
            }

            System.out.println(
                    "Conexión GPS cerrada: "
                    + socket.getRemoteSocketAddress()
            );
        }
    }

    // ============================================================
    // PROCESAR PAQUETE
    // ============================================================

    private String processPacket(
            Socket socket,
            byte[] data,
            int length,
            String currentImei) {

        if (data == null || length < 5) {
            return currentImei;
        }

        // ========================================================
        // PROTOCOLO 78 78
        // ========================================================

        if ((data[0] & 0xFF) == 0x78
                && (data[1] & 0xFF) == 0x78) {

            int protocol = data[3] & 0xFF;

            switch (protocol) {

                // =================================================
                // LOGIN
                // =================================================

                case 0x01:

                    System.out.println();
                    System.out.println("========== GPS LOGIN ==========");

                    String detectedImei = extractImei(
                            data,
                            length
                    );

                    System.out.println(
                            "IMEI: " + detectedImei
                    );

                    System.out.println(
                            "================================"
                    );

                    try {

                        gpsDeviceService.registerDevice(
                                detectedImei,
                                socket
                        );

                    } catch (Exception e) {

                        System.err.println(
                                "No se pudo registrar GPS: "
                                + e.getMessage()
                        );
                    }

                    sendAck(
                            socket,
                            data,
                            length
                    );

                    return detectedImei;

                // =================================================
                // HEARTBEAT
                // =================================================

                case 0x13:

                    System.out.println(
                            "Heartbeat recibido"
                    );

                    sendAck(
                            socket,
                            data,
                            length
                    );

                    return currentImei;

                // =================================================
                // GPS LOCATION
                // =================================================

                case 0x31:

                    System.out.println();
                    System.out.println(
                            "========== GPS LOCATION =========="
                    );

                    analyzeGpsPacket(
                            data,
                            length
                    );

                    if (currentImei != null) {

                        GpsLocation location =
                                gpsPacketParser.parseLocation(
                                        data,
                                        length,
                                        currentImei
                                );

                        if (location != null) {

                            try {

                                gpsLocationService.save(
                                        location
                                );

                                System.out.println(
                                        "GpsLocation guardada"
                                );

                            } catch (Exception e) {

                                System.err.println(
                                        "Error guardando ubicación: "
                                                + e.getMessage()
                                );
                            }
                        }
                    } else {

                        System.err.println(
                                "No hay IMEI asociado al GPS."
                        );
                    }

                    sendAck(
                            socket,
                            data,
                            length
                    );

                    break;

                // =================================================
                // ALARMA
                // =================================================

                case 0x32:

                    System.out.println();
                    System.out.println(
                            "========== GPS ALARMA =========="
                    );

                    analyzeAlarmPacket(
                            data,
                            length
                    );

                    sendAck(
                            socket,
                            data,
                            length
                    );

                    break;

                // =================================================
                // LBS MULTIPLE BASES
                // =================================================

                case 0x50:

                    System.out.println();
                    System.out.println(
                            "========== PROTOCOLO 0x50 =========="
                    );

                    GpsLbsData lbs =
                            gpsLbsParser.parse(
                                    data,
                                    length,
                                    currentImei
                            );

                    if (lbs != null) {

                        System.out.println(
                                "LBS procesado correctamente."
                        );
                    }

                    sendAck(
                            socket,
                            data,
                            length
                    );

                    break;

                // =================================================
                // COMANDO
                // =================================================

                case 0x80:

                    System.out.println();
                    System.out.println(
                            "========== COMANDO 0x80 =========="
                    );

                    System.out.println(
                            "Comando recibido desde GPS."
                    );

                    sendAck(
                            socket,
                            data,
                            length
                    );

                    break;

                // =================================================
                // DESCONOCIDO
                // =================================================

                default:

                    System.out.println();
                    System.out.println(
                            "Protocolo 0x"
                                    + String.format(
                                            "%02X",
                                            protocol
                                    )
                                    + " no implementado."
                    );

                    break;
            }

            return currentImei;
        }

        // ========================================================
        // PROTOCOLO 79 79
        // ========================================================

        if ((data[0] & 0xFF) == 0x79
                && (data[1] & 0xFF) == 0x79) {

            analyze7979Packet(
                    data,
                    length
            );

            return currentImei;
        }

        // ========================================================
        // HEADER DESCONOCIDO
        // ========================================================

        System.out.println(
                "Header desconocido: "
                        + String.format(
                                "%02X %02X",
                                data[0] & 0xFF,
                                data[1] & 0xFF
                        )
        );

        return currentImei;
    }

    // ============================================================
    // ANALIZAR GPS 0x31
    // ============================================================

    private void analyzeGpsPacket(
            byte[] data,
            int length) {

        if (length < 22) {
            System.out.println(
                    "Paquete GPS demasiado corto."
            );
            return;
        }

        System.out.println(
                "Protocolo: 0x"
                        + String.format(
                                "%02X",
                                data[3] & 0xFF
                        )
        );

        int satellites =
                data[10] & 0x0F;

        long latitudeRaw =
                readUnsignedInt(data, 11);

        long longitudeRaw =
                readUnsignedInt(data, 15);

        double latitude =
                latitudeRaw / 1800000.0;

        double longitude =
                longitudeRaw / 1800000.0;

        if (longitude > 0) {
            longitude = -longitude;
        }

        int speed =
                data[19] & 0xFF;

        int courseStatus =
                ((data[20] & 0xFF) << 8)
                        | (data[21] & 0xFF);

        int course =
                courseStatus & 0x03FF;

        System.out.println(
                "Satélites: " + satellites
        );

        System.out.println(
                "Latitud: " + latitude
        );

        System.out.println(
                "Longitud: " + longitude
        );

        System.out.println(
                "Velocidad: " + speed
        );

        System.out.println(
                "Curso: " + course
        );
    }

    // ============================================================
    // ANALIZAR ALARMA 0x32
    // ============================================================

    private void analyzeAlarmPacket(
            byte[] data,
            int length) {

        System.out.println(
                "Longitud recibida: "
                        + length
        );

        System.out.println(
                "Paquete de alarma detectado."
        );

        System.out.println(
                "Datos: "
                        + bytesToHex(data)
        );
    }

    // ============================================================
    // ANALIZAR 79 79
    // ============================================================

    private void analyze7979Packet(
            byte[] data,
            int length) {

        if (length < 6) {
            System.out.println(
                    "Paquete 79 79 demasiado corto."
            );
            return;
        }

        int declaredLength =
                ((data[2] & 0xFF) << 8)
                        | (data[3] & 0xFF);

        int protocol =
                data[4] & 0xFF;

        System.out.println();
        System.out.println(
                "========== PAQUETE 79 79 =========="
        );

        System.out.println(
                "Longitud declarada: "
                        + declaredLength
        );

        System.out.println(
                "Protocolo: 0x"
                        + String.format(
                                "%02X",
                                protocol
                        )
        );

        System.out.println();
        System.out.println(
                "ÍNDICE | HEX | DECIMAL"
        );

        System.out.println(
                "-----------------------"
        );

        for (int i = 0; i < length; i++) {

            System.out.printf(
                    "%5d | %02X  | %3d%n",
                    i,
                    data[i] & 0xFF,
                    data[i] & 0xFF
            );
        }

        if (protocol == 0x94) {

            System.out.println();
            System.out.println(
                    "Protocolo 0x94 detectado"
            );

            if (length > 5) {

                int subtype =
                        data[5] & 0xFF;

                System.out.println(
                        "Subtipo: 0x"
                                + String.format(
                                        "%02X",
                                        subtype
                                )
                );

                if (subtype == 0x0A) {

                    System.out.println(
                            "Paquete de identificación detectado"
                    );

                } else if (subtype == 0x09) {

                    System.out.println(
                            "Paquete de información satelital detectado"
                    );
                }
            }

            int payloadEnd = length - 2;

            if (payloadEnd > 5) {

                System.out.println(
                        "Payload: "
                                + bytesToHex(
                                        data,
                                        5,
                                        payloadEnd
                                )
                );
            }
        }

        System.out.println(
                "===================================="
        );
    }

    // ============================================================
    // EXTRAER IMEI
    // ============================================================

    private String extractImei(
            byte[] data,
            int length) {

        if (length < 12) {
            return null;
        }

        StringBuilder imei =
                new StringBuilder();

        for (int i = 4; i <= 11; i++) {

            imei.append(
                    String.format(
                            "%02X",
                            data[i] & 0xFF
                    )
            );
        }

        String result =
                imei.toString();

        if (result.length() > 15
                && result.startsWith("0")) {

            result = result.substring(1);
        }

        return result;
    }

    // ============================================================
    // SERIAL
    // ============================================================

    private int getSerialNumber(
            byte[] data,
            int length) {

        if (length < 6) {
            return 0;
        }

        int high =
                data[length - 4] & 0xFF;

        int low =
                data[length - 3] & 0xFF;

        return (high << 8) | low;
    }

    // ============================================================
    // ENVIAR ACK
    // ============================================================

    private void sendAck(
            Socket socket,
            byte[] data,
            int length) {

        try {

            byte[] ack =
                    buildAck(
                            data,
                            length
                    );

            OutputStream outputStream =
                    socket.getOutputStream();

            outputStream.write(ack);
            outputStream.flush();

            System.out.println(
                    "ACK enviado: "
                            + bytesToHex(ack)
            );

        } catch (IOException e) {

            System.err.println(
                    "Error enviando ACK: "
                            + e.getMessage()
            );
        }
    }

    // ============================================================
    // CONSTRUIR ACK
    // ============================================================

    private byte[] buildAck(
            byte[] data,
            int length) {

        int protocol =
                data[3] & 0xFF;

        int serial =
                getSerialNumber(
                        data,
                        length
                );

        byte[] ack =
                new byte[10];

        ack[0] = 0x78;
        ack[1] = 0x78;

        ack[2] = 0x05;

        ack[3] = (byte) protocol;

        ack[4] =
                (byte) ((serial >> 8) & 0xFF);

        ack[5] =
                (byte) (serial & 0xFF);

        int crc =
                calculateCrc(
                        ack,
                        2,
                        6
                );

        ack[6] =
                (byte) ((crc >> 8) & 0xFF);

        ack[7] =
                (byte) (crc & 0xFF);

        ack[8] = 0x0D;
        ack[9] = 0x0A;

        return ack;
    }

    // ============================================================
    // CRC
    // ============================================================

    private int calculateCrc(
            byte[] data,
            int start,
            int end) {

        int crc = 0;

        for (int i = start; i < end; i++) {

            crc ^= data[i] & 0xFF;

            for (int j = 0; j < 8; j++) {

                if ((crc & 0x8000) != 0) {

                    crc =
                            (crc << 1)
                                    ^ 0x1021;

                } else {

                    crc <<= 1;
                }

                crc &= 0xFFFF;
            }
        }

        return crc;
    }

    // ============================================================
    // LEER UINT32
    // ============================================================

    private long readUnsignedInt(
            byte[] data,
            int index) {

        return ((long) (data[index] & 0xFF) << 24)
                | ((long) (data[index + 1] & 0xFF) << 16)
                | ((long) (data[index + 2] & 0xFF) << 8)
                | (long) (data[index + 3] & 0xFF);
    }

    // ============================================================
    // BCD
    // ============================================================

    private int bcdToDecimal(
            byte value) {

        int high =
                (value >> 4) & 0x0F;

        int low =
                value & 0x0F;

        return high * 10 + low;
    }

    // ============================================================
    // BYTES → HEX
    // ============================================================

    private String bytesToHex(
            byte[] data) {

        return bytesToHex(
                data,
                0,
                data.length
        );
    }

    private String bytesToHex(
            byte[] data,
            int start,
            int end) {

        StringBuilder result =
                new StringBuilder();

        for (int i = start; i < end; i++) {

            if (result.length() > 0) {
                result.append(" ");
            }

            result.append(
                    String.format(
                            "%02X",
                            data[i] & 0xFF
                    )
            );
        }

        return result.toString();
    }

    // ============================================================
    // ESTADO DE CONEXIÓN
    // ============================================================

    public boolean isGpsConnected(
            String imei) {

        Socket socket =
                gpsConnections.get(imei);

        return socket != null
                && !socket.isClosed()
                && socket.isConnected();
    }

    // ============================================================
    // ENVIAR COMANDO AL GPS
    // ============================================================

    public boolean sendToGps(
            String imei,
            byte[] command) {

        Socket socket =
                gpsConnections.get(imei);

        if (socket == null
                || socket.isClosed()
                || !socket.isConnected()) {

            return false;
        }

        try {

            OutputStream outputStream =
                    socket.getOutputStream();

            outputStream.write(command);
            outputStream.flush();

            return true;

        } catch (IOException e) {

            System.err.println(
                    "Error enviando comando al GPS: "
                            + e.getMessage()
            );

            return false;
        }
    }
}