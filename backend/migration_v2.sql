-- =============================================
-- Migration V2: Registrasi Dokter & Pasien
-- Sistem Informasi Klinik Sejahterah
-- =============================================

USE db_klinik;

-- =============================================
-- Tabel Baru: doctors
-- =============================================
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    poli VARCHAR(50) NOT NULL,
    no_str VARCHAR(4) NOT NULL UNIQUE,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Alter tabel patients: tambah birth_place
-- =============================================
ALTER TABLE patients ADD COLUMN IF NOT EXISTS birth_place VARCHAR(100) AFTER phone;

-- =============================================
-- Update password user lama ke plain text
-- (sebelumnya bcrypt hash, sekarang plain text)
-- =============================================
UPDATE users SET password = 'password' WHERE username IN ('admin', 'dokter_ahmad', 'pasien_andi');

-- =============================================
-- Data Dummy: Dokter
-- =============================================
INSERT INTO doctors (name, poli, no_str, email) VALUES
('dr. Ahmad Fauzi', 'Umum', '1001', 'ahmad.fauzi@klinik.com'),
('dr. Rina Susanti', 'Anak', '1002', 'rina.susanti@klinik.com'),
('dr. Budi Santoso', 'Penyakit Dalam', '1003', 'budi.santoso@klinik.com');

-- =============================================
-- Update reference_id untuk dokter_ahmad
-- =============================================
UPDATE users SET reference_id = 1 WHERE username = 'dokter_ahmad' AND role = 'dokter';
