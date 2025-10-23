# Pencocokan Resume dan Deskripsi Pekerjaan

Aplikasi web untuk menganalisis resume PDF Anda terhadap deskripsi pekerjaan. Dapatkan skor kecocokan dan lihat skill mana saja yang ada di resume Anda dan skill mana yang hilang.

## Daftar Isi

- [Pengenalan](#pengenalan)
- [Fitur](#fitur)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Folder](#struktur-folder)
- [Persyaratan Awal](#persyaratan-awal)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Cara Penggunaan](#cara-penggunaan)
- [Cara Kerja](#cara-kerja)
- [Dokumentasi API](#dokumentasi-api)
- [Kustomisasi](#kustomisasi)
- [Mengatasi Masalah](#mengatasi-masalah)

## Pengenalan

Aplikasi ini membantu pencari kerja dengan memberikan umpan balik langsung. Unggah resume PDF Anda dan tuliskan deskripsi pekerjaan untuk mendapatkan:

- Skor kecocokan yang menunjukkan persentase kesesuaian dengan persyaratan pekerjaan
- Daftar kata kunci dari deskripsi pekerjaan yang ada di resume Anda
- Daftar kata kunci yang hilang dan perlu ditambahkan

Proses pencocokan menggunakan daftar lebih dari 120 skill teknis dan soft skill yang terorganisir per kategori.

### Tangkapan Layar dan Demonstrasi

[Masukkan tangkapan layar interface aplikasi di sini]

[Masukkan GIF demonstrasi proses analisis di sini]

[Masukkan tangkapan layar hasil analisis di sini]

## Fitur

- Frontend yang responsif
- Validasi file PDF pada sisi client
- Pemrosesan asinkron tanpa reload halaman
- Ekstraksi teks dari PDF
- Pencocokan skill menggunakan regex
- Dukungan singkatan (contoh: "ML" = "Machine Learning", "JS" = "JavaScript")
- Perhitungan skor kecocokan otomatis
- Tampilan hasil yang dinamis
- Desain responsif (desktop, tablet, mobile)
- Pesan error yang jelas
- Database skill yang dapat disesuaikan (JSON)

## Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 7.2 atau lebih baru
- **Engine Analisis**: Python 3.6 atau lebih baru
- **Pemrosesan PDF**: Library pdfplumber
- **Database Skill**: JSON

## Struktur Folder

```
resume_parser/
├── README.md                # Penjelasan program
├── index.html               # Halaman HTML utama
├── style.css                # File CSS styling
├── app.js                   # JavaScript frontend
├── analyze.php              # Handler backend PHP
├── analyze.py               # Engine analisis Python
├── skills.json              # Database skill dan pola regex
├── requirements.txt         # Dependensi Python
└── uploads/                 # Penyimpanan sementara PDF yang diunggah
```

### Penjelasan File

- **index.html**: Struktur halaman dengan form input, loading indicator, dan hasil analisis
- **style.css**: Styling profesional, responsif, dengan animasi dan warna hasil
- **app.js**: Validasi file, API calls, dan tampilan hasil dinamis
- **analyze.php**: Handler upload file, validasi, dan eksekusi script Python
- **analyze.py**: Engine utama untuk ekstraksi PDF dan pencocokan skill
- **skills.json**: Database skill terorganisir per kategori dengan pola regex
- **requirements.txt**: Daftar paket Python yang dibutuhkan (pdfplumber)

## Persyaratan Awal

Sebelum memulai, pastikan Anda sudah menginstal:

- Python 3.6 atau lebih baru
- PHP 7.2 atau lebih baru
- Git (untuk clone repository)
- Browser modern (Chrome, Firefox, Edge, Safari)

### Verifikasi Instalasi

Cek versi Python:
```bash
python --version
```

Cek versi PHP:
```bash
php --version
```

## Instalasi

### Langkah 1: Clone Repository

```bash
git clone https://github.com/mizzatfpa/resume_parser.git
cd resume_parser
```

### Langkah 2: Instal Dependensi Python

```bash
pip install -r requirements.txt
```

Ini akan menginstal library `pdfplumber` untuk ekstraksi teks PDF.

Verifikasi instalasi:
```bash
pip list | findstr pdfplumber
```

### Langkah 3: Buat Folder Uploads

Folder `uploads/` seharusnya sudah ada, tapi jika belum:

```bash
mkdir uploads
```

### Langkah 4: Verifikasi Izin Folder

Pastikan folder `uploads/` dapat ditulis:

Windows:
```bash
icacls uploads /grant:r "%USERNAME%:(F)"
```

Linux/Mac:
```bash
chmod 755 uploads
```

## Konfigurasi

### Konfigurasi Path Python

Aplikasi menggunakan path Python yang di-hardcode. Jika instalasi Python Anda berbeda, update `analyze.php`:

Cari baris ini (sekitar baris 87):
```php
$pythonExecutable = 'C:\\Users\\Izzat Fauzan\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';
```

Ganti dengan path Python Anda:

**Windows:**
```bash
python -c "import sys; print(sys.executable)"
```

**Linux/Mac:**
```bash
which python3
```

Kemudian update baris di `analyze.php`:

```php
$pythonExecutable = '/usr/bin/python3';  // Contoh Linux/Mac
```

### Batas Ukuran File

Untuk mengubah ukuran file maksimal, edit `analyze.php` sekitar baris 69:

```php
$maxFileSize = 10 * 1024 * 1024; // 10 MB - ubah nilai ini
```

## Cara Penggunaan

1. Jalankan server PHP development:

```bash
php -S localhost:8000
```

Anda akan melihat output seperti ini:
```
Development Server started at http://localhost:8000
Listening on http://localhost:8000
Press Ctrl-C to quit
```

2. Buka browser dan akses:

```
http://localhost:8000
```

3. Anda akan melihat interface aplikasi Pencocokan Resume

### Cara Menggunakan Aplikasi

1. **Unggah Resume**
   - Klik tombol "Unggah Resume Anda (PDF saja)"
   - Pilih file PDF dari komputer Anda
   - File harus: Format PDF, ukuran maksimal 10 MB

2. **Tuliskan Deskripsi Pekerjaan**
   - Klik text area yang bertuliskan "Tuliskan Deskripsi Pekerjaan di Sini"
   - Tuliskan teks deskripsi pekerjaan
   - Penghitung karakter akan terupdate otomatis

3. **Analisis Kecocokan**
   - Klik tombol "Analisis Kecocokan"
   - Loading indicator akan muncul saat sedang memproses
   - Hasil akan ditampilkan setelah beberapa detik

4. **Lihat Hasil**
   - **Skor Kecocokan**: Persentase kecocokan (0-100%)
   - **Kata Kunci Ditemukan**: Skill dari deskripsi pekerjaan yang ada di resume
   - **Kata Kunci Hilang**: Skill yang perlu dipertimbangkan untuk ditambahkan

5. **Analisis Lagi**
   - Klik "Analisis Lagi" untuk reset dan analisis resume lain

### Contoh Penggunaan

1. Download deskripsi pekerjaan dari situs pencarian kerja
2. Unggah resume PDF Anda
3. Tuliskan deskripsi pekerjaan
4. Tinjau skor kecocokan dan analisis kata kunci
5. Gunakan feedback ini untuk menyesuaikan resume sebelum melamar

## Cara Kerja

### Gambaran Umum Arsitektur

Aplikasi mengikuti arsitektur tiga tingkat:

```
Client (JavaScript)
    |
    | Kirim POST dengan FormData
    v
Server (PHP)
    |
    | Validasi file
    | Simpan PDF sementara
    | Jalankan script Python
    | Bersihkan file
    v
Processor (Python)
    |
    | Ekstrak teks PDF
    | Pencocokan skill dengan regex
    | Hitung skor
    | Return JSON
    |
    v kembali ke JavaScript
Tampilkan Hasil
```

### Alur Data

1. **Client**: User unggah PDF resume dan deskripsi pekerjaan
2. **JavaScript**: Validasi file, buat FormData, kirim POST request
3. **PHP**: Terima request, validasi file, simpan sementara, jalankan Python
4. **Python**: Ekstrak teks PDF, pencocokan skill regex, return JSON
5. **PHP**: Terima JSON dari Python, bersihkan file, kirim hasil ke JavaScript
6. **JavaScript**: Parse JSON, update halaman, tampilkan hasil

### Algoritma Pencocokan Skill

1. **Muat Skill**: Baca pola skill dari `skills.json`
2. **Ekstrak Teks**: Gunakan pdfplumber untuk ekstrak teks dari PDF resume
3. **Cari Skill di Resume**: Terapkan pola regex ke teks resume, kumpulkan skill yang cocok
4. **Cari Skill di JD**: Terapkan pola regex ke teks deskripsi pekerjaan
5. **Hitung Kecocokan**:
   - Kata Kunci Ditemukan = irisan dari (skill resume, skill JD)
   - Kata Kunci Hilang = perbedaan dari (skill JD, skill resume)
   - Skor = (Jumlah Kata Kunci Ditemukan / Total Kata Kunci JD) * 100
6. **Return Hasil**: Kirim JSON dengan skor, ditemukan, hilang, dan error

### Pewarnaan Skor

- Hijau (75-100%): Kecocokan kuat
- Kuning (50-74%): Kecocokan sedang
- Merah (0-49%): Kecocokan lemah

## Dokumentasi API

### Endpoint: `/analyze.php`

**Metode Request**: POST

**Header Request**:
```
Content-Type: multipart/form-data
```

**Body Request**:
```
resumeFile: [File object PDF]
jobDescription: [String teks]
```

**Format Response**: JSON

**Response Sukses**:
```json
{
  "score": 75,
  "found": ["python", "react", "agile", "leadership"],
  "missing": ["docker", "kubernetes", "machine learning"],
  "error": null
}
```

**Response Error**:
```json
{
  "score": 0,
  "found": [],
  "missing": [],
  "error": "Pesan error yang menjelaskan apa yang salah"
}
```

**Pesan Error** (dalam field error):

- "Tidak ada file yang diunggah" - File tidak ada
- "Metode permintaan tidak valid. POST diperlukan" - Request method bukan POST
- "Jenis file tidak valid. Harap unggah file PDF saja" - File bukan PDF
- "File bukan PDF yang valid. Header file tidak valid" - File rusak atau bukan PDF
- "File size exceeds 10 MB limit" - File terlalu besar
- "Deskripsi pekerjaan diperlukan" - Deskripsi pekerjaan kosong
- "Gagal menjalankan skrip Python" - Python execution gagal
- "Tidak ada teks yang dapat diekstrak dari PDF" - PDF kosong atau scan gambar

## Kustomisasi

### Menambah Skill Baru

Edit `skills.json` untuk menambah skill baru atau ubah pola yang ada:

```json
{
  "programming_languages": {
    "bahasa_anda": "\\bbahasa_anda\\b",
    "singkatan": "\\b(?:nama_lengkap|singkatan)\\b"
  }
}
```

Contoh: Tambah Rust jika belum ada
```json
"rust": "\\brust\\b"
```

Contoh: Tambah beberapa variasi
```json
"typescript": "\\b(?:typescript|ts)\\b"
```

### Panduan Pola Regex

- `\b` - Batas kata (memastikan kecocokan kata utuh)
- `(?:...|...)` - Grup non-capture dengan alternatif
- `\s` - Spasi
- `\-` - Tanda hubung literal

Contoh:
```
\bmachine\s?learning\b      - Cocok "machine learning" atau "machinelearning"
\b(?:js|javascript)\b       - Cocok "js" atau "javascript"
\b(?:ml|machine learning)\b - Cocok "ml" atau "machine learning"
```

### Kustomisasi Styling

Ubah `style.css` untuk mengganti warna, font, atau layout:

Variabel warna utama di `:root`:
```css
--primary-color: #2563eb;        /* Biru utama */
--success-color: #16a34a;        /* Hijau untuk kecocokan */
--danger-color: #dc2626;         /* Merah untuk hilang */
--warning-color: #f59e0b;        /* Kuning untuk partial */
```

### Mengubah Bahasa

Semua teks user-facing sudah dalam bahasa Indonesia. Untuk menerjemahkan ke bahasa lain:

1. `index.html` - Label HTML dan teks
2. `app.js` - Pesan JavaScript dan teks error
3. `analyze.php` - Pesan error PHP
4. `analyze.py` - Docstring Python dan pesan error

## Mengatasi Masalah

### Masalah: "Failed to execute Python script"

**Solusi**: 
1. Cek path Python di `analyze.php`
2. Verifikasi Python terinstal: `python --version`
3. Verifikasi pdfplumber terinstal: `pip list | grep pdfplumber`

### Masalah: "File is not a valid PDF"

**Solusi**:
1. Pastikan file adalah PDF asli, bukan dokumen yang di-rename
2. Coba buka PDF di Adobe Reader terlebih dahulu
3. File mungkin rusak - coba PDF lain

### Masalah: "File size exceeds 10 MB limit"

**Solusi**:
1. Pilih file PDF yang lebih kecil
2. Atau ubah batas di `analyze.php` (baris 69)

### Masalah: "Cannot read uploaded file" / "Cannot move uploaded file"

**Solusi**:
1. Cek izin folder `uploads/`
2. Windows: `icacls uploads /grant:r "%USERNAME%:(F)"`
3. Linux/Mac: `chmod 755 uploads`

### Masalah: Tidak ada skill yang ditemukan di hasil

**Kemungkinan penyebab**:
1. PDF adalah gambar scan tanpa OCR - tidak bisa ekstrak teks
2. Deskripsi pekerjaan tidak punya skill yang dikenal dari `skills.json`
3. Skill di PDF tidak cocok dengan pola di `skills.json`

**Solusi**:
1. Gunakan PDF berbasis teks, bukan gambar scan
2. Cek apakah skill ada di `skills.json`
3. Tambah skill baru ke `skills.json`


## Performa dan Keamanan

### Performa

- Waktu ekstraksi PDF tergantung ukuran dan kompleksitas file
- Waktu analisis rata-rata: 1-3 detik
- PDF yang lebih besar (50+ halaman) mungkin 5-10 detik
- Latensi jaringan mempengaruhi waktu response

### Keamanan

Aplikasi mencakup beberapa ukuran keamanan:

- **Validasi File**: Cek tipe file, ekstensi, dan magic bytes
- **Batas Ukuran File**: Mencegah DOS attack via upload besar
- **Shell Escaping**: Gunakan `escapeshellarg()` cegah command injection
- **Input Sanitization**: Validasi semua input user
- **File Cleanup**: Hapus file sementara setelah proses
- **Error Messages**: Pesan error generic, tidak tampilkan path sistem

## Perubahan Versi

### Versi 1.0.0 (Oktober 2025)

- Release pertama
- Upload resume PDF
- Input teks deskripsi pekerjaan
- Pencocokan skill dengan pola regex
- Perhitungan skor kecocokan
- Tampilan hasil dengan kata kunci ditemukan/hilang
- Interface web responsif
- Error handling komprehensif
- Database skill dengan 120+ kata kunci
