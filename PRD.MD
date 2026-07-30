Sistem Informasi Klinik Sederhana

Versi: 2.0 (Simple Version)
Nama Aplikasi: Sistem Informasi Klinik
Platform: Web Application
Frontend: ReactJS + Vite + Tailwind CSS
Backend: PHP Native (REST API sederhana)
Database: MySQL

1. Latar Belakang

Sistem Informasi Klinik merupakan aplikasi berbasis web yang dirancang untuk membantu proses administrasi klinik secara sederhana. Fokus utama aplikasi adalah mengelola data pasien dan data kunjungan agar pencatatan menjadi lebih rapi, cepat, dan mudah dicari.

Versi ini dibuat dengan ruang lingkup yang sederhana sehingga mudah dipahami dan dikembangkan lebih lanjut.

2. Tujuan

Aplikasi ini bertujuan untuk:

Mengelola data pasien.
Mengelola data kunjungan pasien.
Menampilkan ringkasan informasi melalui dashboard.
Mempermudah proses pencarian dan pengelolaan data.
3. Ruang Lingkup

Aplikasi terdiri dari tiga menu utama:

Dashboard

Data Pasien

Data Kunjungan

Tidak termasuk:

Login
Rekam Medis
Data Dokter
Farmasi
Kasir
Laboratorium
BPJS
Rawat Inap
4. Teknologi
Frontend
Teknologi	Keterangan
ReactJS	Library frontend
Vite	Build tool
Tailwind CSS	Styling
Axios	HTTP Request
React Router DOM	Routing
Backend
Teknologi	Keterangan
PHP Native	CRUD API
MySQL	Database
Editor

Visual Studio Code

Browser

Google Chrome

Microsoft Edge

5. Desain UI/UX
Konsep Desain

Menggunakan gaya Modern Minimalist Dashboard.

Karakteristik:

Bersih
Banyak ruang kosong (white space)
Mudah dibaca
Responsif
Warna lembut
Ikon sederhana
Card-based layout
Warna

Primary

#2563EB

Secondary

#14B8A6

Background

#F8FAFC

Card

#FFFFFF

Text

#1E293B

Border

#E2E8F0
Font

Menggunakan Inter sebagai font utama.

Alasan:

Modern dan profesional.
Sangat mudah dibaca pada dashboard.
Banyak digunakan pada aplikasi seperti Vercel, Stripe, Notion, GitHub, Linear, dan dashboard SaaS modern.

Cadangan (fallback):

font-family: 'Inter', sans-serif;

Ukuran font yang disarankan:

Elemen	Ukuran
Judul Halaman	30 px
Judul Card	20 px
Heading Tabel	16 px
Isi Tabel	14 px
Sidebar	15 px
Button	14 px
6. Struktur Menu
Dashboard

├── Data Pasien

└── Data Kunjungan
7. Dashboard
Tujuan

Memberikan ringkasan informasi kepada admin.

Informasi yang ditampilkan

Card:

Total Pasien
Total Kunjungan

Grafik:

Jumlah kunjungan per bulan

Aktivitas terbaru:

Lima data kunjungan terakhir
8. Data Pasien
Fungsi

Mengelola seluruh data pasien.

Fitur
Melihat data pasien
Menambah pasien
Mengubah data pasien
Menghapus pasien
Pencarian pasien
Data yang disimpan
Field	Tipe
No RM	Text
Nama	Text
NIK	Text
Jenis Kelamin	Dropdown
Tanggal Lahir	Date
Nomor HP	Text
Alamat	Text
9. Data Kunjungan
Fungsi

Mengelola data kunjungan pasien.

Fitur
Melihat data kunjungan
Menambah kunjungan
Mengubah kunjungan
Menghapus kunjungan
Pencarian
Data yang disimpan
Field	Tipe
Tanggal	Date
Pasien	Dropdown
Keluhan	Textarea
Dokter	Text
Status	Dropdown

Status:

Menunggu

Diproses

Selesai
10. Struktur Frontend
src/

assets/

components/

layouts/

pages/

Dashboard/

Patients/

Visits/

services/

routes/

App.jsx

main.jsx
11. Struktur Backend
backend/

config/

api/

patients/

visits/

dashboard/

db.php

index.php

Contoh endpoint sederhana:

GET    /api/patients.php

POST   /api/patients.php

PUT    /api/patients.php?id=1

DELETE /api/patients.php?id=1
12. Database
Tabel patients
Field	Tipe
id	INT
medical_record_number	VARCHAR(20)
nik	VARCHAR(16)
name	VARCHAR(100)
gender	ENUM
birth_date	DATE
phone	VARCHAR(20)
address	TEXT
Tabel visits
Field	Tipe
id	INT
patient_id	INT
visit_date	DATE
complaint	TEXT
doctor	VARCHAR(100)
status	VARCHAR(20)
13. Relasi Database
patients

id
nama

      │

      │ 1

      │

      ▼

visits

patient_id

      ∞

Satu pasien dapat memiliki banyak data kunjungan.

