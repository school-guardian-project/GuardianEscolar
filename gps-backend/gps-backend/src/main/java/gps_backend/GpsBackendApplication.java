package gps_backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import gps_backend.tcp.GpsTcpServer;

@SpringBootApplication
public class GpsBackendApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(GpsBackendApplication.class, args);
    }

    @Override
    public void run(String... args) {

        GpsTcpServer gpsTcpServer = new GpsTcpServer(8842);

        gpsTcpServer.start();
    }
}