package com.queueless;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.queueless.service.TokenService;

@SpringBootApplication
public class QueueLessApplication {
    public static void main(String[] args) {
        SpringApplication.run(QueueLessApplication.class, args);
    }

    // Seed some sample data on startup
    @Bean
    public CommandLineRunner dataSeeder(TokenService tokenService) {
        return args -> {
            tokenService.bookToken("Alice", "2021001", "Bonafide Certificate");
            tokenService.bookToken("Bob", "2021002", "Scholarship Verification");
            tokenService.bookToken("Charlie", "2021003", "Identity Card Correction");
        };
    }
}
