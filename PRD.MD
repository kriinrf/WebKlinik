# Product Requirements Document (PRD) - Sistem Informasi Klinik Sejahterah

**Versi:** 3.1 (Refactored for Normalization)
**Nama Aplikasi:** Sistem Informasi Klinik Sejahterah
**Platform:** Web Application (Single Page Application)
**Frontend:** ReactJS + Vite + Tailwind CSS
**Backend:** PHP Native (REST API)
**Database:** MySQL

---

## 1. Latar Belakang & Tujuan
Sistem Informasi Klinik Sejahterah adalah aplikasi berbasis web yang dirancang untuk digitalisasi proses administrasi dan pelayanan medis di klinik. Aplikasi ini bertujuan untuk:
1. Memfasilitasi pendaftaran mandiri (registrasi) bagi pasien dan dokter.
2. Mengamankan data rekam medis dengan autentikasi berjenjang (Role-Based Access Control).
3. Mempermudah dokter dalam memantau antrean dan memberikan catatan medis.
4. Memungkinkan pasien melihat profil dan riwayat kunjungan kesehatannya.
5. Memberikan dashboard ringkasan data bagi administrator klinik.

---

## 2. Teknologi & Arsitektur

Aplikasi ini menggunakan arsitektur terpisah (Decoupled Architecture) antara Frontend dan Backend yang berkomunikasi melalui REST API.

### Frontend
- **Framework:** ReactJS (dikompilasi dengan Vite).
- **Styling:** Tailwind CSS (menggunakan prinsip desain modern, *glassmorphism*, *responsive*).
- **Routing:** React Router DOM v6.
- **State Management:** React Context API (terpusat untuk Data dan Autentikasi).
- **HTTP Client:** Axios (dengan konfigurasi `withCredentials: true` untuk menahan sesi Cookie).
- **Visualisasi:** Recharts (untuk grafik analitik admin).
- **Ikon:** Lucide React.

### Backend
- **Bahasa:** PHP 8+ (Native, tanpa framework).
- **Pendekatan:** RESTful API murni (menerima JSON, mengembalikan JSON).
- **Koneksi DB:** PDO (PHP Data Objects) menggunakan *Prepared Statements* untuk mencegah SQL Injection.
- **Autentikasi:** Session-based (tersimpan di Server, dikirim via HTTP-Only Cookie).

---

## 3. Aktor Sistem & Hak Akses (Role)

Aplikasi mengelompokkan pengguna ke dalam 3 role (peran) utama:

| Aktor | Hak Akses & Keterangan |
| :--- | :--- |
| **Admin** | Memiliki akses penuh. Dapat melihat dashboard analitik (grafik per bulan/tahun), melihat semua data pasien, melihat dan mengubah status semua data kunjungan. Hanya admin yang tidak terikat dengan profil identitas terpisah. |
| **Dokter** | Hanya dapat melihat antrean pasien hari ini dan riwayat kunjungan, mengubah status kunjungan (Menunggu, Diproses, Selesai), dan memberikan catatan medis (resep/diagnosis). Terhubung secara relasional ke tabel `doctors`. |
| **Pasien** | Hanya dapat mengakses portal pribadinya. Bisa melihat profil, mengubah data kontak pribadinya, dan melihat riwayat kunjungannya sendiri (tidak bisa melihat kunjungan orang lain). Terhubung secara relasional ke tabel `patients`. |

---

## 4. Desain Database (Untuk ERD & Analisis)

**Nama Database:** `db_klinik`

Desain relasional ini dioptimalkan untuk menghindari redundansi data kredensial login dengan data identitas fisik pengguna.

### A. Tabel `users` (Manajemen Kredensial Login)
Tabel ini digunakan HANYA untuk proses autentikasi (login) dan penentuan Role. 

> **Justifikasi Desain (Polymorphic Association):** Penggunaan satu kolom `reference_id` untuk merujuk ke tabel yang berbeda (`patients` atau `doctors`) mengadopsi pola *Polymorphic Association*. Pola ini dipilih untuk merampingkan arsitektur autentikasi terpusat. Konsekuensi dari pola ini adalah *Foreign Key Constraint* tidak dapat ditegakkan secara *native* di level MySQL. Oleh karena itu, perlindungan integritas data dialihkan ke **Application Layer (PHP)** menggunakan mekanisme validasi ketat dan blok *Database Transaction* (`PDO::beginTransaction`, `commit`, `rollBack`) setiap kali ada operasi CRUD yang krusial.
| Field | Tipe | Constraints | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Increment | ID User unik |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Username untuk login (auto-generate saat register) |
| `password` | VARCHAR(255)| NOT NULL | Kata sandi (di-hash menggunakan algoritma `Bcrypt` via `password_hash()`) |
| `role` | ENUM | NOT NULL | Terdiri dari: `'admin'`, `'dokter'`, `'pasien'` |
| `reference_id`| INT | NULLABLE | Berisi ID yang merujuk pada tabel entitas (jika admin = NULL, jika pasien = `patients.id`, jika dokter = `doctors.id`) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | - |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | - |

### B. Tabel `patients` (Entitas Pasien)
Menyimpan data demografi dan identitas pribadi pasien.
| Field | Tipe | Constraints | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Increment | ID Pasien |
| `medical_record_no` | VARCHAR(20) | UNIQUE, NOT NULL | Nomor Rekam Medis (Format: RMXXXX) |
| `nik` | VARCHAR(16) | UNIQUE, NOT NULL | Nomor Induk Kependudukan (Harus 16 angka) |
| `name` | VARCHAR(100) | NOT NULL | Nama Lengkap Pasien |
| `gender` | ENUM | NOT NULL | `'L'` (Laki-laki) atau `'P'` (Perempuan) |
| `birth_place` | VARCHAR(100) | NOT NULL | Tempat Kelahiran |
| `birth_date` | DATE | NOT NULL | Tanggal Lahir |
| `phone` | VARCHAR(20) | NOT NULL | Nomor Telepon / HP aktif |
| `address` | TEXT | NOT NULL | Alamat tempat tinggal lengkap |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Alamat Email |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | - |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | - |

### C. Tabel `doctors` (Entitas Dokter)
Menyimpan data identitas medis para dokter yang bertugas.
| Field | Tipe | Constraints | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Increment | ID Dokter |
| `name` | VARCHAR(100) | NOT NULL | Nama Lengkap Dokter (dengan Gelar) |
| `poli` | VARCHAR(50) | NOT NULL | Poli terdaftar (Umum, Gigi, Anak, dll) |
| `no_str` | VARCHAR(4) | UNIQUE, NOT NULL | Nomor Surat Tanda Registrasi (Harus 4 angka) |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Alamat Email |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | - |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | - |

### D. Tabel `visits` (Entitas Transaksional Pelayanan Medis)
Tabel ini mencatat relasi *many-to-many* konseptual (kunjungan) antara Pasien dan sistem/dokter.
| Field | Tipe | Constraints | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Increment | ID Kunjungan |
| `patient_id` | INT | FK -> `patients.id` | ID Pasien yang berkunjung |
| `doctor_id` | INT | FK -> `doctors.id` | ID Dokter yang dituju |
| `visit_date` | DATE | NOT NULL | Tanggal kunjungan |
| `complaint` | TEXT | NOT NULL | Keluhan utama pasien |
| `status` | ENUM | NOT NULL | Terdiri dari: `'Menunggu'`, `'Diproses'`, `'Selesai'` |
| `note` | TEXT | NULLABLE | Catatan administratif |
| `service_note` | TEXT | NULLABLE | Catatan medis / diagnosis / resep dari Dokter |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | - |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | - |

### E. Relasi Database (ERD Requirements)
- **`users` (1) to `patients` (1):** Relasi *One-to-One*. Field `users.reference_id` me-referensi ke `patients.id` di mana `users.role = 'pasien'`.
- **`users` (1) to `doctors` (1):** Relasi *One-to-One*. Field `users.reference_id` me-referensi ke `doctors.id` di mana `users.role = 'dokter'`.
- **`patients` (1) to `visits` (N):** Relasi *One-to-Many*. Satu pasien dapat memiliki banyak riwayat kunjungan. Terhubung melalui `visits.patient_id` ke `patients.id` (Terdapat constraint `ON DELETE CASCADE`).

---

## 5. Fitur dan Modul Aplikasi

### A. Modul Autentikasi & Registrasi
1. **Login System:**
   - Memverifikasi `username` dan `password` (melalui verifikasi Hash Bcrypt) ke tabel `users`.
   - Mengisi data `$_SESSION` di PHP dan mengirim session cookie.
2. **Registrasi Pasien (Public):**
   - Mengisi form NIK, Nama, Tempat/Tgl Lahir, Alamat, No Telpon, Email, dan Password.
   - Sistem auto-generate `medical_record_no` dan `username`.
   - Data tersimpan ke tabel `patients` dan tabel `users` (otomatis terikat dengan `reference_id`).
3. **Registrasi Dokter (Public):**
   - Mengisi form Nama, Poli, No STR, Email, Password.
   - Sistem memvalidasi No STR tidak duplikat.
   - Data tersimpan ke tabel `doctors` dan tabel `users`.

