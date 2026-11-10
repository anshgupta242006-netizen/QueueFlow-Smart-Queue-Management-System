# QueueLess: Smart Campus Queue & Digital Slot Scheduling System

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Database](https://img.shields.io/badge/Database-H2%20Embedded-blue.svg)](https://www.h2database.com/)
[![License](https://img.shields.io/badge/License-Academic-lightgrey.svg)]()

> A full-stack campus queuing and appointment management platform that eliminates physical queues, pre-screens administrative documents, and provides prioritized counter dispatching with audio chimes.

---

## 🌟 Key Features

### 🎓 1. Student Portal
- **Online Token Reservation:** Reserve tokens remotely with immediate digital pass generation.
- **Visual Slot Selector:** Choose between campus preset windows (Morning, Afternoon, Late Afternoon, Special Saturday) or select a custom date and time.
- **Document Pre-screening:** Drag-and-drop file upload (PDF, PNG, JPG, DOCX) for pre-counter auditing.
- **Live Pass & Status Tracker:** Printable verified campus ticket with status pills (`PENDING`, `APPROVED`, `COMPLETED`).

### 🏛️ 2. Administrative Block Workstation
- **Secure Authentication:** Gated desk access with token-based session verification (`X-Admin-Token`).
- **Live Metrics Strip:** Instant counts of Total Requests, Pending Audits, Approved Applications, and Waiting Queue.
- **Document Inspection:** Inline document viewing directly from applicant records.
- **Official Slot Scheduling:** Modal tool to designate official working/non-working day visit slots.
- **Counter Calling Center:** Dispatches next student using FIFO + Priority Queues with synthetic Web Audio chimes.

### 📊 3. Public Live Board
- Real-time display board auto-refreshing every 4 seconds for campus corridor screens.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 17, Spring Boot 3.2.4, Spring Web MVC |
| **Data & ORM** | Spring Data JPA, Hibernate 6.4.4, H2 Database (File-backed) |
| **Frontend** | HTML5, CSS3 (Custom Responsive Design System), JavaScript (ES6+ Fetch API) |
| **Audio** | Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`) |
| **Build & Tools** | Apache Maven 3.10, Visual Studio Code |

---

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher installed.

### Run with Pre-packaged JAR
```powershell
java -jar target/queueless-0.0.1-SNAPSHOT.jar
```

### Or Build & Run with Maven
```powershell
mvn clean package -DskipTests
java -jar target/queueless-0.0.1-SNAPSHOT.jar
```

---

## 🌐 Application Links

Once the server is running on `http://localhost:8080`:

* **Home Gateway:** [http://localhost:8080/](http://localhost:8080/)
* **Student Portal:** [http://localhost:8080/student.html](http://localhost:8080/student.html)
* **Administrative Desk:** [http://localhost:8080/admin.html](http://localhost:8080/admin.html)
* **Database Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  * *JDBC URL:* `jdbc:h2:file:./data/queueless-db` | *User:* `sa` | *Password:* *(empty)*

---

## 🔑 Administrative Credentials

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Senior Desk Officer |
| `officer` | `admin123` | Administrative Clerk |
| `staff` | `admin123` | Staff Member |
| `sharma` | `admin123` | Counter Officer |

---

## 📁 Project Structure

```
QUEUE PROJECT/
├── src/
│   └── main/
│       ├── java/com/queueless/
│       │   ├── QueueLessApplication.java       # Bootstrapping & sample data seeder
│       │   ├── controller/
│       │   │   ├── AdminAuthController.java   # Authentication & session token engine
│       │   │   └── QueueController.java       # Token booking, slot, & calling endpoints
│       │   ├── model/
│       │   │   ├── ApplicationRequest.java    # JPA Entity definition
│       │   │   └── RequestStatus.java         # Lifecycle status enum
│       │   ├── repository/
│       │   │   └── ApplicationRequestRepository.java # JPA Repository
│       │   └── service/
│       │       └── TokenService.java          # FIFO, PriorityQueue, & HashMap indexing
│       └── resources/
│           ├── application.properties         # Server & H2 DB configuration
│           └── static/
│               ├── index.html                 # Gateway Hub
│               ├── student.html & student.js  # Student Portal & Pass engine
│               ├── admin.html & admin.js      # Admin Terminal & Audio chime
│               ├── report.html                # Interactive Academic Report
│               └── style.css                  # Modern UI Design System
├── data/                                      # Embedded H2 Database files
├── uploads/                                   # Uploaded verification proofs
├── QueueLess_4Pages_Report.pdf                # Formal 4-Page College Project Report
├── push_to_github.bat                         # 1-Click script to push project to GitHub
├── push_to_github.ps1                         # PowerShell push script
└── pom.xml                                    # Maven dependencies & build setup
```

---

## 📄 Academic Project Report
A complete 4-page college project submission report is included:
* **PDF Report:** `QueueLess_4Pages_Report.pdf`
* **HTML Report:** `QueueLess_4Pages_Report.html`

---

## 👤 Author
* **Ansh Gupta** (B.Tech CSE)
* Department of Computer Science & Engineering

