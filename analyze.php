<?php
// ========== Set Response Header ==========
header('Content-Type: application/json');

// ========== Helper Function to Return JSON Error ==========
function returnError($errorMessage) {
    echo json_encode([
        'score' => 0,
        'found' => [],
        'missing' => [],
        'error' => $errorMessage
    ]);
    exit;
}

// ========== Validate Request Method ==========
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Metode permintaan tidak valid. POST diperlukan.');
}

// ========== Validate File Upload ==========
if (!isset($_FILES['resumeFile'])) {
    returnError('Tidak ada file yang diunggah.');
}

$uploadedFile = $_FILES['resumeFile'];

// Check for upload errors
if ($uploadedFile['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'File melebihi batas unggah PHP.',
        UPLOAD_ERR_FORM_SIZE => 'File melebihi batas ukuran formulir.',
        UPLOAD_ERR_PARTIAL => 'File hanya diunggah sebagian.',
        UPLOAD_ERR_NO_FILE => 'Tidak ada file yang diunggah.',
        UPLOAD_ERR_NO_TMP_DIR => 'Folder sementara hilang.',
        UPLOAD_ERR_CANT_WRITE => 'Gagal menulis file ke disk.',
        UPLOAD_ERR_EXTENSION => 'Ekstensi PHP memblokir unggahan.'
    ];
    $errorMsg = $errorMessages[$uploadedFile['error']] ?? 'Kesalahan unggah yang tidak diketahui.';
    returnError($errorMsg);
}

// Validate file extension
$fileExtension = strtolower(pathinfo($uploadedFile['name'], PATHINFO_EXTENSION));
if ($fileExtension !== 'pdf') {
    returnError('Invalid file extension. Only PDF files are allowed.');
}

// Validate file is a PDF by checking magic bytes
// PDF files start with %PDF
$handle = fopen($uploadedFile['tmp_name'], 'rb');
if ($handle === false) {
    returnError('Cannot read uploaded file.');
}
$fileHeader = fread($handle, 4);
fclose($handle);

if (strpos($fileHeader, '%PDF') === false) {
    returnError('File is not a valid PDF. Invalid file header.');
}

// Validate file size (10 MB max)
$maxFileSize = 10 * 1024 * 1024; // 10 MB
if ($uploadedFile['size'] > $maxFileSize) {
    returnError('File size exceeds 10 MB limit.');
}

// ========== Validate Job Description ==========
if (!isset($_POST['jobDescription']) || empty(trim($_POST['jobDescription']))) {
    returnError('Job description is required.');
}

$jobDescription = $_POST['jobDescription'];

// ========== Create Uploads Directory ==========
$uploadsDir = __DIR__ . '/uploads';
if (!is_dir($uploadsDir)) {
    if (!mkdir($uploadsDir, 0755, true)) {
        returnError('Gagal membuat direktori unggahan.');
    }
}

// ========== Move Uploaded File ==========
$tempFileName = uniqid('resume_', true) . '.pdf';
$tempFilePath = $uploadsDir . '/' . $tempFileName;

if (!move_uploaded_file($uploadedFile['tmp_name'], $tempFilePath)) {
    returnError('Gagal memindahkan file yang diunggah ke direktori sementara.');
}

// ========== Call Python Analysis Script ==========
try {
    // Construct command with properly escaped arguments
    $pythonScript = __DIR__ . '/analyze.py';
    // Use full path to Python executable
    $pythonExecutable = 'C:\\Users\\Izzat Fauzan\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';
    $command = escapeshellarg($pythonExecutable) . ' ' . escapeshellarg($pythonScript) . ' ' . escapeshellarg($tempFilePath) . ' ' . escapeshellarg($jobDescription);

    // Execute Python script
    $output = shell_exec($command . ' 2>&1');

    // Check if execution was successful
    if ($output === null) {
        throw new Exception('Gagal menjalankan skrip Python.');
    }

    // Clean up temporary file
    if (file_exists($tempFilePath)) {
        unlink($tempFilePath);
    }

    // Parse and validate JSON output
    $result = json_decode($output, true);

    if ($result === null) {
        // If JSON parsing failed, return the raw output for debugging
        returnError('Respons JSON tidak valid dari mesin analisis. Output: ' . substr($output, 0, 200));
    }

    // Return result
    echo json_encode($result);

} catch (Exception $e) {
    // Clean up temporary file on error
    if (file_exists($tempFilePath)) {
        unlink($tempFilePath);
    }

    returnError('Kesalahan: ' . $e->getMessage());
}
?>
