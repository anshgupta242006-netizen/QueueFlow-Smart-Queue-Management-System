document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Tabs ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-desc');

    const tabMeta = {
        'student-view': {
            title: 'Student Token Booking & Pass',
            desc: 'Reserve your token, upload required verification documents, and select your preferred slot.'
        },
        'admin-view': {
            title: 'Administrative Block Desk',
            desc: 'Manage afternoon slots on working/non-working days, inspect verification documents, and approve applications.'
        },
        'display-view': {
            title: 'Live Queue Announcement Board',
            desc: 'Real-time status display for campus administrative counters.'
        }
    };

    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            navItems.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            if (tabMeta[tabId]) {
                pageTitle.textContent = tabMeta[tabId].title;
                pageDesc.textContent = tabMeta[tabId].desc;
            }

            if (tabId === 'admin-view') loadAdminTable();
            if (tabId === 'display-view') loadLiveBoard();
        });
    });

    // --- Preferred Time Slot Custom Picker Toggle ---
    const timeSlotType = document.getElementById('timeSlotType');
    const preferredTimeInput = document.getElementById('preferredTime');
    if (timeSlotType && preferredTimeInput) {
        timeSlotType.addEventListener('change', () => {
            if (timeSlotType.value === 'CUSTOM') {
                preferredTimeInput.style.display = 'block';
                preferredTimeInput.focus();
            } else {
                preferredTimeInput.style.display = 'none';
            }
        });
    }

    // --- File Dropzone Name Preview ---
    const fileInput = document.getElementById('document');
    const fileNamePreview = document.getElementById('selected-file-name');
    if (fileInput && fileNamePreview) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNamePreview.textContent = '📎 Attached: ' + fileInput.files[0].name;
            } else {
                fileNamePreview.textContent = '';
            }
        });
    }

    // --- Metrics Loader ---
    async function updateMetrics() {
        try {
            const [queueRes, appsRes] = await Promise.all([
                fetch('/api/queue'),
                fetch('/api/applications')
            ]);
            const queue = await queueRes.json();
            const apps = await appsRes.json();

            document.getElementById('stat-total').textContent = apps.length;
            document.getElementById('stat-pending').textContent = apps.filter(a => a.status === 'PENDING').length;
            document.getElementById('stat-approved').textContent = apps.filter(a => a.status === 'APPROVED').length;
            document.getElementById('stat-queue').textContent = queue.length;
        } catch (err) {
            console.error('Error fetching metrics', err);
        }
    }

    // --- Student Booking Form Submission ---
    const bookForm = document.getElementById('book-form');
    const bookingContainer = document.getElementById('booking-container');
    const myTokenPass = document.getElementById('my-token-pass');

    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btnBook = document.getElementById('btn-book');
        btnBook.disabled = true;
        btnBook.querySelector('span').textContent = 'Issuing Token...';

        const formData = new FormData();
        formData.append('studentName', document.getElementById('studentName').value.trim());
        formData.append('rollNumber', document.getElementById('rollNumber').value.trim());
        formData.append('serviceRequested', document.getElementById('serviceRequested').value);

        // Time slot selection
        let chosenSlot = timeSlotType.value;
        if (chosenSlot === 'CUSTOM' && preferredTimeInput.value) {
            chosenSlot = preferredTimeInput.value.replace('T', ' ');
        }
        formData.append('preferredTime', chosenSlot);

        // File upload
        if (fileInput && fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }

        try {
            const res = await fetch('/api/token/book', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Token booking failed.');
            const token = await res.json();

            // Render ONLY this user's token pass
            renderUserTokenPass(token);

            // Hide booking container, show digital token pass
            bookingContainer.style.display = 'none';
            myTokenPass.style.display = 'block';

            updateMetrics();
        } catch (error) {
            alert('Error booking token: ' + error.message);
        } finally {
            btnBook.disabled = false;
            btnBook.querySelector('span').textContent = 'Get My Digital Token';
        }
    });

    let currentStudentToken = null;

    function renderUserTokenPass(token) {
        currentStudentToken = token.tokenNumber;
        document.getElementById('pass-token-number').textContent = token.tokenNumber;
        document.getElementById('pass-name').textContent = token.studentName;
        document.getElementById('pass-roll').textContent = token.rollNumber;
        document.getElementById('pass-service').textContent = token.serviceRequested;
        document.getElementById('pass-pref-time').textContent = token.preferredTime || 'Immediate Walk-in';

        // Admin slot status
        const adminSlotEl = document.getElementById('pass-admin-slot');
        if (token.adminSlot) {
            adminSlotEl.textContent = '📅 ' + token.adminSlot;
            adminSlotEl.className = 'text-emerald';
        } else {
            adminSlotEl.textContent = '⏳ Pending Admin Schedule (Afternoon/Working Day slot will be assigned)';
            adminSlotEl.className = 'text-amber';
        }

        // Status badge
        const statusEl = document.getElementById('pass-status');
        statusEl.textContent = token.status;
        statusEl.className = 'status-pill status-' + token.status.toLowerCase().replace('_', '-');

        // Document link
        const docContainer = document.getElementById('pass-doc-link');
        if (token.documentPath) {
            docContainer.innerHTML = `<a href="/api/document/${token.tokenNumber}" target="_blank" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;">📄 View Uploaded Document</a>`;
        } else {
            docContainer.innerHTML = `<span class="muted">No document uploaded</span>`;
        }

        document.getElementById('pass-issued-date').textContent = 'Issued ' + new Date().toLocaleTimeString();
    }

    // Student Time Change Buttons
    const btnShowEditTime = document.getElementById('btn-show-edit-time');
    const studentEditTimeBox = document.getElementById('student-edit-time-box');
    const btnCancelStudentTime = document.getElementById('btn-cancel-student-time');
    const btnSaveStudentTime = document.getElementById('btn-save-student-time');
    const studentNewTimePreset = document.getElementById('student-new-time-preset');

    if (btnShowEditTime && studentEditTimeBox) {
        btnShowEditTime.addEventListener('click', () => {
            studentEditTimeBox.style.display = 'block';
        });

        btnCancelStudentTime.addEventListener('click', () => {
            studentEditTimeBox.style.display = 'none';
        });

        btnSaveStudentTime.addEventListener('click', async () => {
            if (!currentStudentToken) return;
            const newTime = studentNewTimePreset.value;
            try {
                const res = await fetch(`/api/student/token/${currentStudentToken}/time`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ preferredTime: newTime })
                });
                if (!res.ok) throw new Error('Failed to update preferred time');
                const updated = await res.json();
                renderUserTokenPass(updated);
                studentEditTimeBox.style.display = 'none';
                alert('Your preferred appointment time was updated to: ' + newTime);
            } catch (err) {
                alert('Error updating time: ' + err.message);
            }
        });
    }

    // "Book Another Token" button
    document.getElementById('btn-book-another').addEventListener('click', () => {
        bookForm.reset();
        fileNamePreview.textContent = '';
        myTokenPass.style.display = 'none';
        bookingContainer.style.display = 'block';
    });

    // "Track My Token" quick search
    document.getElementById('btn-lookup-token').addEventListener('click', async () => {
        const query = document.getElementById('lookup-token-input').value.trim();
        if (!query) return;

        try {
            const res = await fetch(`/api/token/${query}`);
            if (!res.ok) throw new Error('Token not found');
            const token = await res.json();
            renderUserTokenPass(token);
            bookingContainer.style.display = 'none';
            myTokenPass.style.display = 'block';
        } catch (e) {
            alert(`Token "${query}" was not found. Please verify the token number.`);
        }
    });

    // --- Administrative Block Table & Management ---
    let targetTokenForSlot = null;

    async function loadAdminTable() {
        const tbody = document.getElementById('admin-table-body');
        try {
            const res = await fetch('/api/applications');
            const apps = await res.json();

            if (apps.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="text-center muted">No applications registered yet.</td></tr>`;
                return;
            }

            tbody.innerHTML = apps.map(app => {
                const statusClass = 'status-' + app.status.toLowerCase().replace('_', '-');
                const docLink = app.documentPath 
                    ? `<a href="/api/document/${app.tokenNumber}" target="_blank" class="btn btn-outline" style="padding: 2px 8px; font-size: 0.8rem;">📄 View</a>` 
                    : '<span class="muted">None</span>';
                
                const adminSlotDisplay = app.adminSlot 
                    ? `<span style="color:#059669; font-weight:600;">${app.adminSlot}</span>` 
                    : `<button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.78rem;" onclick="openSlotModal('${app.tokenNumber}', '${app.studentName}')">⏱️ Assign Slot</button>`;

                return `
                    <tr>
                        <td><strong style="font-family: var(--font-mono); font-size: 1.05rem;">${app.tokenNumber}</strong></td>
                        <td>
                            <strong>${app.studentName}</strong><br>
                            <small class="muted">Roll: ${app.rollNumber}</small>
                        </td>
                        <td>${app.serviceRequested}</td>
                        <td><small>${app.preferredTime || 'Immediate'}</small></td>
                        <td>${adminSlotDisplay}</td>
                        <td>${docLink}</td>
                        <td><span class="status-pill ${statusClass}">${app.status}</span></td>
                        <td>
                            <div style="display: flex; gap: 6px;">
                                <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" onclick="openSlotModal('${app.tokenNumber}', '${app.studentName}')">Slot</button>
                                <button class="btn btn-emerald" style="padding: 4px 8px; font-size: 0.75rem;" onclick="updateStatus('${app.tokenNumber}', 'APPROVED')">Approve</button>
                                <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.75rem; color:#ef4444;" onclick="updateStatus('${app.tokenNumber}', 'REJECTED')">Reject</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        } catch (e) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error loading applications.</td></tr>`;
        }
    }

    // Modal Slot Assignment
    const slotModal = document.getElementById('slot-modal');
    const modalStudentName = document.getElementById('modal-student-name');
    const modalTokenNum = document.getElementById('modal-token-num');
    const modalSlotPreset = document.getElementById('modal-slot-preset');
    const modalCustomGroup = document.getElementById('modal-custom-slot-group');
    const modalCustomInput = document.getElementById('modal-custom-slot');

    window.openSlotModal = function(token, name) {
        targetTokenForSlot = token;
        modalStudentName.textContent = name;
        modalTokenNum.textContent = token;
        slotModal.style.display = 'flex';
    };

    document.getElementById('btn-close-modal').addEventListener('click', () => slotModal.style.display = 'none');
    document.getElementById('btn-cancel-modal').addEventListener('click', () => slotModal.style.display = 'none');

    modalSlotPreset.addEventListener('change', () => {
        if (modalSlotPreset.value === 'CUSTOM') {
            modalCustomGroup.style.display = 'block';
        } else {
            modalCustomGroup.style.display = 'none';
        }
    });

    document.getElementById('btn-save-slot').addEventListener('click', async () => {
        if (!targetTokenForSlot) return;
        let slotVal = modalSlotPreset.value;
        if (slotVal === 'CUSTOM') {
            const dtVal = document.getElementById('modal-custom-datetime').value;
            const textVal = modalCustomInput.value.trim();
            if (dtVal && textVal) {
                slotVal = dtVal.replace('T', ' ') + ' - ' + textVal;
            } else if (dtVal) {
                slotVal = dtVal.replace('T', ' ');
            } else {
                slotVal = textVal || 'Afternoon Working Slot';
            }
        }

        try {
            const res = await fetch(`/api/admin/token/${targetTokenForSlot}/slot`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminSlot: slotVal })
            });
            if (!res.ok) throw new Error('Failed to assign slot');
            slotModal.style.display = 'none';
            loadAdminTable();
            updateMetrics();
        } catch (err) {
            alert('Error updating slot: ' + err.message);
        }
    });

    // Update Status
    window.updateStatus = async function(token, status) {
        try {
            const res = await fetch(`/api/application/${token}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: status, staffNote: `Updated by Admin Desk` })
            });
            if (!res.ok) throw new Error('Status update failed');
            loadAdminTable();
            updateMetrics();
        } catch (err) {
            alert(err.message);
        }
    };

    // Call Next Token in Queue
    let currentServingToken = null;
    document.getElementById('btn-call-next').addEventListener('click', async () => {
        try {
            const res = await fetch('/api/token/call-next', { method: 'POST' });
            if (res.status === 204) {
                alert('No more students currently waiting in the queue!');
                return;
            }
            const next = await res.json();
            currentServingToken = next.tokenNumber;

            const banner = document.getElementById('active-call-banner');
            document.getElementById('call-token-title').textContent = `Token ${next.tokenNumber}`;
            document.getElementById('call-token-info').textContent = `${next.studentName} (${next.rollNumber}) - ${next.serviceRequested}`;
            banner.style.display = 'flex';

            loadAdminTable();
            updateMetrics();
        } catch (e) {
            alert('Error calling next token.');
        }
    });

    // Complete active token
    document.getElementById('btn-complete-active').addEventListener('click', async () => {
        if (!currentServingToken) return;
        try {
            await fetch(`/api/token/complete?token=${currentServingToken}`, { method: 'POST' });
            document.getElementById('active-call-banner').style.display = 'none';
            currentServingToken = null;
            loadAdminTable();
            updateMetrics();
        } catch (e) {
            alert('Error completing token.');
        }
    });

    // --- Live Board Loader & Polling ---
    async function loadLiveBoard() {
        try {
            const res = await fetch('/api/queue');
            const queue = await res.json();

            if (queue.length > 0) {
                document.getElementById('live-serving-token').textContent = queue[0].tokenNumber;
                document.getElementById('live-serving-details').textContent = `${queue[0].serviceRequested} • Counter 1`;
            } else {
                document.getElementById('live-serving-token').textContent = '--';
                document.getElementById('live-serving-details').textContent = 'All counters currently clear';
            }

            if (queue.length > 1) {
                document.getElementById('live-next-token').textContent = queue[1].tokenNumber;
                document.getElementById('live-next-details').textContent = `Next up: ${queue[1].studentName}`;
            } else {
                document.getElementById('live-next-token').textContent = '--';
                document.getElementById('live-next-details').textContent = 'No one waiting';
            }

            // Populate public queue table
            const tbody = document.getElementById('live-queue-body');
            if (queue.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center muted">No tokens waiting in queue.</td></tr>`;
            } else {
                tbody.innerHTML = queue.map((item, index) => `
                    <tr>
                        <td><strong>#${index + 1}</strong></td>
                        <td><strong style="font-family: var(--font-mono);">${item.tokenNumber}</strong></td>
                        <td>${item.studentName}</td>
                        <td>${item.serviceRequested}</td>
                        <td>${item.adminSlot || item.preferredTime || 'Standard Queue'}</td>
                        <td><span class="status-pill status-${item.status.toLowerCase().replace('_', '-')}">${item.status}</span></td>
                    </tr>
                `).join('');
            }
        } catch (e) {
            console.error('Error loading live board', e);
        }
    }

    // Auto-poll live board and metrics every 4s
    setInterval(() => {
        updateMetrics();
        const activeTab = document.querySelector('.tab-pane.active');
        if (activeTab && activeTab.id === 'display-view') {
            loadLiveBoard();
        }
    }, 4000);

    // Initial load
    updateMetrics();
});
