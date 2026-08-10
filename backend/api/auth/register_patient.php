<?php
// backend/api/auth/register_patient.php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Patient.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Validasi field yang wajib
$requiredFields = ['name', 'nik', 'phone', 'birth_place', 'birth_date', 'address', 'email', 'password', 'confirm_password'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(422);
        echo json_encode(['status' => 'error', 'message' => "Field '$field' wajib diisi"]);
        exit;
    }
}

// Validasi NIK harus 16 angka
if (!preg_match('/^\d{16}$/', $data['nik'])) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'NIK harus 16 angka']);
    exit;
}

// Validasi password cocok
if ($data['password'] !== $data['confirm_password']) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Password dan konfirmasi password tidak cocok']);
    exit;
}

// Validasi password minimal 6 karakter
if (strlen($data['password']) < 6) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Password minimal 6 karakter']);
    exit;
}

// Validasi email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Format email tidak valid']);
    exit;
}

$database = new Database();
$db = $database->getConnection();

// Cek NIK sudah terdaftar
$stmt = $db->prepare("SELECT id FROM patients WHERE nik = :nik LIMIT 1");
$stmt->bindParam(':nik', $data['nik']);
$stmt->execute();
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['status' => 'error', 'message' => 'NIK sudah terdaftar']);
    exit;
}

// Cek email sudah terdaftar di patients
$stmt = $db->prepare("SELECT id FROM patients WHERE email = :email LIMIT 1");
$stmt->bindParam(':email', $data['email']);
$stmt->execute();
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['status' => 'error', 'message' => 'Email sudah terdaftar']);
    exit;
}

try {
    $db->beginTransaction();

    // Auto-generate medical_record_no
    $stmt = $db->prepare("SELECT medical_record_no FROM patients ORDER BY id DESC LIMIT 1");
    $stmt->execute();
    $lastRecord = $stmt->fetch();
    if ($lastRecord) {
        $lastNum = (int) substr($lastRecord['medical_record_no'], 2);
        $newNum = $lastNum + 1;
    } else {
        $newNum = 1;
    }
    $medicalRecordNo = 'RM' . str_pad($newNum, 4, '0', STR_PAD_LEFT);

    // Auto-generate username dari email (bagian sebelum @)
    $emailParts = explode('@', $data['email']);
    $baseUsername = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $emailParts[0]));
    $username = 'pasien_' . $baseUsername;

    // Pastikan username unik
    $stmt = $db->prepare("SELECT id FROM users WHERE username = :username LIMIT 1");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    if ($stmt->fetch()) {
        $username = $username . rand(100, 999);
    }

    // Tentukan gender dari data atau default
    $gender = isset($data['gender']) ? $data['gender'] : 'L';

    // Simpan ke tabel patients
    $stmt = $db->prepare("INSERT INTO patients (medical_record_no, nik, name, gender, birth_place, birth_date, phone, address, email) 
                          VALUES (:medical_record_no, :nik, :name, :gender, :birth_place, :birth_date, :phone, :address, :email)");
    $stmt->bindParam(':medical_record_no', $medicalRecordNo);
    $stmt->bindParam(':nik', $data['nik']);
    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':birth_place', $data['birth_place']);
    $stmt->bindParam(':birth_date', $data['birth_date']);
    $stmt->bindParam(':phone', $data['phone']);
    $stmt->bindParam(':address', $data['address']);
    $stmt->bindParam(':email', $data['email']);
    $stmt->execute();

    $patientId = $db->lastInsertId();

    // Simpan ke tabel users (password hashed)
    $stmt = $db->prepare("INSERT INTO users (username, password, role, reference_id) VALUES (:username, :password, 'pasien', :reference_id)");
    $stmt->bindParam(':username', $username);
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':reference_id', $patientId, PDO::PARAM_INT);
    $stmt->execute();

    $db->commit();

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Registrasi pasien berhasil',
        'data' => [
            'username' => $username,
            'medical_record_no' => $medicalRecordNo,
            'name' => $data['name']
        ]
    ]);

} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal registrasi: ' . $e->getMessage()]);
}
?>
