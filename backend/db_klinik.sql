-- =============================================
-- Database: db_klinik
-- Sistem Informasi Klinik Sejahterah
-- =============================================

CREATE DATABASE IF NOT EXISTS db_klinik;
USE db_klinik;

-- =============================================
-- Tabel: patients
-- =============================================
DROP TABLE IF EXISTS visits;
DROP TABLE IF EXISTS patients;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Tabel: visits
-- =============================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Data Dummy: 30 Pasien
-- =============================================
INSERT INTO patients (medical_record_no, nik, name, gender, birth_date, phone, address) VALUES
('RM0001', '3201010101900001', 'Andi Saputra',       'L', '1990-01-15', '081234567801', 'Jl. Merdeka No. 1, Bandung'),
('RM0002', '3201010101850002', 'Budi Hartono',        'L', '1985-03-22', '081234567802', 'Jl. Sudirman No. 12, Bandung'),
('RM0003', '3201010101920003', 'Siti Aminah',         'P', '1992-07-10', '081234567803', 'Jl. Asia Afrika No. 5, Bandung'),
('RM0004', '3201010101880004', 'Dewi Lestari',        'P', '1988-11-05', '081234567804', 'Jl. Braga No. 8, Bandung'),
('RM0005', '3201010101950005', 'Rudi Hermawan',       'L', '1995-02-28', '081234567805', 'Jl. Dago No. 23, Bandung'),
('RM0006', '3201010101780006', 'Sri Wahyuni',         'P', '1978-06-14', '081234567806', 'Jl. Cihampelas No. 45, Bandung'),
('RM0007', '3201010101820007', 'Agus Setiawan',       'L', '1982-09-30', '081234567807', 'Jl. Pasteur No. 7, Bandung'),
('RM0008', '3201010101930008', 'Rina Marlina',        'P', '1993-04-18', '081234567808', 'Jl. Dipatiukur No. 15, Bandung'),
('RM0009', '3201010101870009', 'Hendra Gunawan',      'L', '1987-12-25', '081234567809', 'Jl. Setiabudi No. 33, Bandung'),
('RM0010', '3201010101910010', 'Nur Hidayah',         'P', '1991-08-07', '081234567810', 'Jl. Buah Batu No. 50, Bandung'),
('RM0011', '3201010101800011', 'Joko Susanto',        'L', '1980-05-20', '081234567811', 'Jl. Soekarno Hatta No. 100, Bandung'),
('RM0012', '3201010101960012', 'Putri Rahayu',        'P', '1996-10-03', '081234567812', 'Jl. Gatot Subroto No. 18, Bandung'),
('RM0013', '3201010101830013', 'Bambang Prakoso',     'L', '1983-01-11', '081234567813', 'Jl. Ahmad Yani No. 67, Bandung'),
('RM0014', '3201010101940014', 'Lia Permatasari',     'P', '1994-03-29', '081234567814', 'Jl. Pelajar Pejuang No. 22, Bandung'),
('RM0015', '3201010101860015', 'Dedi Kurniawan',      'L', '1986-07-16', '081234567815', 'Jl. Terusan Jakarta No. 9, Bandung'),
('RM0016', '3201010101900016', 'Ani Suryani',         'P', '1990-11-22', '081234567816', 'Jl. Ciumbuleuit No. 30, Bandung'),
('RM0017', '3201010101750017', 'Wahyu Prasetyo',      'L', '1975-04-08', '081234567817', 'Jl. Ir. H. Juanda No. 55, Bandung'),
('RM0018', '3201010101980018', 'Dina Oktaviani',      'P', '1998-08-14', '081234567818', 'Jl. Supratman No. 11, Bandung'),
('RM0019', '3201010101810019', 'Fajar Nugroho',       'L', '1981-02-05', '081234567819', 'Jl. Diponegoro No. 42, Bandung'),
('RM0020', '3201010101970020', 'Maya Anggraeni',      'P', '1997-06-30', '081234567820', 'Jl. RE Martadinata No. 19, Bandung'),
('RM0021', '3201010101840021', 'Teguh Santoso',       'L', '1984-10-12', '081234567821', 'Jl. Pajajaran No. 27, Bandung'),
('RM0022', '3201010101920022', 'Ratna Dewi',          'P', '1992-12-01', '081234567822', 'Jl. Lengkong Besar No. 14, Bandung'),
('RM0023', '3201010101890023', 'Irfan Maulana',       'L', '1989-05-17', '081234567823', 'Jl. Otto Iskandardinata No. 61, Bandung'),
('RM0024', '3201010101950024', 'Yuni Astuti',         'P', '1995-09-23', '081234567824', 'Jl. Karapitan No. 8, Bandung'),
('RM0025', '3201010101770025', 'Suparman',            'L', '1977-03-14', '081234567825', 'Jl. Veteran No. 35, Bandung'),
('RM0026', '3201010101990026', 'Fitri Handayani',     'P', '1999-01-28', '081234567826', 'Jl. Kebon Jati No. 20, Bandung'),
('RM0027', '3201010101850027', 'Arief Rahman',        'L', '1985-08-09', '081234567827', 'Jl. Pungkur No. 44, Bandung'),
('RM0028', '3201010101930028', 'Lina Marlina',        'P', '1993-11-16', '081234567828', 'Jl. Tamansari No. 16, Bandung'),
('RM0029', '3201010101800029', 'Surya Darma',         'L', '1980-07-04', '081234567829', 'Jl. Cibaduyut No. 52, Bandung'),
('RM0030', '3201010101960030', 'Nadia Safitri',       'P', '1996-04-21', '081234567830', 'Jl. Kopo No. 38, Bandung');

