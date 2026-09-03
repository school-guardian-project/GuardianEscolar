package gps_backend.tcp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;

public class GpsTcpServer {

    private final int port;

    public GpsTcpServer(int port) {
        this.port = port;
    }

    public void start() {

        try (ServerSocket serverSocket = new ServerSocket(port)) {

            System.out.println("=================================");
            System.out.println("       GPS BACKEND - TCP");
            System.out.println("=================================");
            System.out.println("Puerto TCP: " + port);
            System.out.println("Esperando conexión del GPS...");

            while (true) {

                Socket clientSocket = serverSocket.accept();

                System.out.println("---------------------------------");
                System.out.println("GPS conectado");
                System.out.println("IP: " + clientSocket.getInetAddress());
                System.out.println("---------------------------------");

                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(
                                clientSocket.getInputStream()
                        )
                );

                String message;

                while ((message = reader.readLine()) != null) {

                    System.out.println("GPS -> " + message);
                }

                clientSocket.close();

                System.out.println("GPS desconectado");
                System.out.println("Esperando nueva conexión...");

            }

        } catch (IOException e) {

            System.err.println("Error en el servidor TCP:");
            System.err.println(e.getMessage());

        }
    }
}