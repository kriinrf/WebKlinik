<?php
// backend/api/doctor/update_note.php
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

if (!isset($_GET['id']) || !isset($data['note'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID and note required']);
    exit;
}

$id = $_GET['id'];
$note = $data['note'];

$database = new Database();
$db = $database->getConnection();
$visit = new Visit($db);

if ($visit->updateNote($id, $note)) {
    echo json_encode(['status' => 'success', 'message' => 'Service note updated']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update service note']);
}
?>
