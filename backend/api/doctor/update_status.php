<?php
// backend/api/doctor/update_status.php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/Visit.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$user = require_role(['admin', 'dokter']);

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($_GET['id']) || empty($data['status'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID and status required']);
    exit;
}

$id = $_GET['id'];
$status = $data['status'];

$database = new Database();
$db = $database->getConnection();
$visit = new Visit($db);

if ($visit->updateStatus($id, $status)) {
    echo json_encode(['status' => 'success', 'message' => 'Status updated']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update status']);
}
?>
