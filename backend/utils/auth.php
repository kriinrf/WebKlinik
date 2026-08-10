<?php
// backend/utils/auth.php
// Allow credentials for cookies/session
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start session if not started
if (session_status() === PHP_SESSION_NONE) {
    // Configure session to work across different ports on localhost
    session_set_cookie_params([
        'samesite' => 'Lax',
        'secure' => false, // false for localhost without HTTPS
        'httponly' => true
    ]);
    session_start();
}

/**
 * Require a logged-in user.
 * @return array user info from session
 */
function require_login() {
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized. Harap login.']);
        exit;
    }
    return $_SESSION['user'];
}

/**
 * Require a specific role or roles
 * @param string|array $roles
 */
function require_role($roles) {
    $user = require_login();
    if (!is_array($roles)) {
        $roles = [$roles];
    }
    if (!in_array($user['role'], $roles)) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Forbidden. Akses ditolak.']);
        exit;
    }
    return $user;
}

/**
 * Mask a string (e.g. John Doe -> J*** D***)
 */
function mask_string($string) {
    if (!$string) return $string;
    $words = explode(' ', $string);
    $masked = [];
    foreach ($words as $word) {
        if (strlen($word) > 1) {
            $masked[] = substr($word, 0, 1) . str_repeat('*', strlen($word) - 1);
        } else {
            $masked[] = $word;
        }
    }
    return implode(' ', $masked);
}

/**
 * Mask NIK (e.g. 1234567890123456 -> 1234********3456)
 */
function mask_nik($nik) {
    if (!$nik || strlen($nik) < 8) return $nik;
    return substr($nik, 0, 4) . str_repeat('*', strlen($nik) - 8) . substr($nik, -4);
}

/**
 * Mask Phone (e.g. 0812345678 -> 081***78)
 */
function mask_phone($phone) {
    if (!$phone || strlen($phone) < 5) return $phone;
    return substr($phone, 0, 3) . str_repeat('*', strlen($phone) - 5) . substr($phone, -2);
}
?>
