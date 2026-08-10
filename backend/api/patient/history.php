<?php
// backend/api/patient/history.php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Visit.php';

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
$visit = new Visit($db);

$history = $visit->getPatientHistory($user['reference_id']);

echo json_encode(['status' => 'success', 'data' => $history]);
?>