-- =============================================
-- Data Dummy: 60 Kunjungan (tersebar dari Januari - Juli 2026)
-- =============================================
INSERT INTO visits (patient_id, visit_date, complaint, doctor, status, note) VALUES
-- Januari 2026
(1,  '2026-01-05', 'Demam tinggi dan menggigil',            'dr. Ahmad Fauzi',  'Selesai',   'Diberikan paracetamol 500mg'),
(3,  '2026-01-08', 'Batuk berdahak sudah 3 hari',           'dr. Rina Susanti', 'Selesai',   'Resep obat batuk dan antibiotik'),
(5,  '2026-01-12', 'Nyeri sendi lutut kanan',                'dr. Ahmad Fauzi',  'Selesai',   'Rujuk ke poli orthopedi'),
(7,  '2026-01-18', 'Sakit kepala berulang',                  'dr. Budi Santoso', 'Selesai',   'Cek tekanan darah normal'),
(9,  '2026-01-22', 'Mual dan muntah sejak pagi',             'dr. Rina Susanti', 'Selesai',   'Diberikan ondansetron'),
(2,  '2026-01-25', 'Gatal-gatal di seluruh badan',           'dr. Ahmad Fauzi',  'Selesai',   'Alergi makanan laut'),

-- Februari 2026
(4,  '2026-02-03', 'Sesak napas ringan',                     'dr. Budi Santoso', 'Selesai',   'Nebulizer dan kontrol 1 minggu'),
(6,  '2026-02-07', 'Tekanan darah tinggi',                   'dr. Ahmad Fauzi',  'Selesai',   'Amlodipine 5mg'),
(8,  '2026-02-11', 'Diare akut 2 hari',                      'dr. Rina Susanti', 'Selesai',   'ORS dan zinc'),
(10, '2026-02-14', 'Nyeri ulu hati',                          'dr. Budi Santoso', 'Selesai',   'Omeprazole 20mg'),
(1,  '2026-02-18', 'Kontrol pasca demam',                     'dr. Ahmad Fauzi',  'Selesai',   'Kondisi membaik'),
(12, '2026-02-22', 'Radang tenggorokan',                      'dr. Rina Susanti', 'Selesai',   'Amoxicillin 500mg'),
(14, '2026-02-26', 'Sakit gigi geraham bawah',               'dr. Budi Santoso', 'Selesai',   'Rujuk ke poli gigi'),

