<?php
// backend/api/patient/update_profile.php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Patient.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$user = require_role(['pasien']);

if (!$user['reference_id']) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Patient profile not linked']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['phone']) || empty($data['address'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Phone and address required']);
    exit;
}

$database = new Database();
$db = $database->getConnection();
$patient = new Patient($db);

if ($patient->updateContact($user['reference_id'], $data['phone'], $data['address'])) {
    echo json_encode(['status' => 'success', 'message' => 'Profile updated']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update profile']);
}
?>
