package com.edumat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for EduShare - College Material Sharing Platform
 * 
 * This class serves as the entry point for the Spring Boot application.
 * It configures and starts the embedded web server.
 * 
 * @author EduShare Team
 * @version 1.0.0
 */
@SpringBootApplication
public class EduMatApplication {
    
    /**
     * Main method that starts the Spring Boot application
     * 
     * @param args Command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(EduMatApplication.class, args);
    }
}
