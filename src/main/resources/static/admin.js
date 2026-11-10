document.addEventListener('DOMContentLoaded', () => {
    // --- Administrative Authentication & Session Management ---
    const adminLoginScreen = document.getElementById('admin-login-screen');
    const adminAppLayout = document.getElementById('admin-app-layout');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminInputUser = document.getElementById('admin-input-user');
    const adminInputPass = document.getElementById('admin-input-pass');
    const adminRememberMe = document.getElementById('admin-remember-me');
    const btnToggleEye = document.getElementById('btn-toggle-eye');
    const authAlert = document.getElementById('auth-alert');
    const authAlertMsg = document.getElementById('auth-alert-msg');
    const btnLoginSubmit = document.getElementById('btn-login-submit');

    const headerDisplayName = document.getElementById('header-display-name');
    const sidebarDisplayName = document.getElementById('sidebar-display-name');
    const btnHeaderLogout = document.getElementById('btn-header-logout');
    const btnSidebarLogout = document.getElementById('btn-sidebar-logout');

    let currentAdminSession = null;
    let pollInterval = null;

    function getSavedSession() {
        const sessionStr = sessionStorage.getItem('queueless_admin_session') || localStorage.getItem('queueless_admin_session');
        if (!sessionStr) return null;
        try {
            return JSON.parse(sessionStr);
        } catch (e) {
            return null;
        }
    }

    function saveSession(sessionData, remember) {
        currentAdminSession = sessionData;
        sessionStorage.setItem('queueless_admin_session', JSON.stringify(sessionData));
        if (remember) {
            localStorage.setItem('queueless_admin_session', JSON.stringify(sessionData));
        } else {
            localStorage.removeItem('queueless_admin_session');
        }
    }

    function clearSession() {
        currentAdminSession = null;
        sessionStorage.removeItem('queueless_admin_session');
        localStorage.removeItem('queueless_admin_session');
    }

    function getAdminToken() {
        return currentAdminSession ? currentAdminSession.token : '';
    }

    function getAdminHeaders(extraHeaders = {}) {
        return {
            'Content-Type': 'application/json',
            'X-Admin-Token': getAdminToken(),
            ...extraHeaders
        };
    }

    function showAuthAlert(msg) {
        if (!authAlert) return;
        authAlertMsg.textContent = msg;
        authAlert.style.display = 'flex';
        authAlert.classList.remove('auth-alert-error');
        // trigger animation restart
        void authAlert.offsetWidth;
        authAlert.classList.add('auth-alert-error');
    }

    function hideAuthAlert() {
        if (authAlert) authAlert.style.display = 'none';
    }

    // Toggle password eye visibility
    if (btnToggleEye && adminInputPass) {
        btnToggleEye.addEventListener('click', () => {
            const isPass = adminInputPass.type === 'password';
            adminInputPass.type = isPass ? 'text' : 'password';
            btnToggleEye.textContent = isPass ? '🔒' : '👁️';
        });
    }

    function unlockAdminWorkstation(sessionData) {
        currentAdminSession = sessionData;
        if (adminLoginScreen) adminLoginScreen.style.display = 'none';
        if (adminAppLayout) adminAppLayout.style.display = 'flex';

        const name = sessionData.displayName || sessionData.username || 'Admin Officer';
        if (headerDisplayName) headerDisplayName.textContent = name;
        if (sidebarDisplayName) sidebarDisplayName.textContent = name;

        // Start workstation services
        updateMetrics();
        loadAdminTable();

        if (!pollInterval) {
            pollInterval = setInterval(() => {
                if (!currentAdminSession) return;
                updateMetrics();
                const activeTab = document.querySelector('.tab-pane.active');
                if (activeTab && activeTab.id === 'admin-live-board') {
                    loadLiveBoard();
                }
                if (activeTab && activeTab.id === 'admin-counter') {
                    loadCounterDesk();
                }
            }, 4000);
        }
    }

    function lockAdminWorkstation() {
        clearSession();
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
        if (adminAppLayout) adminAppLayout.style.display = 'none';
        if (adminLoginScreen) adminLoginScreen.style.display = 'flex';
        if (adminInputPass) adminInputPass.value = '';
        hideAuthAlert();
    }

    async function handleLoginSubmit(e) {
        if (e) e.preventDefault();
        const username = adminInputUser.value.trim();
        const password = adminInputPass.value.trim();

        if (!username || !password) {
            showAuthAlert('Please enter both administrative name and password.');
            return;
        }

        hideAuthAlert();
        btnLoginSubmit.disabled = true;
        btnLoginSubmit.innerHTML = `<span>Verifying credentials...</span>`;

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                const remember = adminRememberMe ? adminRememberMe.checked : true;
                saveSession(data, remember);
                unlockAdminWorkstation(data);
            } else {
                showAuthAlert(data.message || 'Access Denied: Invalid Administrative Name or Password. Students cannot access this block.');
            }
        } catch (err) {
            showAuthAlert('Unable to reach authentication server. Please ensure server is running.');
        } finally {
            btnLoginSubmit.disabled = false;
            btnLoginSubmit.innerHTML = `<span>Unlock Administrative Workstation</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        }
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleLoginSubmit);
    }

    const btnAutofillAdmin = document.getElementById('btn-autofill-admin');
    if (btnAutofillAdmin && adminInputUser && adminInputPass) {
        btnAutofillAdmin.addEventListener('click', () => {
            adminInputUser.value = 'admin';
            adminInputPass.value = 'admin123';
            hideAuthAlert();
            adminInputPass.focus();
        });
    }

    async function handleLogout() {
        if (confirm('Are you sure you want to sign out from the Administrative Workstation?')) {
            try {
                await fetch('/api/admin/logout', {
                    method: 'POST',
                    headers: getAdminHeaders()
                });
            } catch (ignored) {}
            lockAdminWorkstation();
        }
    }

    if (btnHeaderLogout) btnHeaderLogout.addEventListener('click', handleLogout);
    if (btnSidebarLogout) btnSidebarLogout.addEventListener('click', handleLogout);

    // Initial session verification
    async function initAuthCheck() {
        const saved = getSavedSession();
        if (saved && saved.token) {
            try {
                const res = await fetch('/api/admin/verify', {
                    headers: { 'X-Admin-Token': saved.token }
                });
                if (res.ok) {
                    unlockAdminWorkstation(saved);
                    return;
                }
            } catch (e) {
                console.warn('Failed to verify stored session', e);
            }
        }
        lockAdminWorkstation();
    }

    initAuthCheck();

    // --- Navigation Tabs ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-desc');

    const tabMeta = {
        'admin-applications': {
            title: 'Administrative Block Counter & Slot Manager',
            desc: 'Assign afternoon slots on working/non-working days, review attached documents, and update token status.'
        },
        'admin-counter': {
            title: 'Active Counter Calling Terminal',
            desc: 'Live desk counter station for calling next students and managing walk-in completions.'
        },
        'admin-live-board': {
            title: 'Live Campus Announcement Board Preview',
            desc: 'Real-time display showing the current public queue status.'
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

            if (tabId === 'admin-applications') loadAdminTable();
            if (tabId === 'admin-counter') loadCounterDesk();
            if (tabId === 'admin-live-board') loadLiveBoard();
        });
    });

    // --- Audio Ding Chime on Call Next ---
    function playChime() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        } catch (e) {
            // Audio context not allowed or not supported
        }
    }

    // --- Metrics Loader ---
    async function updateMetrics() {
        if (!currentAdminSession) return;
        try {
            const [queueRes, appsRes] = await Promise.all([
                fetch('/api/queue'),
                fetch('/api/applications')
            ]);
            const queue = await queueRes.json();
            const apps = await appsRes.json();

            const statTotal = document.getElementById('stat-total');
            const statPending = document.getElementById('stat-pending');
            const statApproved = document.getElementById('stat-approved');
            const statQueue = document.getElementById('stat-queue');

            if (statTotal) statTotal.textContent = apps.length;
            if (statPending) statPending.textContent = apps.filter(a => a.status === 'PENDING').length;
            if (statApproved) statApproved.textContent = apps.filter(a => a.status === 'APPROVED').length;
            if (statQueue) statQueue.textContent = queue.length;
        } catch (err) {
            console.error('Error fetching metrics', err);
        }
    }

    // --- Applications Table & Filters ---
    let allApplications = [];
    let currentServingToken = null;
    let targetTokenForSlot = null;

    const tbody = document.getElementById('admin-table-body');
    const searchInput = document.getElementById('admin-search-input');
    const statusFilter = document.getElementById('admin-status-filter');
    const btnRefresh = document.getElementById('btn-refresh-table');

    async function loadAdminTable() {
        if (!tbody || !currentAdminSession) return;
        try {
            const res = await fetch('/api/applications');
            allApplications = await res.json();
            renderTable();
        } catch (e) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error loading applications.</td></tr>`;
        }
    }

    function renderTable() {
        if (!tbody) return;
        const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const filterVal = statusFilter ? statusFilter.value : 'ALL';

        let filtered = allApplications.filter(app => {
            const matchesQuery = !q || 
                app.tokenNumber.toLowerCase().includes(q) ||
                app.studentName.toLowerCase().includes(q) ||
                app.rollNumber.toLowerCase().includes(q) ||
                app.serviceRequested.toLowerCase().includes(q);

            const matchesStatus = filterVal === 'ALL' || app.status === filterVal;
            return matchesQuery && matchesStatus;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center muted">No matching student applications found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(app => {
            const statusClass = `status-${app.status.toLowerCase().replace('_', '-')}`;
            const docBadge = app.documentPath 
                ? `<a href="/api/document/${app.tokenNumber}" target="_blank" class="badge-link">📄 View File</a>` 
                : `<span class="muted" style="font-size:0.8rem;">None</span>`;

            const studentPrefDisplay = app.preferredTime 
                ? `<span class="badge-slot-requested">📅 ${app.preferredTime}</span>` 
                : `<span class="muted" style="font-size:0.8rem;">Standard Working Hours</span>`;

            const adminSlotDisplay = app.adminSlot 
                ? `<span class="badge-slot-assigned">🕒 ${app.adminSlot}</span>`
                : `<button class="btn-assign-slot-inline" onclick="window.openSlotModal('${app.tokenNumber}', '${app.studentName.replace(/'/g, "\\'")}', '${(app.preferredTime || '').replace(/'/g, "\\'")}')" title="Designate Official Afternoon/Working Slot">+ Assign Slot / Time</button>`;

            return `
                <tr>
                    <td><strong class="token-text" style="font-family: var(--font-mono); font-size: 1.05rem;">${app.tokenNumber}</strong></td>
                    <td>
                        <div style="font-weight: 600; color: #fff;">${app.studentName}</div>
                        <small class="muted" style="font-size: 0.78rem;">Roll: ${app.rollNumber}</small>
                    </td>
                    <td><span class="service-pill">${app.serviceRequested}</span></td>
                    <td>${studentPrefDisplay}</td>
                    <td>${docBadge}</td>
                    <td>${adminSlotDisplay}</td>
                    <td><span class="status-pill ${statusClass}">${app.status}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-action btn-action-approve" onclick="window.updateStatus('${app.tokenNumber}', 'APPROVED')" title="Approve Request">✓</button>
                            <button class="btn-action btn-action-reject" onclick="window.handleReject('${app.tokenNumber}')" title="Reject / Correction">✕</button>
                            <button class="btn-action btn-action-slot" onclick="window.openSlotModal('${app.tokenNumber}', '${app.studentName.replace(/'/g, "\\'")}', '${(app.preferredTime || '').replace(/'/g, "\\'")}')" title="Assign Afternoon / Working Day Slot">🕒</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (searchInput) searchInput.addEventListener('input', renderTable);
    if (statusFilter) statusFilter.addEventListener('change', renderTable);
    if (btnRefresh) btnRefresh.addEventListener('click', () => {
        loadAdminTable();
        updateMetrics();
    });

    // Make action handlers globally available
    window.updateStatus = async function(token, status, note = '') {
        if (!currentAdminSession) {
            lockAdminWorkstation();
            return;
        }
        try {
            const res = await fetch(`/api/application/${token}/status`, {
                method: 'POST',
                headers: getAdminHeaders(),
                body: JSON.stringify({ status: status, staffNote: note })
            });
            if (res.status === 401) {
                alert('Session expired or unauthorized. Please log in as Administrative Staff.');
                lockAdminWorkstation();
                return;
            }
            if (!res.ok) throw new Error('Status update failed');
            loadAdminTable();
            updateMetrics();
        } catch (err) {
            alert(err.message);
        }
    };

    window.handleReject = function(token) {
        const reason = prompt('Please specify rejection or correction reason for this student:', 'Missing official fee clearance document');
        if (reason !== null) {
            window.updateStatus(token, 'REJECTED', reason || 'Rejected by Administrative Desk');
        }
    };

    // --- Enhanced Modal Slot Assignment ---
    const slotModal = document.getElementById('slot-modal');
    const modalStudentName = document.getElementById('modal-student-name');
    const modalTokenNum = document.getElementById('modal-token-num');
    const modalStudentPreferred = document.getElementById('modal-student-preferred');
    const modalSlotConfirmedPreview = document.getElementById('modal-slot-confirmed-preview');
    const adminSlotPresetBtns = document.querySelectorAll('.admin-slot-preset-btn');
    const adminModalDate = document.getElementById('admin-modal-date');
    const adminModalTime = document.getElementById('admin-modal-time');
    const adminModalNote = document.getElementById('admin-modal-note');
    const adminModalTimeChips = document.querySelectorAll('.admin-modal-time-chip');
    const btnSaveSlot = document.getElementById('btn-save-slot');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');

    let adminModalMode = 'PRESET'; // 'PRESET' or 'CUSTOM'

    function formatTime12(t24) {
        if (!t24) return '';
        const [h, m] = t24.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    }

    function updateAdminCustomPreview() {
        if (!adminModalDate || !adminModalTime) return;
        const dVal = adminModalDate.value;
        const tVal = adminModalTime.value;
        const noteVal = adminModalNote ? adminModalNote.value.trim() : '';

        if (!dVal) return;
        try {
            const [y, m, d] = dVal.split('-').map(Number);
            const dtObj = new Date(y, m - 1, d);
            const dateStr = dtObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = formatTime12(tVal);
            let finalStr = `${dateStr} at ${timeStr}`;
            if (noteVal) finalStr += ` (${noteVal})`;
            if (modalSlotConfirmedPreview) modalSlotConfirmedPreview.textContent = finalStr;
        } catch (e) {
            console.error(e);
        }
    }

    window.openSlotModal = function(token, name, preferredTime = '') {
        targetTokenForSlot = token;
        if (modalStudentName) modalStudentName.textContent = name;
        if (modalTokenNum) modalTokenNum.textContent = token;
        if (modalStudentPreferred) modalStudentPreferred.textContent = preferredTime || 'Standard Working Hours';

        // Initialize modal date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const y = tomorrow.getFullYear();
        const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const d = String(tomorrow.getDate()).padStart(2, '0');
        const tomorrowStr = `${y}-${m}-${d}`;

        if (adminModalDate) {
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            adminModalDate.min = todayStr;
            adminModalDate.value = tomorrowStr;
        }

        // Default to first preset
        adminModalMode = 'PRESET';
        adminSlotPresetBtns.forEach((b, idx) => {
            b.classList.toggle('active', idx === 0);
        });
        if (modalSlotConfirmedPreview) {
            const firstSlot = adminSlotPresetBtns[0] ? adminSlotPresetBtns[0].getAttribute('data-slot') : 'Tomorrow Afternoon (01:30 PM - 03:30 PM) [Working Day]';
            modalSlotConfirmedPreview.textContent = firstSlot;
        }

        if (slotModal) slotModal.style.display = 'flex';
    };

    if (btnCloseModal) btnCloseModal.addEventListener('click', () => slotModal.style.display = 'none');
    if (btnCancelModal) btnCancelModal.addEventListener('click', () => slotModal.style.display = 'none');

    // Preset button click
    adminSlotPresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            adminModalMode = 'PRESET';
            adminSlotPresetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const slotVal = btn.getAttribute('data-slot');
            if (modalSlotConfirmedPreview) modalSlotConfirmedPreview.textContent = slotVal;
        });
    });

    // Custom Date & Time listeners
    if (adminModalDate) {
        adminModalDate.addEventListener('input', () => {
            adminModalMode = 'CUSTOM';
            adminSlotPresetBtns.forEach(b => b.classList.remove('active'));
            updateAdminCustomPreview();
        });
    }
    if (adminModalTime) {
        adminModalTime.addEventListener('input', () => {
            adminModalMode = 'CUSTOM';
            adminSlotPresetBtns.forEach(b => b.classList.remove('active'));
            adminModalTimeChips.forEach(c => {
                c.classList.toggle('active-chip', c.getAttribute('data-time') === adminModalTime.value);
            });
            updateAdminCustomPreview();
        });
    }
    if (adminModalNote) {
        adminModalNote.addEventListener('input', () => {
            if (adminModalMode === 'CUSTOM') {
                updateAdminCustomPreview();
            }
        });
    }

    // Modal Time Chips
    adminModalTimeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            adminModalMode = 'CUSTOM';
            adminSlotPresetBtns.forEach(b => b.classList.remove('active'));
            adminModalTimeChips.forEach(c => c.classList.remove('active-chip'));
            chip.classList.add('active-chip');
            if (adminModalTime) adminModalTime.value = chip.getAttribute('data-time');
            updateAdminCustomPreview();
        });
    });

    // Save Assigned Slot
    if (btnSaveSlot) {
        btnSaveSlot.addEventListener('click', async () => {
            if (!targetTokenForSlot) return;
            if (!currentAdminSession) {
                lockAdminWorkstation();
                return;
            }

            const slotVal = modalSlotConfirmedPreview ? modalSlotConfirmedPreview.textContent.trim() : 'Tomorrow Afternoon (01:30 PM - 03:30 PM) [Working Day]';

            try {
                const res = await fetch(`/api/admin/token/${targetTokenForSlot}/slot`, {
                    method: 'PUT',
                    headers: getAdminHeaders(),
                    body: JSON.stringify({ adminSlot: slotVal })
                });
                if (res.status === 401) {
                    alert('Session expired. Please log in again.');
                    lockAdminWorkstation();
                    return;
                }
                if (!res.ok) throw new Error('Failed to assign slot');
                slotModal.style.display = 'none';
                loadAdminTable();
                updateMetrics();
            } catch (err) {
                alert('Slot designation error: ' + err.message);
            }
        });
    }

    // --- Call Next Token Handler ---
    async function triggerCallNext() {
        if (!currentAdminSession) {
            lockAdminWorkstation();
            return;
        }
        try {
            const res = await fetch('/api/token/call-next', {
                method: 'POST',
                headers: getAdminHeaders()
            });
            if (res.status === 401) {
                alert('Access Denied: Administrative login required to call tokens.');
                lockAdminWorkstation();
                return;
            }
            if (res.status === 204) {
                alert('No more students currently waiting in the queue!');
                return;
            }
            const next = await res.json();
            currentServingToken = next.tokenNumber;

            playChime();

            // Update banner
            const banner = document.getElementById('active-call-banner');
            if (banner) {
                document.getElementById('call-token-title').textContent = `Token ${next.tokenNumber}`;
                document.getElementById('call-token-info').textContent = `${next.studentName} (${next.rollNumber}) - ${next.serviceRequested}`;
                banner.style.display = 'flex';
            }

            // Update counter station view if active
            const counterLiveToken = document.getElementById('counter-live-token');
            const counterLiveInfo = document.getElementById('counter-live-info');
            if (counterLiveToken) counterLiveToken.textContent = next.tokenNumber;
            if (counterLiveInfo) counterLiveInfo.textContent = `${next.studentName} (${next.rollNumber}) • ${next.serviceRequested}`;

            loadAdminTable();
            loadCounterDesk();
            updateMetrics();
        } catch (e) {
            alert('Error calling next token.');
        }
    }

    const btnCallNext = document.getElementById('btn-call-next');
    const headerBtnCall = document.getElementById('header-btn-call');
    const btnCounterCall = document.getElementById('btn-counter-call');

    if (btnCallNext) btnCallNext.addEventListener('click', triggerCallNext);
    if (headerBtnCall) headerBtnCall.addEventListener('click', triggerCallNext);
    if (btnCounterCall) btnCounterCall.addEventListener('click', triggerCallNext);

    // --- Complete Active Token ---
    async function triggerComplete() {
        if (!currentAdminSession) {
            lockAdminWorkstation();
            return;
        }
        if (!currentServingToken) {
            alert('No active token is currently being called.');
            return;
        }
        try {
            const res = await fetch(`/api/token/complete?token=${currentServingToken}`, {
                method: 'POST',
                headers: getAdminHeaders()
            });
            if (res.status === 401) {
                alert('Session unauthorized. Please log in.');
                lockAdminWorkstation();
                return;
            }
            const banner = document.getElementById('active-call-banner');
            if (banner) banner.style.display = 'none';

            const counterLiveToken = document.getElementById('counter-live-token');
            const counterLiveInfo = document.getElementById('counter-live-info');
            if (counterLiveToken) counterLiveToken.textContent = '--';
            if (counterLiveInfo) counterLiveInfo.textContent = 'All clear. Ready for next student.';

            currentServingToken = null;
            loadAdminTable();
            loadCounterDesk();
            updateMetrics();
        } catch (e) {
            alert('Error completing token.');
        }
    }

    const btnCompleteCurrent = document.getElementById('btn-complete-current');
    const btnCounterComplete = document.getElementById('btn-counter-complete');
    if (btnCompleteCurrent) btnCompleteCurrent.addEventListener('click', triggerComplete);
    if (btnCounterComplete) btnCounterComplete.addEventListener('click', triggerComplete);

    // --- Counter Station Loader ---
    async function loadCounterDesk() {
        if (!currentAdminSession) return;
        try {
            const res = await fetch('/api/queue');
            const queue = await res.json();
            const counterUpcoming = document.getElementById('counter-upcoming-list');
            if (!counterUpcoming) return;

            if (queue.length === 0) {
                counterUpcoming.innerHTML = `<div class="muted text-center" style="padding: 20px;">Queue is currently empty.</div>`;
                return;
            }

            counterUpcoming.innerHTML = queue.slice(0, 5).map((item, idx) => `
                <div class="upcoming-item">
                    <span class="badge-index">#${idx + 1}</span>
                    <strong style="font-family: var(--font-mono);">${item.tokenNumber}</strong>
                    <div>
                        <strong>${item.studentName}</strong>
                        <small class="muted" style="display:block;">${item.serviceRequested}</small>
                    </div>
                    <span class="status-pill status-${item.status.toLowerCase().replace('_', '-')}">${item.status}</span>
                </div>
            `).join('');
        } catch (e) {
            console.error('Error loading counter preview', e);
        }
    }

    // --- Live Board Tab Loader ---
    async function loadLiveBoard() {
        if (!currentAdminSession) return;
        try {
            const res = await fetch('/api/queue');
            const queue = await res.json();

            const servingToken = document.getElementById('admin-serving-token');
            const servingDetails = document.getElementById('admin-serving-details');
            const nextToken = document.getElementById('admin-next-token');
            const nextDetails = document.getElementById('admin-next-details');
            const tbodyLive = document.getElementById('admin-live-queue-body');

            if (queue.length > 0) {
                if (servingToken) servingToken.textContent = queue[0].tokenNumber;
                if (servingDetails) servingDetails.textContent = `${queue[0].serviceRequested} • Counter 1`;
            } else {
                if (servingToken) servingToken.textContent = '--';
                if (servingDetails) servingDetails.textContent = 'All counters clear';
            }

            if (queue.length > 1) {
                if (nextToken) nextToken.textContent = queue[1].tokenNumber;
                if (nextDetails) nextDetails.textContent = `Next up: ${queue[1].studentName}`;
            } else {
                if (nextToken) nextToken.textContent = '--';
                if (nextDetails) nextDetails.textContent = 'No one waiting';
            }

            if (tbodyLive) {
                if (queue.length === 0) {
                    tbodyLive.innerHTML = `<tr><td colspan="6" class="text-center muted">No tokens waiting in queue.</td></tr>`;
                } else {
                    tbodyLive.innerHTML = queue.map((item, index) => `
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
            console.error('Error loading live board', e);
        }
    }
});
