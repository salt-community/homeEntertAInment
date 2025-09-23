package com.bestgroup.HomeEntertAInment;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class HomeEntertAInmentBackendApplication {

    public static void main(String[] args) {
        // Load .env file before Spring Boot starts
        loadDotenv();
        
        SpringApplication.run(HomeEntertAInmentBackendApplication.class, args);
    }

    private static void loadDotenv() {
        try {
            log.info("Loading .env file from current directory: {}", System.getProperty("user.dir"));
            
            Dotenv dotenv = Dotenv.configure()
                    .directory("./") // Look for .env in the current directory (backend)
                    .ignoreIfMalformed() // Ignore malformed lines
                    .load();

            // Set system properties for each environment variable found in .env
            int loadedCount = 0;
            for (var entry : dotenv.entries()) {
                String key = entry.getKey();
                String value = entry.getValue();
                
                // Only set if not already set as system property
                if (System.getProperty(key) == null) {
                    System.setProperty(key, value);
                    log.info("Loaded environment variable from .env: {} = {}", key,
                            key.contains("PASSWORD") || key.contains("KEY") || key.contains("TOKEN") ? "***" : value);
                    loadedCount++;
                } else {
                    log.debug("Environment variable {} already set as system property, skipping .env value", key);
                }
            }

            log.info("Successfully loaded {} environment variables from .env file", loadedCount);
            
        } catch (Exception e) {
            log.error("Failed to load .env file: {}. Application cannot start without proper configuration.", e.getMessage());
            log.debug("Exception details:", e);
            throw new RuntimeException("Failed to load .env file. Please ensure .env file exists with required configuration.", e);
        }
    }
}
