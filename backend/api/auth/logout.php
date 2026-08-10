<?php
// backend/api/auth/logout.php
require_once __DIR__ . '/../../utils/auth.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Destroy session
session_unset();
session_destroy();

echo json_encode([
    'status' => 'success',
    'message' => 'Logout berhasil'
]);
?>
