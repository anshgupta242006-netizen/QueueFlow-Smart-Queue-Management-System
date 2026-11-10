package com.queueless.model;

import jakarta.persistence.*;

@Entity
public class ApplicationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String rollNumber;
    private String serviceRequested;
    private String tokenNumber;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private String preferredTime; // e.g., "2026-10-25T10:30"
    private String documentPath; // stored file location
    private String adminSlot; // time provided by admin (working/non-working day)
    private String staffNote;

    // Getter and setter for preferredTime
    public String getPreferredTime() { return preferredTime; }
    public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }

    // Getter and setter for documentPath
    public String getDocumentPath() { return documentPath; }
    public void setDocumentPath(String documentPath) { this.documentPath = documentPath; }

    // Getter and setter for adminSlot
    public String getAdminSlot() { return adminSlot; }
    public void setAdminSlot(String adminSlot) { this.adminSlot = adminSlot; }

    // Constructors
    public ApplicationRequest() {}

    public ApplicationRequest(String studentName, String rollNumber, String serviceRequested, String tokenNumber) {
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.serviceRequested = serviceRequested;
        this.tokenNumber = tokenNumber;
        this.status = RequestStatus.PENDING;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public String getServiceRequested() { return serviceRequested; }
    public void setServiceRequested(String serviceRequested) { this.serviceRequested = serviceRequested; }
    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public String getStaffNote() { return staffNote; }
    public void setStaffNote(String staffNote) { this.staffNote = staffNote; }
}