-- Maret 2026
(11, '2026-03-02', 'Vertigo berulang',                        'dr. Ahmad Fauzi',  'Selesai',   'Betahistine 3x6mg'),
(13, '2026-03-06', 'Infeksi saluran kemih',                   'dr. Rina Susanti', 'Selesai',   'Ciprofloxacin 2x500mg'),
(15, '2026-03-10', 'Nyeri punggung bawah',                    'dr. Budi Santoso', 'Selesai',   'Fisioterapi dan analgesik'),
(3,  '2026-03-14', 'Flu dan pilek berkepanjangan',            'dr. Ahmad Fauzi',  'Selesai',   'Cetirizine dan vitamin C'),
(17, '2026-03-18', 'Diabetes cek gula darah',                 'dr. Rina Susanti', 'Selesai',   'Gula darah puasa 180 mg/dL'),
(19, '2026-03-22', 'Mata merah dan gatal',                    'dr. Budi Santoso', 'Selesai',   'Tetes mata antibiotik'),
(16, '2026-03-26', 'Asam lambung naik',                       'dr. Ahmad Fauzi',  'Selesai',   'Sucralfate dan lansoprazole'),
(20, '2026-03-30', 'Batuk kering lebih dari seminggu',        'dr. Rina Susanti', 'Selesai',   'Foto rontgen paru normal'),

-- April 2026
(2,  '2026-04-02', 'Kontrol alergi kulit',                    'dr. Ahmad Fauzi',  'Selesai',   'Loratadine 1x10mg'),
(21, '2026-04-05', 'Nyeri dada saat aktivitas',               'dr. Budi Santoso', 'Selesai',   'EKG normal, cek kolesterol'),
(22, '2026-04-09', 'Keputihan berlebihan',                    'dr. Rina Susanti', 'Selesai',   'Metronidazole ovula'),
(18, '2026-04-12', 'Demam disertai ruam kulit',               'dr. Ahmad Fauzi',  'Selesai',   'Suspek campak, isolasi'),
(23, '2026-04-16', 'Gangguan tidur insomnia',                  'dr. Budi Santoso', 'Selesai',   'Konseling dan melatonin'),
(24, '2026-04-20', 'Nyeri haid berlebihan',                    'dr. Rina Susanti', 'Selesai',   'Asam mefenamat 3x500mg'),
(25, '2026-04-24', 'Hipertensi kontrol rutin',                 'dr. Ahmad Fauzi',  'Selesai',   'TD 140/90, lanjut obat'),
(5,  '2026-04-28', 'Kontrol lutut setelah fisioterapi',        'dr. Budi Santoso', 'Selesai',   'Membaik, lanjut latihan'),

-- Mei 2026
(26, '2026-05-02', 'Batuk pilek dan demam ringan',            'dr. Rina Susanti', 'Selesai',   'Paracetamol dan dekongestan'),
(27, '2026-05-05', 'Luka lecet di kaki akibat terjatuh',      'dr. Ahmad Fauzi',  'Selesai',   'Debridement dan salep antibiotik'),
(28, '2026-05-08', 'Nyeri perut bagian bawah',                 'dr. Budi Santoso', 'Selesai',   'USG abdomen normal'),
(6,  '2026-05-12', 'Kontrol tekanan darah',                    'dr. Ahmad Fauzi',  'Selesai',   'TD stabil 130/85'),
(29, '2026-05-15', 'Pusing dan lemas setelah puasa',           'dr. Rina Susanti', 'Selesai',   'Dehidrasi ringan, infus NaCl'),
(30, '2026-05-19', 'Jerawat membandel di wajah',               'dr. Budi Santoso', 'Selesai',   'Klindamisin gel dan adapalene'),
(10, '2026-05-22', 'Maag kambuh kembali',                      'dr. Ahmad Fauzi',  'Selesai',   'Omeprazole 2x20mg'),
(17, '2026-05-26', 'Kontrol diabetes rutin',                    'dr. Rina Susanti', 'Selesai',   'GDP 145 mg/dL, perbaikan diet'),
(4,  '2026-05-30', 'Sesak napas saat malam hari',              'dr. Budi Santoso', 'Selesai',   'Salbutamol inhaler'),

