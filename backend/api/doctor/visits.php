<?php
// backend/api/doctor/visits.php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Visit.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$user = require_role(['admin', 'dokter']);

$database = new Database();
$db = $database->getConnection();
$visit = new Visit($db);

$doctorName = $user['username']; // Simplified for now
$visits = $visit->getTodayVisitsByDoctor($doctorName);

echo json_encode([
    'status' => 'success',
    'data' => $visits
]);
?>
