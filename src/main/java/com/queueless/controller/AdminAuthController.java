package com.queueless.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    // In-memory active session tokens: token -> username
    private static final Map<String, String> ACTIVE_SESSIONS = new ConcurrentHashMap<>();

    // Registered admin credentials (can be expanded)
    // Default: username "admin", password "admin123"
    private static final Map<String, String> ADMIN_CREDENTIALS = new HashMap<>();

    static {
        ADMIN_CREDENTIALS.put("admin", "admin123");
        ADMIN_CREDENTIALS.put("officer", "admin123");
        ADMIN_CREDENTIALS.put("staff", "admin123");
        ADMIN_CREDENTIALS.put("sharma", "admin123");
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }

    public static class LoginResponse {
        public boolean success;
        public String message;
        public String token;
        public String username;
        public String displayName;

        public LoginResponse(boolean success, String message, String token, String username, String displayName) {
            this.success = success;
            this.message = message;
            this.token = token;
            this.username = username;
            this.displayName = displayName;
        }
    }

    public static boolean isValidToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        return ACTIVE_SESSIONS.containsKey(token);
    }

    public static String getUsernameForToken(String token) {
        return ACTIVE_SESSIONS.get(token);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request == null || request.username == null || request.password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new LoginResponse(false, "Username and password are required.", null, null, null));
        }

        String user = request.username.trim().toLowerCase();
        String pass = request.password.trim();

        // Check configured credentials or allow any administrative name if password matches "admin123"
        boolean valid = false;
        if (ADMIN_CREDENTIALS.containsKey(user) && ADMIN_CREDENTIALS.get(user).equals(pass)) {
            valid = true;
        } else if (!user.isBlank() && "admin123".equals(pass)) {
            // Allow desk officers with any name using the administrative passkey
            valid = true;
        }

        if (valid) {
            String token = "admin-session-" + UUID.randomUUID().toString();
            String displayName = Character.toUpperCase(user.charAt(0)) + user.substring(1);
            ACTIVE_SESSIONS.put(token, displayName);

            return ResponseEntity.ok(new LoginResponse(
                    true,
                    "Administrative authentication successful. Welcome, " + displayName + ".",
                    token,
                    user,
                    displayName
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(
                    false,
                    "Access Denied: Invalid Administrative Name or Password. Students are not authorized to access the Administrative Block.",
                    null,
                    null,
                    null
            ));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        if (isValidToken(token)) {
            String username = ACTIVE_SESSIONS.get(token);
            return ResponseEntity.ok(Map.of(
                    "authenticated", true,
                    "username", username,
                    "displayName", username
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "authenticated", false,
                "message", "Session expired or invalid. Please log in again."
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        if (token != null) {
            ACTIVE_SESSIONS.remove(token);
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Administrative session ended successfully."
        ));
    }
}