-- Juni 2026
(1,  '2026-06-02', 'Demam dan nyeri otot',                     'dr. Ahmad Fauzi',  'Selesai',   'Suspek dengue, cek lab'),
(8,  '2026-06-05', 'Mual berkepanjangan',                      'dr. Rina Susanti', 'Selesai',   'Domperidone 3x10mg'),
(11, '2026-06-09', 'Vertigo kambuh lagi',                      'dr. Budi Santoso', 'Selesai',   'Flunarizine 1x5mg malam'),
(14, '2026-06-12', 'Gusi bengkak dan berdarah',                'dr. Ahmad Fauzi',  'Selesai',   'Rujuk ke poli gigi'),
(20, '2026-06-16', 'Batuk darah sedikit',                      'dr. Rina Susanti', 'Selesai',   'Rontgen: bronkitis, antibiotik'),
(22, '2026-06-19', 'Keputihan kontrol ulang',                  'dr. Budi Santoso', 'Selesai',   'Membaik, lanjut probiotik'),
(25, '2026-06-23', 'Hipertensi kontrol bulan Juni',            'dr. Ahmad Fauzi',  'Selesai',   'TD 135/85, stabil'),
(9,  '2026-06-26', 'Diare kembali setelah makan pedas',        'dr. Rina Susanti', 'Selesai',   'Loperamide dan diet bland'),
(15, '2026-06-30', 'Nyeri punggung bawah kambuh',              'dr. Budi Santoso', 'Selesai',   'Meloxicam 1x15mg'),

-- Juli 2026 (bulan ini)
(3,  '2026-07-01', 'Pilek dan hidung tersumbat',               'dr. Ahmad Fauzi',  'Selesai',   'Pseudoephedrine dan istirahat'),
(7,  '2026-07-04', 'Sakit kepala migrain',                     'dr. Rina Susanti', 'Selesai',   'Sumatriptan 50mg saat serangan'),
(12, '2026-07-08', 'Tenggorokan sakit saat menelan',           'dr. Budi Santoso', 'Selesai',   'Strepsils dan antibiotik'),
(16, '2026-07-12', 'Maag dan mual setelah makan',              'dr. Ahmad Fauzi',  'Selesai',   'Antasida dan diet teratur'),
(19, '2026-07-16', 'Konjungtivitis mata kiri',                 'dr. Rina Susanti', 'Selesai',   'Chloramphenicol tetes mata'),
(23, '2026-07-20', 'Tidak bisa tidur sudah 5 hari',            'dr. Budi Santoso', 'Diproses',  'Evaluasi psikologis'),
(26, '2026-07-23', 'Demam dan badan pegal',                    'dr. Ahmad Fauzi',  'Diproses',  'Cek darah lengkap'),
(28, '2026-07-25', 'Nyeri perut kanan bawah',                  'dr. Rina Susanti', 'Diproses',  'Suspek appendisitis, USG'),
(30, '2026-07-28', 'Jerawat kontrol ulang',                    'dr. Budi Santoso', 'Menunggu',  NULL),
(2,  '2026-07-29', 'Ruam kulit merah di lengan',               'dr. Ahmad Fauzi',  'Menunggu',  NULL),
(13, '2026-07-30', 'Nyeri saat buang air kecil',               'dr. Rina Susanti', 'Menunggu',  NULL),
(21, '2026-07-30', 'Nyeri dada kontrol ulang',                 'dr. Budi Santoso', 'Menunggu',  NULL);
