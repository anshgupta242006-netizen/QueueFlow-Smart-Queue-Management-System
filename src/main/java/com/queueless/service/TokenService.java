package com.queueless.service;

import com.queueless.model.ApplicationRequest;
import com.queueless.model.RequestStatus;
import com.queueless.repository.ApplicationRequestRepository;
import org.springframework.stereotype.Service;

import java.util.*; 
import org.springframework.web.multipart.MultipartFile; 
import java.nio.file.*; 
import java.io.IOException;

@Service
public class TokenService {
    private final ApplicationRequestRepository repository;
    private final Queue<ApplicationRequest> fifoQueue = new LinkedList<>();
    // Priority: Bonafide > Scholarship > ID Correction (example)
    private final PriorityQueue<ApplicationRequest> priorityQueue = new PriorityQueue<>(Comparator.comparingInt(this::servicePriority));
    private final Map<String, ApplicationRequest> tokenMap = new HashMap<>();
    private int tokenCounter = 1;

    public TokenService(ApplicationRequestRepository repository) {
        this.repository = repository;
        // Load existing data from DB into structures on startup
        List<ApplicationRequest> existing = repository.findAll();
        for (ApplicationRequest req : existing) {
            fifoQueue.add(req);
            priorityQueue.add(req);
            tokenMap.put(req.getTokenNumber(), req);
            // Ensure tokenCounter stays ahead of max existing token number
            try {
                int num = Integer.parseInt(req.getTokenNumber().replaceAll("\\D", ""));
                tokenCounter = Math.max(tokenCounter, num + 1);
            } catch (NumberFormatException ignored) {}
        }
    }

    private int servicePriority(ApplicationRequest req) {
        // Lower number = higher priority
        switch (req.getServiceRequested()) {
            case "Bonafide Certificate": return 1;
            case "Scholarship Verification": return 2;
            case "Identity Card Correction": return 3;
            default: return 5;
        }
    }

    /**
     * Book a token with optional preferred time and document upload.
     * @param studentName Student name
     * @param rollNumber Roll number
     * @param serviceRequested Service requested
     * @param preferredTime Preferred time in ISO format (can be null)
     * @param file Optional document to upload (can be null)
     */
    public ApplicationRequest bookToken(String studentName, String rollNumber, String serviceRequested) {
        return bookToken(studentName, rollNumber, serviceRequested, null, null);
    }

    public ApplicationRequest bookToken(String studentName, String rollNumber, String serviceRequested, String preferredTime, MultipartFile file) {
        String tokenNumber = "T" + tokenCounter++;
        ApplicationRequest request = new ApplicationRequest(studentName, rollNumber, serviceRequested, tokenNumber);
        request.setPreferredTime(preferredTime);
        // handle file upload
        if (file != null && !file.isEmpty()) {
            try {
                Path uploadDir = Paths.get("uploads");
                Files.createDirectories(uploadDir);
                String filename = tokenNumber + "_" + file.getOriginalFilename();
                Path target = uploadDir.resolve(filename);
                Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                request.setDocumentPath(target.toString());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        repository.save(request);
        fifoQueue.add(request);
        priorityQueue.add(request);
        tokenMap.put(tokenNumber, request);
        return request;
    }

    public List<ApplicationRequest> getAllRequests() {
        return repository.findAll();
    }

    public List<ApplicationRequest> getQueue() {
        // Return FIFO order snapshot
        return new ArrayList<>(fifoQueue);
    }

    public ApplicationRequest getByToken(String token) {
        return tokenMap.get(token);
    }

    public ApplicationRequest updateStatus(String token, RequestStatus newStatus, String staffNote) {
        ApplicationRequest req = tokenMap.get(token);
        if (req != null) {
            req.setStatus(newStatus);
            req.setStaffNote(staffNote);
            repository.save(req);
        }
        return req;
    }

    public ApplicationRequest callNextToken() {
        ApplicationRequest next = fifoQueue.poll();
        if (next != null) {
            // Remove from priority queue as well
            priorityQueue.remove(next);
        }
        return next;
    }

    // Admin sets the official slot time for a token
    public ApplicationRequest setAdminSlot(String token, String adminSlot) {
        ApplicationRequest req = tokenMap.get(token);
        if (req != null) {
            req.setAdminSlot(adminSlot);
            repository.save(req);
        }
        return req;
    }

    // Student updates their preferred appointment time
    public ApplicationRequest setPreferredTime(String token, String preferredTime) {
        ApplicationRequest req = tokenMap.get(token);
        if (req != null) {
            req.setPreferredTime(preferredTime);
            repository.save(req);
        }
        return req;
    }

    // Complete a token marking it as completed
    public ApplicationRequest completeCurrent(String token) {
        ApplicationRequest req = tokenMap.get(token);
        if (req != null) {
            req.setStatus(RequestStatus.COMPLETED);
            repository.save(req);
        }
        return req;
    }

    // DSA method: bubble sort demonstration
    public List<Integer> bubbleSort(List<Integer> numbers) {
        List<Integer> list = new ArrayList<>(numbers);
        int n = list.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (list.get(j) > list.get(j + 1)) {
                    // swap
                    int temp = list.get(j);
                    list.set(j, list.get(j + 1));
                    list.set(j + 1, temp);
                }
            }
        }
        return list;
    }
}