14. Validasi Data
Pasien
Nama wajib diisi.
NIK harus terdiri dari 16 digit.
Nomor Rekam Medis tidak boleh sama.
Nomor HP hanya boleh berisi angka.
Tanggal lahir tidak boleh melebihi tanggal saat ini.
Kunjungan
Pasien wajib dipilih.
Tanggal kunjungan wajib diisi.
Keluhan wajib diisi.
Dokter wajib diisi.
Status wajib dipilih.
15. Alur Aplikasi
Dashboard

↓

Data Pasien

↓

Tambah Pasien

↓

Data Tersimpan

↓

Data Kunjungan

↓

Pilih Pasien

↓

Isi Keluhan

↓

Simpan

↓

Dashboard Diperbarui
16. Target Hasil

Aplikasi yang dihasilkan memiliki karakteristik berikut:

Dashboard sederhana dengan ringkasan data.
CRUD Data Pasien.
CRUD Data Kunjungan.
Database MySQL dengan relasi yang jelas.
Tampilan modern dan responsif.
Struktur kode yang mudah dipelajari dan dikembangkan.

Database Design
Database Name
db_klinik
Entity Relationship Diagram (ERD)
                +----------------------+
                |       patients       |
                +----------------------+
                | PK id                |
                | medical_record_no    |
                | nik                  |
                | name                 |
                | gender               |
                | birth_date           |
                | phone                |
                | address              |
                | created_at           |
                | updated_at           |
                +----------------------+
                           │
                           │ 1
                           │
                           │
                           ▼
                +----------------------+
                |        visits        |
                +----------------------+
                | PK id                |
                | FK patient_id        |
                | visit_date           |
                | complaint            |
                | doctor               |
                | status               |
                | note                 |
                | created_at           |
                | updated_at           |
                +----------------------+

Relasi:

Satu pasien dapat memiliki banyak kunjungan (One to Many).

Tabel 1 : patients
Fungsi

Menyimpan seluruh identitas pasien.

Field	Tipe	Length	Constraint	Keterangan
id	INT	11	PK AI	Primary Key
medical_record_no	VARCHAR	20	UNIQUE	Nomor Rekam Medis
nik	VARCHAR	16	UNIQUE	Nomor Induk Kependudukan
name	VARCHAR	100	NOT NULL	Nama Pasien
gender	ENUM	-	NOT NULL	L / P
birth_date	DATE	-	NOT NULL	Tanggal Lahir
phone	VARCHAR	20	NULL	Nomor HP
address	TEXT	-	NULL	Alamat
created_at	TIMESTAMP	-	DEFAULT CURRENT_TIMESTAMP	Waktu dibuat
updated_at	TIMESTAMP	-	CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP	Waktu diperbarui
Penjelasan Field
id

Primary Key.

Contoh

1
2
3
medical_record_no

Nomor rekam medis.

Contoh

RM0001
RM0002
RM0003

Harus unik.

nik

Nomor KTP pasien.

Contoh

2171123456789012
gender

Nilai yang diperbolehkan

L
P
Tabel 2 : visits
Fungsi

Menyimpan seluruh riwayat kunjungan pasien.

Field	Tipe	Length	Constraint	Keterangan
id	INT	11	PK AI	Primary Key
patient_id	INT	11	FK	Relasi ke pasien
visit_date	DATE	-	NOT NULL	Tanggal Kunjungan
complaint	TEXT	-	NOT NULL	Keluhan
doctor	VARCHAR	100	NOT NULL	Nama Dokter
status	ENUM	-	NOT NULL	Status Kunjungan
note	TEXT	-	NULL	Catatan
created_at	TIMESTAMP	-	DEFAULT CURRENT_TIMESTAMP	Waktu dibuat
updated_at	TIMESTAMP	-	CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP	Waktu diperbarui
Status
Menunggu

Diproses

Selesai
Normalisasi Database

Database ini sudah memenuhi Third Normal Form (3NF) karena:

Tidak ada data pasien yang disimpan berulang pada tabel visits.
Data kunjungan hanya menyimpan patient_id sebagai foreign key.
Setiap tabel memiliki satu tanggung jawab (single responsibility).
SQL Pembuatan Database
CREATE DATABASE db_klinik;
USE db_klinik;
SQL Tabel patients
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medical_record_no VARCHAR(20) NOT NULL UNIQUE,
    nik VARCHAR(16) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender ENUM('L','P') NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
SQL Tabel visits
CREATE TABLE visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    visit_date DATE NOT NULL,
    complaint TEXT NOT NULL,
    doctor VARCHAR(100) NOT NULL,
    status ENUM('Menunggu','Diproses','Selesai') NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
Contoh Data
patients
id	No RM	Nama
1	RM0001	Andi Saputra
2	RM0002	Budi Hartono
3	RM0003	Siti Aminah
visits
id	patient_id	Dokter
1	1	dr. Ahmad
2	1	dr. Budi
3	2	dr. Rina
Struktur Folder Backend
backend/
│
├── config/
│   └── database.php
│
├── api/
│   ├── dashboard.php
│   ├── patients.php
│   └── visits.php
│
├── models/
│   ├── Patient.php
│   └── Visit.php
│
└── db_klinik.sql 