<?php
// backend/api/doctors.php
require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$user = require_login(); // All logged in users can view the list of doctors

$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->query("SELECT id, name, poli FROM doctors ORDER BY name ASC");
    $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => $doctors
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error'
    ]);
}
?>
