html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SMART QUEUE MANAGEMENT SYSTEM - Project Report</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 12mm 15mm 12mm 15mm;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111;
            background: #fff;
            line-height: 1.35;
            font-size: 10.5pt;
        }

        .page {
            page-break-after: always;
            break-after: page;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }

        .page:last-child {
            page-break-after: avoid;
            break-after: avoid;
        }

        h1.main-title {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 3px;
            color: #000;
        }

        p.report-sub {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .meta-block {
            margin-bottom: 12px;
            font-size: 10pt;
            line-height: 1.35;
        }

        .meta-block p {
            margin-bottom: 2px;
        }

        h2.sec-heading {
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 9px;
            margin-bottom: 4px;
            color: #000;
        }

        p {
            margin-bottom: 5px;
            text-align: justify;
        }

        ul, ol {
            margin-left: 20px;
            margin-bottom: 6px;
        }

        li {
            margin-bottom: 2px;
        }

        table.test-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6px 0 8px 0;
            font-size: 9.5pt;
        }

        table.test-table th, table.test-table td {
            border: 1px solid #333;
            padding: 4px 8px;
            text-align: left;
        }

        table.test-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .footer-signoff {
            border-top: 1px solid #444;
            padding-top: 6px;
            margin-top: 8px;
            font-size: 9.5pt;
            line-height: 1.3;
        }

        /* Screen only toolbar */
        @media screen {
            body {
                background: #e2e8f0;
                padding: 20px 0;
            }
            .page {
                background: #fff;
                width: 210mm;
                min-height: 297mm;
                margin: 0 auto 20px auto;
                padding: 15mm;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            }
            .screen-bar {
                width: 210mm;
                margin: 0 auto 15px auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #1e293b;
                color: #fff;
                padding: 10px 18px;
                border-radius: 8px;
            }
            .btn-print {
                background: #10b981;
                color: #fff;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: bold;
                cursor: pointer;
            }
        }

        @media print {
            .screen-bar {
                display: none !important;
            }
        }
    </style>
