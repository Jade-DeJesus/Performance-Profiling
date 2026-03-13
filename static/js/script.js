// Global State
let currentStep = 1;
let datasetSize = 0;
let currentImpl = 'hashing';

// Initialize Charts
let timeChart, memoryChart, detailedChart;

document.addEventListener('DOMContentLoaded', () => {
    // File Upload handling
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('file-upload');

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
        uploadArea.style.backgroundColor = 'var(--blue-bg)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.backgroundColor = '#fafafa';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.backgroundColor = '#fafafa';
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // Implementation Select tracking
    const implSelect = document.getElementById('impl-select');
    implSelect.addEventListener('change', (e) => {
        currentImpl = e.target.value;
        const implText = e.target.options[e.target.selectedIndex].text;
        document.getElementById('current-impl-text').innerText = implText;
    });
});

function handleFileUpload(file) {
    // Simulate loading a file
    datasetSize = 50000; // Mock size for file upload 

    // Animate transition to Step 2
    goToStep(2);
    document.getElementById('loaded-records').innerText = datasetSize.toLocaleString();
}

function generateData(records) {
    datasetSize = records;

    // Simulate generation time
    const btn = event.currentTarget;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-blue" style="font-size: 1.5rem;"></i>';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.style.pointerEvents = 'auto';

        document.getElementById('loaded-records').innerText = records.toLocaleString();

        // Update max values for inputs based on dataset size
        document.getElementById('search-ops').value = Math.min(1000, records);
        document.getElementById('insert-ops').value = Math.min(100, records);
        document.getElementById('delete-ops').value = Math.min(100, records);

        goToStep(2);
    }, 600);
}

function goToStep(step) {
    // Update Stepper UI
    document.querySelectorAll('.step').forEach((el, index) => {
        if (index + 1 <= step) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Hide all tabs, show target tab
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));

    if (step === 1) document.getElementById('tab-import').classList.add('active');
    if (step === 2) document.getElementById('tab-benchmark').classList.add('active');
    if (step === 3) {
        document.getElementById('tab-results').classList.add('active');
        renderCharts(); // Render charts when moving to step 3
    }

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startBenchmark() {
    const btn = event.currentTarget;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running...';
    btn.disabled = true;

    // Grab configuration
    const searchOps = parseInt(document.getElementById('search-ops').value) || 0;
    const insertOps = parseInt(document.getElementById('insert-ops').value) || 0;
    const deleteOps = parseInt(document.getElementById('delete-ops').value) || 0;

    const implSelect = document.getElementById('impl-select');
    const implText = implSelect.options[implSelect.selectedIndex].text;

    // Simulate Network Request/Benchmark Execution via timeout
    setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.disabled = false;

        // Update Results UI
        document.getElementById('result-impl-used').innerText = implText;

        // Mocking Data Variation based on implementation selection
        let mSearch = currentImpl === 'hashing' ? 1.5 : 0.8;
        let mInsert = currentImpl === 'hashing' ? 0.2 : 0.5;
        let mDelete = currentImpl === 'hashing' ? 0.3 : 0.6;

        document.getElementById('kpi-total-time').innerText = (461200000.048 * mSearch).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
        document.getElementById('kpi-avg-time').innerText = (533333.361 * mSearch).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });

        // Dynamic analysis text
        let analysisText = "";
        if (currentImpl === 'hashing') {
            analysisText = "The Hashing-based Indexing provided extremely fast insertion and deletion times (O(1) complexity), making it highly efficient for dynamic datasets. However, memory overhead was slightly higher due to hash table allocation, and range queries were not supported optimally.";
        } else {
            analysisText = "The Distribution-Aware Hybrid Indexing (Interpolation-Binary Search) excelled in search operations, providing O(log(log n)) average time complexity. This is highly optimal for large, uniformly distributed datasets. Insertion and deletion were slightly slower due to index reorganization requirements.";
        }
        document.getElementById('analysis-text').innerText = analysisText;

        goToStep(3);
    }, 1500);
}

function renderCharts() {
    const timeCtx = document.getElementById('timeChart').getContext('2d');
    const memCtx1 = document.getElementById('memoryChart1').getContext('2d');
    const detCtx = document.getElementById('detailedChart').getContext('2d');

    // Destroy existing charts to avoid overlay issues when re-running
    if (timeChart) timeChart.destroy();
    if (memoryChart) memoryChart.destroy();
    if (detailedChart) detailedChart.destroy();

    // Shared Colors
    const blueColor = '#3b82f6';
    const greenColor = '#10b981';

    // Mock Data modifers based on impl
    const isHash = currentImpl === 'hashing';

    // 1. Time Chart (Bar)
    timeChart = new Chart(timeCtx, {
        type: 'bar',
        data: {
            labels: ['SEARCH', 'INSERT', 'DELETE'],
            datasets: [{
                label: 'Execution Time (ns)',
                data: [
                    isHash ? 1400000 : 800000,
                    isHash ? 200000 : 500000,
                    isHash ? 300000 : 600000
                ],
                backgroundColor: blueColor,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
                x: { grid: { display: false } }
            }
        }
    });

    // 2. Memory Chart (Line)
    memoryChart = new Chart(memCtx1, {
        type: 'line',
        data: {
            labels: ['SEARCH', 'INSERT', 'DELETE'],
            datasets: [{
                label: 'Memory Usage (MB)',
                data: [
                    isHash ? 0.4 : 0.2,
                    isHash ? 1.2 : 0.8,
                    isHash ? 1.1 : 0.7
                ],
                borderColor: greenColor,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 4, grid: { borderDash: [5, 5] } },
                x: { grid: { display: false } }
            }
        }
    });

    // 3. Detailed Combined Chart
    detCtx.canvas.parentNode.style.height = '350px';
    detailedChart = new Chart(detCtx, {
        type: 'line',
        data: {
            labels: ['SEARCH', 'INSERT', 'DELETE'],
            datasets: [
                {
                    label: 'Execution Time (ns)',
                    data: [
                        isHash ? 1400000 : 800000,
                        isHash ? 200000 : 500000,
                        isHash ? 300000 : 600000
                    ],
                    borderColor: blueColor,
                    backgroundColor: blueColor,
                    yAxisID: 'y',
                    tension: 0.1,
                    pointStyle: 'circle',
                    pointRadius: 6
                },
                {
                    label: 'Memory Usage (MB)',
                    data: [
                        isHash ? 0.4 : 0.2,
                        isHash ? 1.2 : 0.8,
                        isHash ? 1.1 : 0.7
                    ],
                    borderColor: greenColor,
                    backgroundColor: greenColor,
                    yAxisID: 'y1',
                    tension: 0.1,
                    borderDash: [5, 5],
                    pointStyle: 'rect',
                    pointRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Time (ns)' },
                    grid: { borderDash: [5, 5] }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Memory (MB)' },
                    max: 4,
                    grid: { drawOnChartArea: false }
                },
                x: { grid: { display: false } }
            }
        }
    });
}
