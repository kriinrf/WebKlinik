<?php
// backend/api/auth/login.php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['username']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Username dan password wajib diisi']);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$stmt = $db->prepare("SELECT id, username, password, role, reference_id FROM users WHERE username = :username LIMIT 1");
$stmt->bindParam(':username', $data['username']);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($data['password'], $user['password'])) {
    // Remove password from user session data
    unset($user['password']);
    
    // Additional info depending on role
    if ($user['role'] === 'pasien' && $user['reference_id']) {
        $stmt2 = $db->prepare("SELECT name FROM patients WHERE id = :ref_id");
        $stmt2->bindParam(':ref_id', $user['reference_id']);
        $stmt2->execute();
        $patient = $stmt2->fetch(PDO::FETCH_ASSOC);
        if ($patient) {
            $user['name'] = $patient['name'];
        }
    }

    if ($user['role'] === 'dokter' && $user['reference_id']) {
        $stmt2 = $db->prepare("SELECT name FROM doctors WHERE id = :ref_id");
        $stmt2->bindParam(':ref_id', $user['reference_id']);
        $stmt2->execute();
        $doctor = $stmt2->fetch(PDO::FETCH_ASSOC);
        if ($doctor) {
            $user['name'] = $doctor['name'];
        }
    }

    $_SESSION['user'] = $user;

    echo json_encode([
        'status' => 'success',
        'message' => 'Login berhasil',
        'data' => $user
    ]);
} else {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Username atau password salah']);
}
?>
