<?php
// backend/api/auth/change_password.php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$user = require_login();

$data = json_decode(file_get_contents('php://input'), true);

// Validasi field
if (empty($data['old_password']) || empty($data['new_password']) || empty($data['confirm_password'])) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi']);
    exit;
}

// Validasi password baru cocok
if ($data['new_password'] !== $data['confirm_password']) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Password baru dan konfirmasi tidak cocok']);
    exit;
}

// Validasi password minimal 6 karakter
if (strlen($data['new_password']) < 6) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Password baru minimal 6 karakter']);
    exit;
}

$database = new Database();
$db = $database->getConnection();

// Ambil password lama dari database
$stmt = $db->prepare("SELECT password FROM users WHERE id = :id LIMIT 1");
$stmt->bindParam(':id', $user['id'], PDO::PARAM_INT);
$stmt->execute();
$currentUser = $stmt->fetch();

if (!$currentUser) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'User tidak ditemukan']);
    exit;
}

// Verifikasi password lama
if (!password_verify($data['old_password'], $currentUser['password'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Password lama salah']);
    exit;
}

// Update password (hashed)
$stmt = $db->prepare("UPDATE users SET password = :password WHERE id = :id");
$hashedPassword = password_hash($data['new_password'], PASSWORD_BCRYPT);
$stmt->bindParam(':password', $hashedPassword);
$stmt->bindParam(':id', $user['id'], PDO::PARAM_INT);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Password berhasil diubah']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal mengubah password']);
}
?>
