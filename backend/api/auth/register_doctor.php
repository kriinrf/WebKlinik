<?php
// backend/api/auth/register_doctor.php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Doctor.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Validasi field yang wajib
$requiredFields = ['name', 'poli', 'no_str', 'email', 'password', 'confirm_password'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(422);
        echo json_encode(['status' => 'error', 'message' => "Field '$field' wajib diisi"]);
        exit;
    }
}

// Validasi No STR harus 4 angka
if (!preg_match('/^\d{4}$/', $data['no_str'])) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'No STR harus 4 angka']);
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
$doctor = new Doctor($db);

// Cek No STR sudah terdaftar
if ($doctor->getByNoStr($data['no_str'])) {
    http_response_code(409);
    echo json_encode(['status' => 'error', 'message' => 'No STR sudah terdaftar']);
    exit;
}

// Cek email sudah terdaftar di doctors
$stmt = $db->prepare("SELECT id FROM doctors WHERE email = :email LIMIT 1");
$stmt->bindParam(':email', $data['email']);
$stmt->execute();
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['status' => 'error', 'message' => 'Email sudah terdaftar']);
    exit;
}

try {
    $db->beginTransaction();

    // Simpan ke tabel doctors
    $doctorId = $doctor->create([
        'name' => $data['name'],
        'poli' => $data['poli'],
        'no_str' => $data['no_str'],
        'email' => $data['email']
    ]);

    if (!$doctorId) {
        throw new Exception('Gagal menyimpan data dokter');
    }

    // Auto-generate username dari nama
    $baseName = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $data['name']));
    $baseName = preg_replace('/_+/', '_', $baseName); // collapse multiple underscores
    $baseName = trim($baseName, '_');
    $username = 'dokter_' . $baseName;

    // Pastikan username unik
    $stmt = $db->prepare("SELECT id FROM users WHERE username = :username LIMIT 1");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    if ($stmt->fetch()) {
        $username = $username . rand(100, 999);
    }

    // Simpan ke tabel users (password hashed)
    $stmt = $db->prepare("INSERT INTO users (username, password, role, reference_id) VALUES (:username, :password, 'dokter', :reference_id)");
    $stmt->bindParam(':username', $username);
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':reference_id', $doctorId, PDO::PARAM_INT);
    $stmt->execute();

    $db->commit();

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Registrasi dokter berhasil',
        'data' => [
            'username' => $username,
            'name' => $data['name'],
            'poli' => $data['poli']
        ]
    ]);

} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal registrasi: ' . $e->getMessage()]);
}
?>
