// ========== DOM Elements ==========
const resumeFileInput = document.getElementById('resumeFile');
const fileNameDisplay = document.getElementById('fileName');
const jobDescriptionTextarea = document.getElementById('jobDescription');
const charCountDisplay = document.getElementById('charCount');
const analyzeBtn = document.getElementById('analyzeBtn');

const loadingSpinner = document.getElementById('loadingSpinner');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');
const dismissErrorBtn = document.getElementById('dismissErrorBtn');

const matchScoreDisplay = document.getElementById('matchScore');
const scoreBar = document.getElementById('scoreBar');
const foundKeywordsList = document.getElementById('foundKeywords');
const missingKeywordsList = document.getElementById('missingKeywords');
const resetBtn = document.getElementById('resetBtn');

// ========== Constants ==========
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

// ========== Event Listeners ==========

// File input change - validate and display filename
resumeFileInput.addEventListener('change', handleFileSelect);

// Job description input - update character count and enable button
jobDescriptionTextarea.addEventListener('input', handleJobDescriptionInput);

// Analyze button click
analyzeBtn.addEventListener('click', handleAnalyzeClick);

// Reset button click
resetBtn.addEventListener('click', handleReset);

// Dismiss error button click
dismissErrorBtn.addEventListener('click', () => {
    errorSection.classList.add('hidden');
});

// ========== Event Handlers ==========

/**
 * Handle file selection from input
 */
function handleFileSelect(event) {
    const file = event.target.files[0];

    if (!file) {
        fileNameDisplay.textContent = 'Tidak ada file yang dipilih';
        fileNameDisplay.classList.remove('active');
        updateAnalyzeButtonState();
        return;
    }

    // Validate file type
    if (!validateFileType(file)) {
        showError('Jenis file tidak valid. Harap unggah file PDF saja.');
        resumeFileInput.value = '';
        fileNameDisplay.textContent = 'Tidak ada file yang dipilih';
        fileNameDisplay.classList.remove('active');
        updateAnalyzeButtonState();
        return;
    }

    // Validate file size
    if (!validateFileSize(file)) {
        showError(`Ukuran file melebihi batas 10 MB. File Anda adalah ${(file.size / 1024 / 1024).toFixed(2)} MB.`);
        resumeFileInput.value = '';
        fileNameDisplay.textContent = 'Tidak ada file yang dipilih';
        fileNameDisplay.classList.remove('active');
        updateAnalyzeButtonState();
        return;
    }

    // Display filename
    fileNameDisplay.textContent = `✓ ${file.name}`;
    fileNameDisplay.classList.add('active');

    // Close error section if it was open
    errorSection.classList.add('hidden');

    // Update button state
    updateAnalyzeButtonState();
}

/**
 * Handle job description textarea input
 */
function handleJobDescriptionInput(event) {
    const charCount = event.target.value.length;
    charCountDisplay.textContent = `${charCount} karakter`;
    updateAnalyzeButtonState();
}

/**
 * Handle analyze button click
 */
async function handleAnalyzeClick() {
    // Hide sections
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');

    // Show loading spinner
    loadingSpinner.classList.remove('hidden');

    try {
        // Get form data
        const file = resumeFileInput.files[0];
        const jobDescription = jobDescriptionTextarea.value;

        // Create FormData object
        const formData = new FormData();
        formData.append('resumeFile', file);
        formData.append('jobDescription', jobDescription);

        // Send POST request to analyze.php
        const response = await fetch('analyze.php', {
            method: 'POST',
            body: formData
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`Kesalahan HTTP: ${response.status}`);
        }

        // Parse JSON response
        const data = await response.json();

        // Hide loading spinner
        loadingSpinner.classList.add('hidden');

        // Check for errors in response
        if (data.error) {
            showError(data.error);
            return;
        }

        // Display results
        displayResults(data);
    } catch (error) {
        console.error('Error during analysis:', error);
        loadingSpinner.classList.add('hidden');
        showError(`Terjadi kesalahan selama analisis: ${error.message}`);
    }
}

/**
 * Handle reset button click
 */
function handleReset() {
    // Clear form
    resumeFileInput.value = '';
    jobDescriptionTextarea.value = '';
    fileNameDisplay.textContent = 'Tidak ada file yang dipilih';
    fileNameDisplay.classList.remove('active');
    charCountDisplay.textContent = '0 karakter';

    // Hide results and error sections
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');

    // Reset button state
    updateAnalyzeButtonState();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== Validation Functions ==========

/**
 * Validate file type (must be PDF)
 */
function validateFileType(file) {
    const allowedType = 'application/pdf';
    const allowedExtension = '.pdf';

    // Check MIME type
    if (file.type !== allowedType) {
        return false;
    }

    // Check file extension
    if (!file.name.toLowerCase().endsWith(allowedExtension)) {
        return false;
    }

    return true;
}

/**
 * Validate file size
 */
function validateFileSize(file) {
    return file.size <= MAX_FILE_SIZE;
}

/**
 * Update analyze button state based on form validity
 */
function updateAnalyzeButtonState() {
    const hasFile = resumeFileInput.files.length > 0;
    const hasJobDescription = jobDescriptionTextarea.value.trim().length > 0;

    analyzeBtn.disabled = !(hasFile && hasJobDescription);
}

// ========== Display Functions ==========

/**
 * Display results on the page
 */
function displayResults(data) {
    // Update match score
    matchScoreDisplay.textContent = data.score;
    scoreBar.style.width = `${data.score}%`;

    // Update score bar color based on score
    if (data.score >= 75) {
        scoreBar.style.backgroundColor = 'rgba(22, 163, 74, 0.8)'; // Green
    } else if (data.score >= 50) {
        scoreBar.style.backgroundColor = 'rgba(251, 191, 36, 0.8)'; // Yellow
    } else {
        scoreBar.style.backgroundColor = 'rgba(239, 68, 68, 0.8)'; // Red
    }

    // Populate found keywords
    foundKeywordsList.innerHTML = '';
    if (data.found && data.found.length > 0) {
        data.found.forEach(keyword => {
            const li = document.createElement('li');
            li.textContent = keyword;
            foundKeywordsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'Tidak ada kata kunci yang cocok ditemukan';
        li.style.fontStyle = 'italic';
        li.style.color = '#94a3b8';
        foundKeywordsList.appendChild(li);
    }

    // Populate missing keywords
    missingKeywordsList.innerHTML = '';
    if (data.missing && data.missing.length > 0) {
        data.missing.forEach(keyword => {
            const li = document.createElement('li');
            li.textContent = keyword;
            missingKeywordsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'Semua kata kunci cocok!';
        li.style.fontStyle = 'italic';
        li.style.color = '#16a34a';
        missingKeywordsList.appendChild(li);
    }

    // Show results section
    resultsSection.classList.remove('hidden');
}

/**
 * Show error message
 */
function showError(message) {
    errorText.textContent = message;
    errorSection.classList.remove('hidden');
}

// ========== Initialize ==========

// Set initial button state
updateAnalyzeButtonState();