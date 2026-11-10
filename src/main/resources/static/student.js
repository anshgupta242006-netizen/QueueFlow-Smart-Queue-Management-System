document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Tabs ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-desc');

    const tabMeta = {
        'book-view': {
            title: 'Student Token Booking',
            desc: 'Reserve your token, upload required verification documents, and select your preferred slot.'
        },
        'track-view': {
            title: 'Track My Token & Appointment',
            desc: 'Check your current administrative slot, approval status, and notes from campus staff.'
        },
        'queue-view': {
            title: 'Live Campus Queue Board',
            desc: 'Real-time status display for campus administrative counters.'
        }
    };

    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            navItems.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(tabId);
            if (targetPane) targetPane.classList.add('active');

            if (tabMeta[tabId]) {
                pageTitle.textContent = tabMeta[tabId].title;
                pageDesc.textContent = tabMeta[tabId].desc;
            }

            if (tabId === 'queue-view') {
                loadLiveBoard();
            }
        });
    });

    // --- Interactive Visual Slot Cards, Mode Switching & Direct Time Selection ---
    const btnModePreset = document.getElementById('btn-mode-preset');
    const btnModeCustom = document.getElementById('btn-mode-custom');
    const presetSlotsView = document.getElementById('preset-slots-view');
    const customTimePickerBox = document.getElementById('custom-time-picker-box');
    const slotCards = document.querySelectorAll('.slot-card');
    const timeSlotType = document.getElementById('timeSlotType');
    const preferredTimeInput = document.getElementById('preferredTime');
    const pickerDate = document.getElementById('pickerDate');
    const pickerTime = document.getElementById('pickerTime');
    const selectedSlotText = document.getElementById('selected-slot-text');
    const timeChips = document.querySelectorAll('.btn-time-chip');
    const btnTomorrowAfternoon = document.getElementById('btn-tomorrow-afternoon');
    const btnQuickNow = document.getElementById('btn-quick-now');

    let currentSlotMode = 'PRESET'; // 'PRESET' or 'CUSTOM'

    // Format local date helper: YYYY-MM-DD
    function getLocalDateString(d = new Date()) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Set minimum date to today
    if (pickerDate) {
        const todayStr = getLocalDateString();
        pickerDate.min = todayStr;
        pickerDate.value = todayStr;
    }

    function formatTime12Hour(time24) {
        if (!time24) return '';
        const [h, m] = time24.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    }

    function updateCustomSlotPreview() {
        const dStr = pickerDate ? pickerDate.value : '';
        const tStr = pickerTime ? pickerTime.value : '14:00';
        if (!dStr) return;

        try {
            const [y, m, d] = dStr.split('-').map(Number);
            const dateObj = new Date(y, m - 1, d);
            const dateLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const timeLabel = formatTime12Hour(tStr);
            const fullSlotStr = `${dateLabel} at ${timeLabel}`;
            
            if (selectedSlotText) {
                selectedSlotText.textContent = fullSlotStr;
            }
            if (preferredTimeInput) {
                preferredTimeInput.value = `${dStr}T${tStr}`;
            }
            if (timeSlotType) {
                timeSlotType.value = 'CUSTOM';
            }
        } catch (e) {
            console.error('Date preview error:', e);
        }
    }

    // Switch to Preset Mode
    if (btnModePreset) {
        btnModePreset.addEventListener('click', () => {
            currentSlotMode = 'PRESET';
            btnModePreset.classList.add('active-mode');
            if (btnModeCustom) btnModeCustom.classList.remove('active-mode');
            if (presetSlotsView) presetSlotsView.style.display = 'block';
            if (customTimePickerBox) customTimePickerBox.style.display = 'none';

            // Restore active card text
            const activeCard = document.querySelector('.slot-card.active-slot');
            if (activeCard && selectedSlotText) {
                selectedSlotText.textContent = activeCard.getAttribute('data-slot');
                if (timeSlotType) timeSlotType.value = activeCard.getAttribute('data-slot');
            }
        });
    }

    // Switch to Custom Date & Time Mode
    if (btnModeCustom) {
        btnModeCustom.addEventListener('click', () => {
            currentSlotMode = 'CUSTOM';
            btnModeCustom.classList.add('active-mode');
            if (btnModePreset) btnModePreset.classList.remove('active-mode');
            if (presetSlotsView) presetSlotsView.style.display = 'none';
            if (customTimePickerBox) customTimePickerBox.style.display = 'block';
            updateCustomSlotPreview();
        });
    }

    // Preset Slot Card Clicks
    slotCards.forEach(card => {
        card.addEventListener('click', () => {
            slotCards.forEach(c => c.classList.remove('active-slot'));
            card.classList.add('active-slot');
            const slotVal = card.getAttribute('data-slot');
            if (timeSlotType) timeSlotType.value = slotVal;
            if (selectedSlotText) selectedSlotText.textContent = slotVal;
        });
    });

    // Custom Date & Time change listeners
    if (pickerDate) pickerDate.addEventListener('input', updateCustomSlotPreview);
    if (pickerTime) pickerTime.addEventListener('input', () => {
        // Unhighlight chips unless matches
        timeChips.forEach(c => {
            if (c.getAttribute('data-time') === pickerTime.value) {
                c.classList.add('active-chip');
            } else {
                c.classList.remove('active-chip');
            }
        });
        updateCustomSlotPreview();
    });

    // Quick Time Chips
    timeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            timeChips.forEach(c => c.classList.remove('active-chip'));
            chip.classList.add('active-chip');
            const t = chip.getAttribute('data-time');
            if (pickerTime) pickerTime.value = t;
            updateCustomSlotPreview();
        });
    });

    // Quick Tomorrow Afternoon shortcut
    if (btnTomorrowAfternoon) {
        btnTomorrowAfternoon.addEventListener('click', () => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            if (pickerDate) pickerDate.value = getLocalDateString(d);
            if (pickerTime) pickerTime.value = '14:00';
            timeChips.forEach(c => {
                c.classList.toggle('active-chip', c.getAttribute('data-time') === '14:00');
            });
            updateCustomSlotPreview();
        });
    }

    // Quick Next Available shortcut
    if (btnQuickNow) {
        btnQuickNow.addEventListener('click', () => {
            const d = new Date();
            if (pickerDate) pickerDate.value = getLocalDateString(d);
            d.setMinutes(d.getMinutes() + 20); // 20 mins from now
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(Math.ceil(d.getMinutes() / 5) * 5).padStart(2, '0');
            if (pickerTime) pickerTime.value = `${hh}:${mm}`;
            updateCustomSlotPreview();
        });
    }

    // --- Modern File Dropzone & Remove Preview ---
    const fileInput = document.getElementById('document');
    const fileNamePreview = document.getElementById('selected-file-name');
    const dropzone = document.getElementById('dropzone');

    function renderFilePreview() {
        if (!fileNamePreview) return;
        if (fileInput && fileInput.files.length > 0) {
            const f = fileInput.files[0];
            const sizeKb = (f.size / 1024).toFixed(1);
            fileNamePreview.innerHTML = `
                <div class="file-chip-preview">
                    <span>📄 <strong>${f.name}</strong> (${sizeKb} KB)</span>
                    <button type="button" class="btn-remove-file" id="btn-remove-file" title="Remove attached file">&times;</button>
                </div>
            `;
            const btnRemove = document.getElementById('btn-remove-file');
            if (btnRemove) {
                btnRemove.addEventListener('click', (e) => {
                    e.stopPropagation();
                    fileInput.value = '';
                    fileNamePreview.innerHTML = '';
                });
            }
        } else {
            fileNamePreview.innerHTML = '';
        }
    }

    if (dropzone && fileInput) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.add('drag-active');
            });
        });
        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.remove('drag-active');
            });
        });
        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer && e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                renderFilePreview();
            }
        });
        fileInput.addEventListener('change', renderFilePreview);
    }

    // --- Student Booking Form Submission with Smooth Animation ---
    const bookForm = document.getElementById('book-form');
    const bookingContainer = document.getElementById('booking-container');
    const myTokenPass = document.getElementById('my-token-pass');

    let currentStudentToken = null;

    if (bookForm) {
        bookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnBook = document.getElementById('btn-book');
            btnBook.disabled = true;
            btnBook.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-icon" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <span>Securing Your Digital Token...</span>
            `;

            const formData = new FormData();
            formData.append('studentName', document.getElementById('studentName').value.trim());
            formData.append('rollNumber', document.getElementById('rollNumber').value.trim());
            formData.append('serviceRequested', document.getElementById('serviceRequested').value);

            let chosenSlot = timeSlotType ? timeSlotType.value : 'Afternoon (1:30 PM - 3:30 PM) [Working Day]';
            if (currentSlotMode === 'CUSTOM' || chosenSlot === 'CUSTOM') {
                chosenSlot = (selectedSlotText && selectedSlotText.textContent) 
                    ? selectedSlotText.textContent 
                    : (preferredTimeInput && preferredTimeInput.value ? preferredTimeInput.value.replace('T', ' ') : 'Custom Schedule');
            }
            formData.append('preferredTime', chosenSlot);

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

                renderUserTokenPass(token);
                bookingContainer.style.display = 'none';
                myTokenPass.style.display = 'block';
                myTokenPass.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                alert('Error booking token: ' + error.message);
            } finally {
                btnBook.disabled = false;
                btnBook.innerHTML = `
                    <span>Confirm & Generate Digital Token</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                `;
            }
        });
    }

    // --- Copy Token Number Button ---
    const btnCopyToken = document.getElementById('btn-copy-token');
    if (btnCopyToken) {
        btnCopyToken.addEventListener('click', async () => {
            const tokenNumEl = document.getElementById('pass-token-number');
            if (tokenNumEl) {
                const num = tokenNumEl.textContent.trim();
                try {
                    await navigator.clipboard.writeText(num);
                    const originalText = btnCopyToken.innerHTML;
                    btnCopyToken.innerHTML = '✓ Copied ' + num;
                    btnCopyToken.style.color = '#10b981';
                    setTimeout(() => {
                        btnCopyToken.innerHTML = originalText;
                        btnCopyToken.style.color = '';
                    }, 2000);
                } catch (e) {
                    alert('Your Token Number is: ' + num);
                }
            }
        });
    }

    function renderUserTokenPass(token, targetPrefix = 'pass-') {
        currentStudentToken = token.tokenNumber;
        const setTxt = (id, val) => {
            const el = document.getElementById(targetPrefix + id);
            if (el) el.textContent = val;
        };

        setTxt('token-number', token.tokenNumber);
        setTxt('name', token.studentName);
        setTxt('roll', token.rollNumber);
        setTxt('service', token.serviceRequested);
        setTxt('pref-time', token.preferredTime || 'Immediate Walk-in');

        const adminSlotEl = document.getElementById(targetPrefix + 'admin-slot');
        if (adminSlotEl) {
            if (token.adminSlot) {
                adminSlotEl.textContent = '📅 ' + token.adminSlot;
                adminSlotEl.className = 'text-emerald';
            } else {
                adminSlotEl.textContent = '⏳ Pending Admin Schedule (Afternoon/Working day slot will be assigned)';
                adminSlotEl.className = 'text-amber';
            }
        }

        const statusEl = document.getElementById(targetPrefix + 'status');
        if (statusEl) {
            statusEl.textContent = token.status;
            statusEl.className = 'status-pill status-' + token.status.toLowerCase().replace('_', '-');
        }

        const docContainer = document.getElementById(targetPrefix + 'doc-link');
        if (docContainer) {
            if (token.documentPath) {
                docContainer.innerHTML = `<a href="/api/document/${token.tokenNumber}" target="_blank" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;">📄 View Uploaded Document</a>`;
            } else {
                docContainer.innerHTML = `<span class="muted">No document uploaded</span>`;
            }
        }

        const issuedEl = document.getElementById(targetPrefix + 'issued-date');
        if (issuedEl) {
            issuedEl.textContent = 'Active • ' + new Date().toLocaleTimeString();
        }
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

    // Book another token button
    const btnBookAnother = document.getElementById('btn-book-another');
    if (btnBookAnother) {
        btnBookAnother.addEventListener('click', () => {
            if (bookForm) bookForm.reset();
            if (fileNamePreview) fileNamePreview.textContent = '';
            if (myTokenPass) myTokenPass.style.display = 'none';
            if (bookingContainer) bookingContainer.style.display = 'block';
        });
    }

    // --- Track My Token Search ---
    const btnLookup = document.getElementById('btn-lookup-token');
    const lookupInput = document.getElementById('lookup-token-input');
    const trackErrorMsg = document.getElementById('track-error-msg');
    const trackedContainer = document.getElementById('tracked-token-container');

    async function handleLookup() {
        const query = lookupInput.value.trim().toUpperCase();
        if (!query) return;

        trackErrorMsg.style.display = 'none';
        trackedContainer.innerHTML = '';

        try {
            const res = await fetch(`/api/token/${query}`);
            if (!res.ok) throw new Error(`Token "${query}" was not found.`);
            const token = await res.json();

            // Render pass card inside trackedContainer
            const passHtml = `
                <div class="card token-pass-card">
                    <div class="token-pass-header">
                        <div class="pass-chip">OFFICIAL CAMPUS PASS</div>
                        <span class="pass-date">Verified Token</span>
                    </div>

                    <div class="token-main-row">
                        <div class="token-badge-container">
                            <span class="token-caption">TOKEN NUMBER</span>
                            <div class="token-hero-number">${token.tokenNumber}</div>
                            <span class="status-pill status-${token.status.toLowerCase().replace('_', '-')}">${token.status}</span>
                        </div>

                        <div class="pass-details-grid">
                            <div class="detail-box">
                                <span class="label">Student Name</span>
                                <strong>${token.studentName}</strong>
                            </div>
                            <div class="detail-box">
                                <span class="label">Roll Number</span>
                                <strong>${token.rollNumber}</strong>
                            </div>
                            <div class="detail-box">
                                <span class="label">Service Category</span>
                                <strong>${token.serviceRequested}</strong>
                            </div>
                            <div class="detail-box">
                                <span class="label">Student Preferred Time</span>
                                <strong>${token.preferredTime || 'Standard Walk-in'}</strong>
                            </div>
                            <div class="detail-box highlight-slot">
                                <span class="label">Admin Designated Visit Slot</span>
                                <strong class="${token.adminSlot ? 'text-emerald' : 'text-amber'}">
                                    ${token.adminSlot ? '📅 ' + token.adminSlot : '⏳ Pending Schedule (Afternoon/Working Day)'}
                                </strong>
                            </div>
                            <div class="detail-box">
                                <span class="label">Uploaded Document</span>
                                <div>
                                    ${token.documentPath 
                                        ? `<a href="/api/document/${token.tokenNumber}" target="_blank" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;">📄 View Document</a>`
                                        : '<span class="muted">None attached</span>'}
                                </div>
                            </div>
                            ${token.staffNote ? `
                                <div class="detail-box" style="grid-column: 1 / -1; background: #fffbeb; border: 1px solid #fef3c7;">
                                    <span class="label" style="color: #b45309;">Staff Note / Instruction</span>
                                    <p style="font-size: 0.88rem; color: #92400e; margin-top: 2px;">${token.staffNote}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            trackedContainer.innerHTML = passHtml;
        } catch (err) {
            trackErrorMsg.textContent = err.message + ' Please verify your token number (e.g. T1, T2).';
            trackErrorMsg.style.display = 'block';
        }
    }

    if (btnLookup && lookupInput) {
        btnLookup.addEventListener('click', handleLookup);
        lookupInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLookup();
        });
    }

    // --- Live Board Loader ---
    async function loadLiveBoard() {
        try {
            const res = await fetch('/api/queue');
            const queue = await res.json();

            const liveServingToken = document.getElementById('live-serving-token');
            const liveServingDetails = document.getElementById('live-serving-details');
            const liveNextToken = document.getElementById('live-next-token');
            const liveNextDetails = document.getElementById('live-next-details');
            const tbody = document.getElementById('live-queue-body');

            if (queue.length > 0) {
                if (liveServingToken) liveServingToken.textContent = queue[0].tokenNumber;
                if (liveServingDetails) liveServingDetails.textContent = `${queue[0].serviceRequested} • Counter 1`;
            } else {
                if (liveServingToken) liveServingToken.textContent = '--';
                if (liveServingDetails) liveServingDetails.textContent = 'All counters clear';
            }

            if (queue.length > 1) {
                if (liveNextToken) liveNextToken.textContent = queue[1].tokenNumber;
                if (liveNextDetails) liveNextDetails.textContent = `Next up: ${queue[1].studentName}`;
            } else {
                if (liveNextToken) liveNextToken.textContent = '--';
                if (liveNextDetails) liveNextDetails.textContent = 'No one waiting';
            }

            if (tbody) {
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
            }
        } catch (e) {
            console.error('Error loading live queue', e);
        }
    }

    // Auto-poll live board every 4s
    setInterval(() => {
        const queuePane = document.getElementById('queue-view');
        if (queuePane && queuePane.classList.contains('active')) {
            loadLiveBoard();
        }
    }, 4000);

    // Check for hash query (e.g. #track=T1)
    if (window.location.hash.startsWith('#track=')) {
        const tokenQuery = decodeURIComponent(window.location.hash.replace('#track=', ''));
        const trackTabBtn = document.querySelector('[data-tab="track-view"]');
        if (trackTabBtn) trackTabBtn.click();
        if (lookupInput) {
            lookupInput.value = tokenQuery;
            handleLookup();
        }
    }

    // Initial load
    loadLiveBoard();
});
