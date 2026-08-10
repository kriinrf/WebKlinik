<?php
// backend/api/patient/profile.php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Patient.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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

$database = new Database();
$db = $database->getConnection();
$patient = new Patient($db);

$patientData = $patient->getById($user['reference_id']);

if ($patientData) {
    echo json_encode(['status' => 'success', 'data' => $patientData]);
} else {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Patient data not found']);
}
?>