### B. Modul Keamanan Akun
1. **Profil Pengguna (Universal):**
   - Mengubah data kontak, alamat, atau biodata (Validasi No STR dan NIK dijalankan untuk menghindari konflik duplikasi).
2. **Ubah Password (Universal):**
   - Memerlukan input Password Lama, Password Baru, Konfirmasi Password Baru.
   - Berlaku untuk semua Role.

### C. Modul Dashboard (Pusat Informasi)
- **Admin Dashboard:** Menampilkan total rekap, grafik *Bar Chart* (Recharts) berdasarkan periode (hari/minggu/bulan/tahun), dan riwayat 5 kunjungan terakhir. Dihiasi dengan "Selamat Datang Admin".
- **Doctor Dashboard:** Menampilkan jumlah pasien hari ini untuk dirinya, list antrean interaktif untuk mengubah Status (Menunggu, Diproses, Selesai) dan mengisi Form Catatan (Service Note). Dihiasi "Selamat Datang Dokter [Nama]".
- **Patient Dashboard:** Menampilkan ringkasan profil demografi diri sendiri, NIK, dan list riwayat semua keluhan, status kunjungan, dan catatan resep dari dokter secara *read-only*. Dihiasi "Selamat Datang [Nama]".

### D. Modul Data Master (Admin Only)
- **CRUD Pasien:** Administrator dapat mengedit seluruh rekam identitas pasien.
- **CRUD Kunjungan:** Administrator berperan mendaftarkan keluhan kunjungan baru, men-set tanggal, dan mengarahkan pasien ke dokter tertentu.

---

## 6. Struktur Sistem Direktori

### Frontend (`src/`)
```text
src/
 ├── components/       # Reusable components (StatusBadge, ProtectedRoute)
 ├── context/          # AuthContext (Auth) & DataContext (Patients/Visits CRUD)
 ├── layouts/          # MainLayout (Sidebar, Mobile Header, Routing Outlet)
 ├── pages/
 │    ├── Auth/        # Login, RegisterPatient, RegisterDoctor
 │    ├── Dashboard/   # AdminDashboard, DoctorDashboard, PatientDashboard
 │    ├── Profile/     # Profile (Ubah Profil & Ubah Password)
 │    ├── Patients/    # Modul CRUD Pasien (Admin)
 │    └── Visits/      # Modul CRUD Kunjungan (Admin)
 ├── services/         # Axios API interceptors
 ├── App.jsx           # Master Route Config
 └── main.jsx          # React DOM Injector
```

### Backend (`backend/`)
```text
backend/
 ├── api/
 │    ├── auth/          # login.php, logout.php, profile.php, register_doctor.php, register_patient.php, change_password.php, update_profile.php
 │    ├── doctor/        # visits.php, update_status.php, update_note.php
 │    ├── patient/       # history.php
 │    └── ...            # patients.php, visits.php (Admin)
 ├── config/
 │    └── database.php   # PDO DB Connector
 ├── models/
 │    ├── Doctor.php     # Query Builder untuk tabel doctors
 │    ├── Patient.php    # Query Builder untuk tabel patients
 │    └── Visit.php      # Query Builder untuk tabel visits
 ├── utils/
 │    └── auth.php       # Fungsi Cek Session, Cek Role, Middleware CORS
 └── db_klinik.sql       # Skema dan Dummy Data (Migration)
```

---

## 7. Keamanan Sistem (Security Measures)

1. **Session & Cookie:** Sesi dipegang murni oleh backend PHP (tanpa JWT/Local Storage). React mengirim kredensial via `withCredentials: true`. Cookie bersifat *HttpOnly* sehingga aman dari eksploitasi skrip XSS.
2. **Role Verification Middleware:** Setiap Endpoint PHP akan memanggil fungsi `require_role([...])` untuk memblokir by-pass URL langsung menggunakan Postman/cURL jika tidak memiliki session role yang valid.
3. **Route Protection (React):** Routing di dalam `App.jsx` dibungkus dengan komponen `<ProtectedRoute>` yang melarang akses URL jika State/Context Role pengguna tidak sesuai.
4. **Prepared Statement:** Seluruh kueri model backend (`Patient.php`, `Doctor.php`, `Visit.php`) menggunakan metode PDO `bindParam` yang secara otomatis menetralisir bahaya serangan SQL Injection.
5. **Password Hashing:** Kata sandi disimpan secara aman dalam bentuk *Hash* menggunakan algoritma modern (Bcrypt via `password_hash()`) guna memastikan kerahasiaan data (Confidentiality) sesuai kaidah C.I.A Triad.