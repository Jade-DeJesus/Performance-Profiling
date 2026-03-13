document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation Logic
    const tabItems = document.querySelectorAll('.tab-item-modern');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        tabItems.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        const targetTab = Array.from(tabItems).find(t => t.getAttribute('data-tab') === tabId);
        if (targetTab) {
            targetTab.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        }
    }

    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            switchTab(item.getAttribute('data-tab'));
        });
    });

    // Run Another Benchmark Button
    const runAnotherBtn = document.getElementById('run-another-btn');
    if (runAnotherBtn) {
        runAnotherBtn.addEventListener('click', () => {
            // Reset to Tab 2
            switchTab('tab-benchmarks');

            // Reset op statuses
            document.querySelectorAll('.op-time').forEach(el => {
                el.innerHTML = '-- <span class="ms">ms</span>';
            });
            document.querySelectorAll('.op-status').forEach(el => {
                el.textContent = 'Pending';
                el.className = 'op-status status-pending';
            });
        });
    }

    // Mock Data Generation
    const generateBtns = document.querySelectorAll('.generate-buttons .outline-btn-large');
    const loadedRecordsEl = document.getElementById('loaded-records');

    generateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const records = btn.getAttribute('data-records');
            let numStr = '0';
            if (records === '1k') numStr = '1,000';
            if (records === '10k') numStr = '10,000';
            if (records === '100k') numStr = '100,000';
            if (records === '1m') numStr = '1,000,000';

            loadedRecordsEl.textContent = numStr;

            // Automatically switch to tab 2 to simulate workflow
            switchTab('tab-benchmarks');
        });
    });

    // Mock Benchmark Run targeting nanosecond mockups
    const runBtn = document.querySelector('.run-benchmark-btn');
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            const originalText = runBtn.innerHTML;
            runBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinning">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                Running...
            `;
            runBtn.disabled = true;
            runBtn.style.opacity = '0.7';

            // Stage 1: Search
            const statuses = document.querySelectorAll('.op-status');
            const times = document.querySelectorAll('.op-time');

            if (statuses.length > 0) {
                statuses[0].textContent = 'Running';
                statuses[0].className = 'op-status status-running';
            }

            setTimeout(() => {
                if (times.length > 0 && statuses.length > 0) {
                    times[0].innerHTML = '461.2 <span class="ms">ms</span>';
                    statuses[0].textContent = 'Complete';
                    statuses[0].className = 'op-status status-complete';
                }

                // Stage 2: Insert
                if (statuses.length > 1) {
                    statuses[1].textContent = 'Running';
                    statuses[1].className = 'op-status status-running';
                }

                setTimeout(() => {
                    if (times.length > 1 && statuses.length > 1) {
                        times[1].innerHTML = '0.1 <span class="ms">ms</span>';
                        statuses[1].textContent = 'Complete';
                        statuses[1].className = 'op-status status-complete';
                    }

                    // Stage 3: Delete
                    if (statuses.length > 2) {
                        statuses[2].textContent = 'Running';
                        statuses[2].className = 'op-status status-running';
                    }

                    setTimeout(() => {
                        if (times.length > 2 && statuses.length > 2) {
                            times[2].innerHTML = '53.3 <span class="ms">ms</span>';
                            statuses[2].textContent = 'Complete';
                            statuses[2].className = 'op-status status-complete';
                        }

                        // Finish
                        runBtn.innerHTML = originalText;
                        runBtn.disabled = false;
                        runBtn.style.opacity = '1';

                        // Automatically switch to results tab
                        setTimeout(() => {
                            switchTab('tab-results');
                        }, 200);

                    }, 200);
                }, 200);
            }, 200);
        });
    }

    // Algorithm Selection Logic
    const algoSelect = document.getElementById('algorithm-select');
    const algoDesc = document.getElementById('algorithm-desc');
    const infoAlgo = document.getElementById('info-algo');
    const resultAlgo = document.getElementById('result-algo');

    if (algoSelect) {
        algoSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            let name = 'Hashing';
            let desc = 'Hashing provides constant-time average performance for lookups, inserts, and deletes.';

            if (val === 'ibs') {
                name = 'Interpolation-Binary Search';
                desc = 'Interpolation-Binary Search provides O(log(log n)) average performance on uniformly distributed data.';
            }

            if (algoDesc) algoDesc.textContent = desc;
            if (infoAlgo) infoAlgo.textContent = name;
            if (resultAlgo) resultAlgo.textContent = name;
        });
    }

    // Add a simple basic rotation class in JS for the "Running" state SVG
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spinning { animation: spin 2s linear infinite; }
    `;
    document.head.appendChild(style);
});
