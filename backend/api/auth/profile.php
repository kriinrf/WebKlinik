<?php
// backend/api/auth/profile.php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$user = require_login();

$database = new Database();
$db = $database->getConnection();

$responseData = $user;

// Enrich with full profile data based on role
if ($user['role'] === 'pasien' && $user['reference_id']) {
    $stmt = $db->prepare("SELECT * FROM patients WHERE id = :ref_id LIMIT 1");
    $stmt->bindParam(':ref_id', $user['reference_id'], PDO::PARAM_INT);
    $stmt->execute();
    $patient = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($patient) {
        $responseData['profile'] = $patient;
        $responseData['name'] = $patient['name'];
    }
} elseif ($user['role'] === 'dokter' && $user['reference_id']) {
    $stmt = $db->prepare("SELECT * FROM doctors WHERE id = :ref_id LIMIT 1");
    $stmt->bindParam(':ref_id', $user['reference_id'], PDO::PARAM_INT);
    $stmt->execute();
    $doctor = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($doctor) {
        $responseData['profile'] = $doctor;
        $responseData['name'] = $doctor['name'];
    }
}

echo json_encode([
    'status' => 'success',
    'data' => $responseData
]);
?>
