package com.queueless.controller;

import com.queueless.model.ApplicationRequest;
import com.queueless.model.RequestStatus;
import com.queueless.service.TokenService;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.File;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api")
public class QueueController {
    private final TokenService tokenService;

    public QueueController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    // DTO removed – using multipart request
    @PostMapping(value = "/token/book", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApplicationRequest> bookTokenMultipart(
            @RequestParam String studentName,
            @RequestParam String rollNumber,
            @RequestParam String serviceRequested,
            @RequestParam(required = false) String preferredTime,
            @RequestPart(required = false) MultipartFile file) {
        ApplicationRequest created = tokenService.bookToken(studentName, rollNumber, serviceRequested, preferredTime, file);
        return ResponseEntity.ok(created);
    }

    public static class BookJsonRequest {
        public String studentName;
        public String rollNumber;
        public String serviceRequested;
        public String preferredTime;
    }

    @PostMapping(value = "/token/book", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApplicationRequest> bookTokenJson(@RequestBody BookJsonRequest body) {
        ApplicationRequest created = tokenService.bookToken(body.studentName, body.rollNumber, body.serviceRequested, body.preferredTime, null);
        return ResponseEntity.ok(created);
    }

    // Get details of a specific token – used to show only the user's token
    @GetMapping("/token/{token}")
    public ResponseEntity<ApplicationRequest> getToken(@PathVariable String token) {
        ApplicationRequest req = tokenService.getByToken(token);
        if (req == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(req);
    }

    // View uploaded document
    @GetMapping("/document/{token}")
    public ResponseEntity<Resource> getDocument(@PathVariable String token) {
        ApplicationRequest req = tokenService.getByToken(token);
        if (req != null && req.getDocumentPath() != null) {
            File file = new File(req.getDocumentPath());
            if (file.exists()) {
                Resource resource = new FileSystemResource(file);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                        .body(resource);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/queue")
    public List<ApplicationRequest> getQueue() {
        return tokenService.getQueue();
    }

    @PostMapping("/token/call-next")
    public ResponseEntity<?> callNext(@org.springframework.web.bind.annotation.RequestHeader(value = "X-Admin-Token", required = false) String adminToken) {
        if (!AdminAuthController.isValidToken(adminToken)) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Access denied: Administrative login required to operate desk terminal."));
        }
        ApplicationRequest next = tokenService.callNextToken();
        if (next == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(next);
    }

    @PostMapping("/token/complete")
    public ResponseEntity<?> completeToken(
            @RequestParam String token,
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-Admin-Token", required = false) String adminToken) {
        if (!AdminAuthController.isValidToken(adminToken)) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Access denied: Administrative login required to complete token service."));
        }
        ApplicationRequest updated = tokenService.completeCurrent(token);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/applications")
    public List<ApplicationRequest> getAllApplications() {
        return tokenService.getAllRequests();
    }

    public static class StatusUpdate {
        public String status; // APPROVED, REJECTED, CORRECTION_REQUIRED
        public String staffNote;
    }

    @PostMapping("/application/{token}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String token,
            @RequestBody StatusUpdate update,
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-Admin-Token", required = false) String adminToken) {
        if (!AdminAuthController.isValidToken(adminToken)) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Access denied: Administrative login required to update application status."));
        }
        RequestStatus newStatus;
        try {
            newStatus = RequestStatus.valueOf(update.status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        ApplicationRequest updated = tokenService.updateStatus(token, newStatus, update.staffNote);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    // Admin sets official slot time for a token
    @PutMapping("/admin/token/{token}/slot")
    public ResponseEntity<?> setAdminSlot(
            @PathVariable String token,
            @RequestBody Map<String, String> body,
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-Admin-Token", required = false) String adminToken) {
        if (!AdminAuthController.isValidToken(adminToken)) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Access denied: Administrative login required to designate official slots."));
        }
        String adminSlot = body.get("adminSlot");
        if (adminSlot == null) {
            return ResponseEntity.badRequest().build();
        }
        ApplicationRequest updated = tokenService.setAdminSlot(token, adminSlot);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // Student updates their preferred appointment time
    @PutMapping("/student/token/{token}/time")
    public ResponseEntity<ApplicationRequest> setPreferredTime(@PathVariable String token, @RequestBody Map<String, String> body) {
        String preferredTime = body.get("preferredTime");
        if (preferredTime == null) {
            return ResponseEntity.badRequest().build();
        }
        ApplicationRequest updated = tokenService.setPreferredTime(token, preferredTime);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    public static class SortRequest {
        public List<Integer> numbers;
    }

    @PostMapping("/dsa/bubblesort")
    public List<Integer> bubbleSort(@RequestBody SortRequest request) {
        return tokenService.bubbleSort(request.numbers);
    }
}
