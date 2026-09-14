package gps_backend.tcp;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class GpsTcpServer {

    private final int port;

    /**
     * Guarda las conexiones activas de los GPS.
     * La clave es el IMEI.
     */
    private final Map<String, Socket> gpsConnections = new ConcurrentHashMap<>();

    public GpsTcpServer() {
        this(8842);
    }

    public GpsTcpServer(int port) {
        this.port = port;
    }

    /**
     * Inicia el servidor TCP.
     */
    public void start() {

        try (ServerSocket serverSocket = new ServerSocket(port)) {

            System.out.println("=================================");
            System.out.println("       GPS BACKEND - TCP");
            System.out.println("=================================");
            System.out.println("Puerto TCP: " + port);
            System.out.println("Esperando conexión del GPS...");
            System.out.println("---------------------------------");

            while (true) {

                Socket socket = serverSocket.accept();

                System.out.println();
                System.out.println("GPS conectado");
                System.out.println("IP: " + socket.getRemoteSocketAddress());
                System.out.println("---------------------------------");

                Thread gpsThread = new Thread(
                        () -> handleGpsConnection(socket)
                );

                gpsThread.start();
            }

        } catch (IOException e) {

            System.err.println("Error iniciando servidor TCP:");
            e.printStackTrace();
        }
    }

    /**
     * Maneja una conexión individual del GPS.
     */
    private void handleGpsConnection(Socket socket) {

        String imei = null;

        try {

            InputStream inputStream = socket.getInputStream();

            byte[] buffer = new byte[1024];

            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {

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
                System.out.println("DATOS RECIBIDOS:");

                System.out.println(
                        "HEX: " + bytesToHex(data)
                );

                String detectedImei = processPacket(
                        data,
                        bytesRead,
                        socket
                );

                if (detectedImei != null) {

                    imei = detectedImei;

                    gpsConnections.put(
                            imei,
                            socket
                    );

                    System.out.println();
                    System.out.println("GPS registrado:");
                    System.out.println("IMEI: " + imei);
                    System.out.println(
                            "GPS conectados: "
                                    + gpsConnections.size()
                    );
                }
            }

        } catch (IOException e) {

            System.err.println(
                    "Error en conexión GPS: "
                            + e.getMessage()
            );

        } finally {

            if (imei != null) {

                gpsConnections.remove(imei);

                System.out.println();
                System.out.println(
                        "GPS desconectado: " + imei
                );

            } else {

                System.out.println();
                System.out.println(
                        "Conexión GPS desconectada"
                );
            }

            System.out.println(
                    "GPS conectados actualmente: "
                            + gpsConnections.size()
            );

            try {
                socket.close();
            } catch (IOException ignored) {
            }
        }
    }

    /**
     * Procesa los paquetes enviados por el GPS.
     */
    private String processPacket(
            byte[] data,
            int length,
            Socket socket) {

        if (length < 5) {

            System.out.println(
                    "Paquete demasiado corto."
            );

            return null;
        }

        /*
         * =========================================
         * PROTOCOLO 78 78
         * =========================================
         */
        if ((data[0] & 0xFF) == 0x78
                && (data[1] & 0xFF) == 0x78) {

            if (length < 6) {
                return null;
            }

            int protocol = data[3] & 0xFF;

            System.out.println(
                    "Protocolo: 0x"
                            + String.format(
                                    "%02X",
                                    protocol
                            )
            );

            switch (protocol) {

                /*
                 * =====================================
                 * LOGIN
                 * =====================================
                 */
                case 0x01:

                    System.out.println(
                            "Tipo: LOGIN"
                    );

                    String imei = extractImei(data);

                    System.out.println(
                            "IMEI: " + imei
                    );

                    int loginSerial =
                            getSerialNumber(
                                    data,
                                    length
                            );

                    System.out.println(
                            "Serial: "
                                    + String.format(
                                            "%04X",
                                            loginSerial
                                    )
                    );

                    byte[] loginAck =
                            buildAck(
                                    0x01,
                                    loginSerial
                            );

                    sendAck(
                            socket,
                            loginAck
                    );

                    return imei;

                /*
                 * =====================================
                 * HEARTBEAT
                 * =====================================
                 */
                case 0x13:

                    System.out.println(
                            "Tipo: HEARTBEAT"
                    );

                    int heartbeatSerial =
                            getSerialNumber(
                                    data,
                                    length
                            );

                    System.out.println(
                            "Serial: "
                                    + String.format(
                                            "%04X",
                                            heartbeatSerial
                                    )
                    );

                    byte[] heartbeatAck =
                            buildAck(
                                    0x13,
                                    heartbeatSerial
                            );

                    sendAck(
                            socket,
                            heartbeatAck
                    );

                    break;

                /*
                 * =====================================
                 * GPS / LOCATION
                 * =====================================
                 */
                case 0x31:

                    System.out.println(
                            "Tipo: GPS / LOCATION"
                    );

                    analyzeGpsPacket(
                            data,
                            length
                    );

                    int gpsSerial =
                            getSerialNumber(
                                    data,
                                    length
                            );

                    byte[] gpsAck =
                            buildAck(
                                    0x31,
                                    gpsSerial
                            );

                    sendAck(
                            socket,
                            gpsAck
                    );

                    break;

                /*
                 * =====================================
                 * ALARMA
                 * =====================================
                 *
                 * IMPORTANTE:
                 * En nuestro VT03F este paquete
                 * contiene también posición GPS.
                 */
                case 0x32:

                    System.out.println(
                            "Tipo: ALARMA"
                    );

                    analyzeAlarmPacket(
                            data,
                            length
                    );

                    int alarmSerial =
                            getSerialNumber(
                                    data,
                                    length
                            );

                    byte[] alarmAck =
                            buildAck(
                                    0x32,
                                    alarmSerial
                            );

                    sendAck(
                            socket,
                            alarmAck
                    );

                    break;

                /*
                 * =====================================
                 * COMANDO
                 * =====================================
                 */
                case 0x80:

                    System.out.println(
                            "Tipo: COMANDO"
                    );

                    int commandSerial =
                            getSerialNumber(
                                    data,
                                    length
                            );

                    byte[] commandAck =
                            buildAck(
                                    0x80,
                                    commandSerial
                            );

                    sendAck(
                            socket,
                            commandAck
                    );

                    break;

                default:

                    System.out.println(
                            "Protocolo desconocido: 0x"
                                    + String.format(
                                            "%02X",
                                            protocol
                                    )
                    );

                    break;
            }

            return null;
        }

        /*
         * =========================================
         * PROTOCOLO 79 79
         * =========================================
         */
        if ((data[0] & 0xFF) == 0x79
                && (data[1] & 0xFF) == 0x79) {

            System.out.println(
                    "Paquete tipo 79 79"
            );

            analyze7979Packet(
                    data,
                    length
            );

            return null;
        }

        System.out.println(
                "Cabecera desconocida."
        );

        return null;
    }

    /**
     * ============================================
     * ANALIZAR PAQUETE 79 79
     * ============================================
     */
    private void analyze7979Packet(
            byte[] data,
            int length) {

        if (length < 6) {

            System.out.println(
                    "Paquete 79 79 demasiado corto."
            );

            return;
        }

        /*
         * En 79 79 el length ocupa 2 bytes.
         */
        int packetLength =
                ((data[2] & 0xFF) << 8)
                        | (data[3] & 0xFF);

        int protocol =
                data[4] & 0xFF;

        System.out.println(
                "Longitud declarada: "
                        + packetLength
        );

        System.out.println(
                "Protocolo 79 79: 0x"
                        + String.format(
                                "%02X",
                                protocol
                        )
        );

        /*
         * =====================================
         * 0x94
         * =====================================
         */
        if (protocol == 0x94) {

            if (length < 7) {
                return;
            }

            int subtype =
                    data[5] & 0xFF;

            System.out.println(
                    "Subtipo: 0x"
                            + String.format(
                                    "%02X",
                                    subtype
                            )
            );

            switch (subtype) {

                /*
                 * IDENTIFICACIÓN / ICCID
                 */
                case 0x0A:

                    System.out.println(
                            "Tipo 0x94: IDENTIFICACION / ICCID"
                    );

                    analyzeIdentificationPacket(
                            data,
                            length
                    );

                    break;

                /*
                 * INFORMACIÓN DE SATÉLITES
                 */
                case 0x09:

                    System.out.println(
                            "Tipo 0x94: INFORMACION DE SATELITES"
                    );

                    break;

                default:

                    System.out.println(
                            "Subtipo 0x94 desconocido."
                    );

                    break;
            }
        }
    }

    /**
     * ============================================
     * ANALIZAR IDENTIFICACIÓN / ICCID
     * ============================================
     */
    private void analyzeIdentificationPacket(
            byte[] data,
            int length) {

        System.out.println(
                "Datos de identificación:"
        );

        /*
         * Imprimimos los bytes internos para
         * poder seguir analizando el protocolo.
         */
        if (length > 6) {

            byte[] identification =
                    new byte[length - 6];

            System.arraycopy(
                    data,
                    6,
                    identification,
                    0,
                    identification.length
            );

            System.out.println(
                    bytesToHex(identification)
            );
        }

        /*
         * El serial normalmente está antes
         * del CRC y 0D 0A.
         */
        int serial =
                getSerialNumber(
                        data,
                        length
                );

        System.out.println(
                "Serial identificación: "
                        + String.format(
                                "%04X",
                                serial
                        )
        );
    }

    /**
     * ============================================
     * ANALIZAR GPS 0x31
     * ============================================
     */
    private void analyzeGpsPacket(
            byte[] data,
            int length) {

        /*
         * Estructura mínima necesaria:
         *
         * 78 78
         * LENGTH
         * PROTOCOL
         * DATE 6
         * GPS INFO 1
         * LAT 4
         * LON 4
         * SPEED 1
         * COURSE/STATUS 2
         *
         */

        if (length < 22) {

            System.out.println(
                    "Paquete GPS demasiado corto."
            );

            return;
        }

        /*
         * =====================================
         * FECHA Y HORA
         * =====================================
         */
        int year =
                2000
                        + bcdToDecimal(
                                data[4]
                        );

        int month =
                bcdToDecimal(
                        data[5]
                );

        int day =
                bcdToDecimal(
                        data[6]
                );

        int hour =
                bcdToDecimal(
                        data[7]
                );

        int minute =
                bcdToDecimal(
                        data[8]
                );

        int second =
                bcdToDecimal(
                        data[9]
                );

        /*
         * =====================================
         * GPS INFO
         * =====================================
         */
        int gpsInfo =
                data[10] & 0xFF;

        int satellites =
                gpsInfo & 0x0F;

        /*
         * =====================================
         * LATITUD
         * =====================================
         */
        long latitudeRaw =
                readUnsignedInt(
                        data,
                        11
                );

        double latitude =
                latitudeRaw / 1800000.0;

        /*
         * =====================================
         * LONGITUD
         * =====================================
         */
        long longitudeRaw =
                readUnsignedInt(
                        data,
                        15
                );

        double longitude =
                longitudeRaw / 1800000.0;

        /*
         * Por protocolo el valor puede venir
         * positivo, pero Colombia está al oeste.
         */
        if (longitude > 0) {
            longitude = -longitude;
        }

        /*
         * =====================================
         * VELOCIDAD
         * =====================================
         */
        int speed =
                data[19] & 0xFF;

        /*
         * =====================================
         * CURSO / STATUS
         * =====================================
         */
        int courseStatus =
                ((data[20] & 0xFF) << 8)
                        | (data[21] & 0xFF);

        int course =
                courseStatus & 0x03FF;

        /*
         * =====================================
         * MOSTRAR INFORMACIÓN
         * =====================================
         */
        System.out.println();
        System.out.println(
                "========== GPS =========="
        );

        System.out.printf(
                "Fecha: %04d-%02d-%02d%n",
                year,
                month,
                day
        );

        System.out.printf(
                "Hora: %02d:%02d:%02d%n",
                hour,
                minute,
                second
        );

        System.out.println(
                "GPS Info: "
                        + String.format(
                                "0x%02X",
                                gpsInfo
                        )
        );

        System.out.println(
                "Satélites: "
                        + satellites
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
                "Velocidad: "
                        + speed
                        + " km/h"
        );

        System.out.println(
                "Curso: "
                        + course
                        + "°"
        );

        System.out.println(
                "=========================="
        );
    }

    /**
     * ============================================
     * ANALIZAR ALARMA 0x32
     * ============================================
     *
     * IMPORTANTE:
     * El VT03F está enviando la posición GPS
     * dentro del paquete 0x32.
     */
    private void analyzeAlarmPacket(
            byte[] data,
            int length) {

        /*
         * Estructura utilizada:
         *
         * 78 78
         * LENGTH
         * 32
         * DATE 6
         * GPS INFO 1
         * LAT 4
         * LON 4
         * SPEED 1
         * COURSE/STATUS 2
         * ...
         */

        if (length < 22) {

            System.out.println(
                    "Paquete ALARMA demasiado corto."
            );

            return;
        }

        /*
         * =====================================
         * FECHA Y HORA
         * =====================================
         */
        int year =
                2000
                        + bcdToDecimal(
                                data[4]
                        );

        int month =
                bcdToDecimal(
                        data[5]
                );

        int day =
                bcdToDecimal(
                        data[6]
                );

        int hour =
                bcdToDecimal(
                        data[7]
                );

        int minute =
                bcdToDecimal(
                        data[8]
                );

        int second =
                bcdToDecimal(
                        data[9]
                );

        /*
         * =====================================
         * GPS INFO
         * =====================================
         */
        int gpsInfo =
                data[10] & 0xFF;

        int satellites =
                gpsInfo & 0x0F;

        /*
         * =====================================
         * LATITUD
         * =====================================
         */
        long latitudeRaw =
                readUnsignedInt(
                        data,
                        11
                );

        double latitude =
                latitudeRaw / 1800000.0;

        /*
         * =====================================
         * LONGITUD
         * =====================================
         */
        long longitudeRaw =
                readUnsignedInt(
                        data,
                        15
                );

        double longitude =
                longitudeRaw / 1800000.0;

        /*
         * Colombia está al oeste,
         * por eso usamos longitud negativa.
         */
        if (longitude > 0) {
            longitude = -longitude;
        }

        /*
         * =====================================
         * VELOCIDAD
         * =====================================
         */
        int speed =
                data[19] & 0xFF;

        /*
         * =====================================
         * CURSO / STATUS
         * =====================================
         */
        int courseStatus =
                ((data[20] & 0xFF) << 8)
                        | (data[21] & 0xFF);

        int course =
                courseStatus & 0x03FF;

        /*
         * =====================================
         * MOSTRAR RESULTADO
         * =====================================
         */
        System.out.println();
        System.out.println(
                "========== ALARMA GPS =========="
        );

        System.out.printf(
                "Fecha: %04d-%02d-%02d%n",
                year,
                month,
                day
        );

        System.out.printf(
                "Hora: %02d:%02d:%02d%n",
                hour,
                minute,
                second
        );

        System.out.println(
                "GPS Info: "
                        + String.format(
                                "0x%02X",
                                gpsInfo
                        )
        );

        System.out.println(
                "Satélites: "
                        + satellites
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
                "Velocidad: "
                        + speed
                        + " km/h"
        );

        System.out.println(
                "Curso: "
                        + course
                        + "°"
        );

        System.out.println(
                "================================="
        );

        /*
         * Esta parte nos servirá después para
         * guardar la posición en la base de datos.
         */
        System.out.println(
                "POSICION GPS RECIBIDA CORRECTAMENTE"
        );
    }

    /**
     * ============================================
     * EXTRAER IMEI
     * ============================================
     */
    private String extractImei(byte[] data) {

        /*
         * El IMEI ocupa 8 bytes.
         */
        if (data.length < 12) {

            return null;
        }

        StringBuilder imei =
                new StringBuilder();

        for (int i = 4; i < 12; i++) {

            imei.append(
                    String.format(
                            "%02X",
                            data[i] & 0xFF
                    )
            );
        }

        String result =
                imei.toString();

        /*
         * Algunos protocolos incluyen un cero
         * inicial para completar los 16 dígitos.
         */
        if (result.length() > 15
                && result.startsWith("0")) {

            result =
                    result.substring(1);
        }

        return result;
    }

    /**
     * ============================================
     * OBTENER SERIAL
     * ============================================
     *
     * En los paquetes 78 78:
     *
     * ... SERIAL CRC CRC 0D 0A
     */
    private int getSerialNumber(
            byte[] data,
            int length) {

        if (length < 6) {

            return 0;
        }

        int serialIndex =
                length - 6;

        return ((data[serialIndex] & 0xFF) << 8)
                | (data[serialIndex + 1] & 0xFF);
    }

    /**
     * ============================================
     * CREAR ACK
     * ============================================
     */
    private byte[] buildAck(
            int protocol,
            int serial) {

        /*
         * ACK:
         *
         * 78 78
         * 05
         * PROTOCOL
         * SERIAL HIGH
         * SERIAL LOW
         * CRC HIGH
         * CRC LOW
         * 0D 0A
         */

        byte[] ack =
                new byte[10];

        ack[0] = 0x78;
        ack[1] = 0x78;

        ack[2] = 0x05;

        ack[3] =
                (byte) protocol;

        ack[4] =
                (byte) ((serial >> 8) & 0xFF);

        ack[5] =
                (byte) (serial & 0xFF);

        /*
         * CRC se calcula desde LENGTH
         * hasta SERIAL.
         */
        int crc =
                calculateCrc16(
                        ack,
                        2,
                        4
                );

        ack[6] =
                (byte) ((crc >> 8) & 0xFF);

        ack[7] =
                (byte) (crc & 0xFF);

        ack[8] = 0x0D;
        ack[9] = 0x0A;

        return ack;
    }

    /**
     * ============================================
     * ENVIAR ACK
     * ============================================
     */
    private void sendAck(
            Socket socket,
            byte[] ack) {

        try {

            OutputStream outputStream =
                    socket.getOutputStream();

            outputStream.write(ack);

            outputStream.flush();

            System.out.println(
                    "ACK ENVIADO:"
            );

            System.out.println(
                    bytesToHex(ack)
            );

        } catch (IOException e) {

            System.err.println(
                    "Error enviando ACK: "
                            + e.getMessage()
            );
        }
    }

    /**
     * ============================================
     * CRC-16
     * ============================================
     */
    private int calculateCrc16(
            byte[] data,
            int offset,
            int length) {

        int crc =
                0xFFFF;

        for (int i = offset;
             i < offset + length;
             i++) {

            crc ^=
                    data[i] & 0xFF;

            for (int j = 0;
                 j < 8;
                 j++) {

                if ((crc & 0x0001) != 0) {

                    crc =
                            (crc >> 1)
                                    ^ 0x8408;

                } else {

                    crc >>= 1;
                }
            }
        }

        crc ^=
                0xFFFF;

        return crc & 0xFFFF;
    }

    /**
     * ============================================
     * CONVERTIR 4 BYTES A UNSIGNED INT
     * ============================================
     */
    private long readUnsignedInt(
            byte[] data,
            int index) {

        return ((long) (data[index] & 0xFF) << 24)
                | ((long) (data[index + 1] & 0xFF) << 16)
                | ((long) (data[index + 2] & 0xFF) << 8)
                | ((long) (data[index + 3] & 0xFF));
    }

    /**
     * ============================================
     * BCD A DECIMAL
     * ============================================
     */
    private int bcdToDecimal(
            byte value) {

        int b =
                value & 0xFF;

        return ((b >> 4) * 10)
                + (b & 0x0F);
    }

    /**
     * ============================================
     * BYTES A HEX
     * ============================================
     */
    private String bytesToHex(
            byte[] bytes) {

        StringBuilder result =
                new StringBuilder();

        for (byte b : bytes) {

            result.append(
                    String.format(
                            "%02X ",
                            b & 0xFF
                    )
            );
        }

        return result.toString().trim();
    }

    /**
     * ============================================
     * VERIFICAR GPS CONECTADO
     * ============================================
     */
    public boolean isGpsConnected(
            String imei) {

        return gpsConnections.containsKey(
                imei
        );
    }

    /**
     * ============================================
     * ENVIAR COMANDO AL GPS
     * ============================================
     */
    public boolean sendToGps(
            String imei,
            byte[] command) {

        Socket socket =
                gpsConnections.get(
                        imei
                );

        if (socket == null) {

            System.out.println(
                    "GPS no conectado: "
                            + imei
            );

            return false;
        }

        try {

            OutputStream outputStream =
                    socket.getOutputStream();

            outputStream.write(
                    command
            );

            outputStream.flush();

            System.out.println(
                    "Comando enviado al GPS "
                            + imei
            );

            System.out.println(
                    bytesToHex(command)
            );

            return true;

        } catch (IOException e) {

            System.err.println(
                    "Error enviando comando: "
                            + e.getMessage()
            );

            return false;
        }
    }
}