</head>
<body>

    <div class="screen-bar">
        <span><strong>QueueLess 4-Page College Project Report</strong> (Formatted per SRMU Guidelines)</span>
        <button onclick="window.print()" class="btn-print">🖨️ Download / Save as PDF</button>
    </div>

    <!-- ================= PAGE 1 ================= -->
    <div class="page">
        <h1 class="main-title">SMART QUEUE MANAGEMENT SYSTEM (QueueLess)</h1>
        <p class="report-sub">Project Report</p>

        <div class="meta-block">
            <p><strong>Submitted to :</strong> Mr Ravi Vishwakarma Sir</p>
            <p><strong>Department:</strong> Computer Science & Engineering (AI & ML)</p>
            <p><strong>University:</strong> Shri Ramswaroop Memorial University (SRMU), Lucknow</p>
            <p><strong>Submitted By:</strong> Akanksha Sharma</p>
            <p><strong>Course:</strong> B.Tech CSE (AI & ML)</p>
            <p><strong>Academic Year:</strong> 2026–2027</p>
        </div>

        <h2 class="sec-heading">1. CERTIFICATE</h2>
        <p>This is to certify that Akanksha Sharma, a student of B.Tech Computer Science & Engineering (Artificial Intelligence and Machine Learning), has successfully developed the project entitled <strong>"Smart Queue Management System (QueueLess)"</strong> as part of the academic curriculum.</p>
        <p>The project demonstrates the practical application of web development technologies, backend Spring Boot microservices, and core data structure concepts.</p>

        <h2 class="sec-heading">2. ACKNOWLEDGEMENT</h2>
        <p>I would like to express my sincere gratitude to my faculty members and project guide for their valuable guidance and support throughout the development of this project.</p>
        <p>I am also thankful to Shri Ramswaroop Memorial University for providing the opportunity to develop this project and enhance my technical knowledge.</p>

        <h2 class="sec-heading">3. ABSTRACT</h2>
        <p>The <strong>Smart Queue Management System (QueueLess)</strong> is a web-based application designed to simplify and improve campus administrative queueing and appointment scheduling activities.</p>
        <p>Traditional campus administrative services involve manual record-keeping and long physical queues for certificate issuance, document verification, and clearance, which can be time-consuming and difficult to maintain.</p>
        <p>This project provides a digital platform where students can book service tokens remotely, choose preferred morning or afternoon visit slots, and upload verification documents.</p>
        <p>Administrative staff can authenticate securely, review attached documents, schedule official slots, and call students using automated audio announcements. The system is developed using Java, Spring Boot, H2 Database, HTML, CSS, and JavaScript.</p>

        <h2 class="sec-heading">4. INTRODUCTION</h2>
        <p>An administrative office is an important part of educational institutions. Managing student visits, certificate requests, and document approvals manually can create difficulties and congestion.</p>
        <p>The Smart Queue Management System aims to digitize campus queue operations through an organized web application, allowing students to access services without waiting in physical lines.</p>
    </div>

    <!-- ================= PAGE 2 ================= -->
    <div class="page">
        <p>It allows students and administrative officers to manage tokens and appointment schedules smoothly without maintaining manual registers.</p>

        <h2 class="sec-heading">5. PROBLEM STATEMENT</h2>
        <p>Traditional campus queue systems face several challenges:</p>
        <ul>
            <li>Manual queue management and crowding at campus office counters.</li>
            <li>Lack of prior document checking, leading to in-person rejections after long waits.</li>
            <li>Time-consuming and unpredictable student waiting periods.</li>
            <li>Absence of designated time slot appointments (working vs. non-working days).</li>
            <li>Risk of misplacing physical records and lack of digital transparency.</li>
            <li>No priority mechanism for urgent certificate or scholarship applications.</li>
        </ul>
        <p>The proposed system addresses these problems through a streamlined digital solution.</p>

        <h2 class="sec-heading">6. OBJECTIVES</h2>
        <p>The main objectives are:</p>
        <ol>
            <li>To develop a user-friendly campus queue and appointment scheduling website.</li>
            <li>To enable remote digital token generation with verified token numbers.</li>
            <li>To allow students to upload verification documents (PDF, JPG, PNG) online.</li>
            <li>To provide flexible appointment slot selection (Morning and Afternoon windows).</li>
            <li>To provide an administrative dashboard for inspecting files and assigning slots.</li>
            <li>To use FIFO and Priority Queue data structures for fair and urgent processing.</li>
            <li>To reduce manual crowd management and improve administrative efficiency.</li>
        </ol>

        <h2 class="sec-heading">7. HARDWARE AND SOFTWARE REQUIREMENTS</h2>
        <p><strong>Hardware Requirements:</strong></p>
        <ul>
            <li>Computer or Laptop.</li>
            <li>Minimum 4 GB RAM.</li>
            <li>Standard processor.</li>
            <li>Keyboard and Mouse.</li>
        </ul>
        <p><strong>Software Requirements:</strong></p>
        <ul>
            <li>Operating System: Windows 10 / 11.</li>
            <li>Code Editor: Visual Studio Code.</li>
            <li>Java Development Kit: OpenJDK 17.</li>
            <li>Browser: Google Chrome / Microsoft Edge.</li>
            <li>Backend Framework: Spring Boot 3.2.4.</li>
            <li>Database: H2 Relational Database Engine.</li>
            <li>Frontend: HTML5, CSS3, JavaScript (ES6+).</li>
        </ul>

        <h2 class="sec-heading">8. TECHNOLOGIES USED</h2>
        <p><strong>Java & Spring Boot:</strong> Used to develop backend REST APIs, queue controller routing, and business logic services.</p>
        <p><strong>Spring Data JPA & Hibernate:</strong> Used for database operations and persisting application requests without complex SQL queries.</p>
        <p><strong>H2 Database:</strong> Embedded SQL database used to store token records persistently in a local data file.</p>
        <p><strong>HTML5 & CSS3:</strong> Used to build clean, responsive user interfaces for both Student and Administrative portals.</p>
        <p><strong>JavaScript:</strong> Used for asynchronous API communication (Fetch API), dynamic pass generation, and Web Audio API counter chime sounds.</p>
    </div>

    <!-- ================= PAGE 3 ================= -->
    <div class="page">
        <h2 class="sec-heading">9. SYSTEM DESIGN</h2>
        <p>The system follows a Model-View-Controller (MVC) client-server architecture.</p>
        <p><strong>Working Process:</strong></p>
        <ol>
            <li>Student opens the QueueLess website and selects "Student Portal".</li>
            <li>Student enters details (Name, Roll No, Service), selects preferred slot, and attaches verification document.</li>
            <li>The system generates a unique token number (T1, T2) and saves records in the H2 database.</li>
            <li>An official digital campus pass is displayed with print and copy options.</li>
            <li>Administrative staff signs in to the admin terminal with authorized credentials.</li>
            <li>Staff inspects attached documents, confirms/assigns official visit slots, and approves or rejects the request.</li>
            <li>Staff calls the next token, triggering an audio chime and updating the live queue board.</li>
        </ol>

        <h2 class="sec-heading">10. MODULES OF THE PROJECT</h2>
        <p><strong>Module 1: Portal Gateway Hub</strong><br>
        Provides the main landing interface for navigating to Student and Administrative portals.</p>

        <p><strong>Module 2: Student Token Booking</strong><br>
        Allows students to enter roll details, choose administrative services, and reserve tokens.</p>

        <p><strong>Module 3: Slot Scheduling Engine</strong><br>
        Enables students and administrators to choose Morning, Afternoon, or custom visit times.</p>

        <p><strong>Module 4: Document Upload & Verification</strong><br>
        Handles secure file uploading and allows administrators to preview attached documents in-browser.</p>

        <p><strong>Module 5: Digital Campus Pass</strong><br>
        Displays official token pass with student details, assigned time slot, and printable receipt.</p>

        <p><strong>Module 6: Administrative Workstation & Auth</strong><br>
        Secures administrative operations with session tokens, credential verification, and status controls.</p>

        <p><strong>Module 7: Counter Calling & Live Board</strong><br>
        Dispatches tokens using FIFO and Priority Queues with real-time public board display and audio ding chimes.</p>

        <h2 class="sec-heading">11. IMPLEMENTATION</h2>
        <p>The project was implemented using Visual Studio Code and Java 17.</p>
        <p>The development process included:</p>
        <ul>
            <li>Creating relational entity models and status enumerations using Spring Data JPA.</li>
            <li>Implementing token booking, document serving, and slot scheduling REST endpoints.</li>
            <li>Building in-memory FIFO LinkedList and PriorityQueue structures for token routing.</li>
            <li>Designing responsive web pages using HTML5 and CSS3 styling.</li>
            <li>Writing JavaScript logic for form submissions, live data polling, and Web Audio API chime synthesis.</li>
            <li>Testing token creation, document retrieval, and counter calling functionality.</li>
        </ul>
    </div>

    <!-- ================= PAGE 4 ================= -->
    <div class="page">
        <h2 class="sec-heading">12. TESTING</h2>
        <p>The following tests were performed:</p>
        <table class="test-table">
            <thead>
                <tr>
                    <th style="width: 45%;">Test Case</th>
                    <th style="width: 55%;">Expected Result</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Open portal website</td>
                    <td>Gateway Hub displayed with Student and Admin options</td>
                </tr>
                <tr>
                    <td>Book a token with details</td>
                    <td>Token generated (e.g. T1) and digital pass displayed</td>
                </tr>
                <tr>
                    <td>Attach verification document</td>
                    <td>File saved in server upload directory with preview link</td>
                </tr>
                <tr>
                    <td>Admin login authentication</td>
                    <td>Admin terminal unlocks with authorized credentials</td>
                </tr>
                <tr>
                    <td>Assign official visit slot</td>
                    <td>Official afternoon/working slot updated in record</td>
                </tr>
                <tr>
                    <td>Call next student token</td>
                    <td>Next token popped from queue and audio chime plays</td>
                </tr>
                <tr>
                    <td>Refresh webpage</td>
                    <td>Saved token data and application records persist in database</td>
                </tr>
            </tbody>
        </table>

        <h2 class="sec-heading">13. ADVANTAGES</h2>
        <ul>
            <li>Eliminates long physical waiting lines at administrative counters.</li>
            <li>Saves valuable student and staff time through organized scheduling.</li>
            <li>Document pre-screening prevents avoidable counter rejections.</li>
            <li>Dual queueing (FIFO + Priority) ensures urgent certificates receive fast service.</li>
            <li>100% digital pass reduces paper token waste.</li>
            <li>Embedded H2 database requires no external server setup.</li>
        </ul>

        <h2 class="sec-heading">14. LIMITATIONS</h2>
        <ul>
            <li>Requires a phone or computer with internet/intranet access.</li>
            <li>Files are stored locally on server storage rather than cloud object storage.</li>
            <li>Automated SMS and WhatsApp notifications are not included in the basic version.</li>
        </ul>

        <h2 class="sec-heading">15. FUTURE SCOPE</h2>
        <p>The project can be enhanced by introducing:</p>
        <ol>
            <li>SMS and WhatsApp notifications when token turn is near.</li>
            <li>QR code-based token identification and physical counter scanner.</li>
            <li>Multi-counter distribution across multiple department desks.</li>
            <li>University Single Sign-On (SSO / LDAP) integration.</li>
        </ol>

        <h2 class="sec-heading">16. CONCLUSION</h2>
        <p>The Smart Queue Management System (QueueLess) successfully demonstrates how web technologies and Java Spring Boot can simplify campus administrative queueing. It replaces crowded physical lines with organized digital appointments, pre-verified documents, and automated counter notifications.</p>

        <h2 class="sec-heading">17. REFERENCES</h2>
        <p>1. Spring Boot Documentation – https://spring.io/projects/spring-boot<br>
        2. MDN Web Docs – https://developer.mozilla.org/<br>
        3. W3Schools Web Tutorials – https://www.w3schools.com/<br>
        4. Oracle Java Documentation – https://docs.oracle.com/en/java/</p>

        <div class="footer-signoff">
            <p><strong>PROJECT TITLE: SMART QUEUE MANAGEMENT SYSTEM (QueueLess)</strong></p>
            <p><strong>Submitted By:</strong> Akanksha Sharma &nbsp;|&nbsp; <strong>Department:</strong> CSE (AI & ML) &nbsp;|&nbsp; <strong>University:</strong> Shri Ramswaroop Memorial University (SRMU)</p>
        </div>
    </div>

</body>
</html>
'''

with open('QueueLess_4Pages_Report.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Generated QueueLess_4Pages_Report.html successfully")

