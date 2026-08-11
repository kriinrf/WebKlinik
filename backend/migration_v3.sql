-- USE db_klinik;

-- 1. Hapus kolom username di tabel patients (Normalisasi 3NF)
ALTER TABLE patients DROP COLUMN username;

-- 2. Tambahkan kolom doctor_id di tabel visits
ALTER TABLE visits ADD COLUMN doctor_id INT NULL AFTER patient_id;

-- 3. Migrasi data lama dari VARCHAR ke INT (Mencocokkan nama dokter)
UPDATE visits v
JOIN doctors d ON v.doctor = d.name
SET v.doctor_id = d.id;

-- 4. Tambahkan Foreign Key Constraint
ALTER TABLE visits ADD CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 5. Hapus kolom teks statis yang lama
ALTER TABLE visits DROP COLUMN doctor;
ALTER TABLE visits DROP COLUMN doctor_name;
