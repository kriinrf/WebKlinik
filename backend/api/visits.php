<?php
// =============================================
// API: Visits (CRUD)
// =============================================
require_once __DIR__ . '/../utils/auth.php';
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

// Require login for default, we will handle roles manually
$user = require_login();
require_once __DIR__ . '/../models/Visit.php';

$database = new Database();
$db = $database->getConnection();
$visit = new Visit($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Allow admin and dokter to GET
        if (!in_array($user['role'], ['admin', 'dokter'])) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Forbidden']);
            break;
        }

        if (isset($_GET['id'])) {
            $result = $visit->getById($_GET['id']);
            if ($result) {
                if ($user['role'] === 'pasien' && $result['patient_id'] != $user['reference_id']) {
                    $result['patient_name'] = mask_string($result['patient_name']);
                }
                echo json_encode(['status' => 'success', 'data' => $result]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Kunjungan tidak ditemukan']);
            }
        } else {
            $search = isset($_GET['search']) ? $_GET['search'] : '';
            $result = $visit->getAll($search);
            
            if ($user['role'] === 'pasien') {
                foreach ($result as &$row) {
                    if ($row['patient_id'] != $user['reference_id']) {
                        $row['patient_name'] = mask_string($row['patient_name']);
                    }
                }
            }
            
            echo json_encode(['status' => 'success', 'data' => $result]);
        }
        break;

    // ---- POST: Create new visit ----
    case 'POST':
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Hanya admin yang dapat menambah data']);
            break;
        }
        $data = json_decode(file_get_contents('php://input'), true);

        // Validation
        $errors = [];
        if (empty($data['patient_id'])) $errors[] = 'Pasien wajib dipilih';
        if (empty($data['visit_date'])) $errors[] = 'Tanggal kunjungan wajib diisi';
        if (empty($data['complaint'])) $errors[] = 'Keluhan wajib diisi';
        if (empty($data['doctor'])) $errors[] = 'Dokter wajib diisi';
        if (empty($data['status'])) $errors[] = 'Status wajib dipilih';

        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode(['status' => 'error', 'message' => 'Validasi gagal', 'errors' => $errors]);
            break;
        }

        // Default note to empty string if not provided
        if (!isset($data['note'])) {
            $data['note'] = null;
        }

        try {
            $id = $visit->create($data);
            if ($id) {
                $newVisit = $visit->getById($id);
                http_response_code(201);
                echo json_encode(['status' => 'success', 'message' => 'Kunjungan berhasil ditambahkan', 'data' => $newVisit]);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Gagal menambahkan kunjungan']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
        break;

    // ---- PUT: Update visit ----
    case 'PUT':
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Hanya admin yang dapat mengubah data']);
            break;
        }
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID kunjungan diperlukan']);
            break;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'];

        $existing = $visit->getById($id);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Kunjungan tidak ditemukan']);
            break;
        }

        // Validation
        $errors = [];
        if (empty($data['patient_id'])) $errors[] = 'Pasien wajib dipilih';
        if (empty($data['visit_date'])) $errors[] = 'Tanggal kunjungan wajib diisi';
        if (empty($data['complaint'])) $errors[] = 'Keluhan wajib diisi';
        if (empty($data['doctor'])) $errors[] = 'Dokter wajib diisi';
        if (empty($data['status'])) $errors[] = 'Status wajib dipilih';

        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode(['status' => 'error', 'message' => 'Validasi gagal', 'errors' => $errors]);
            break;
        }

        if (!isset($data['note'])) {
            $data['note'] = null;
        }

        try {
            if ($visit->update($id, $data)) {
                $updated = $visit->getById($id);
                echo json_encode(['status' => 'success', 'message' => 'Data kunjungan berhasil diperbarui', 'data' => $updated]);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui data kunjungan']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
        break;

    // ---- DELETE: Delete visit ----
    case 'DELETE':
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Hanya admin yang dapat menghapus data']);
            break;
        }
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID kunjungan diperlukan']);
            break;
        }

        $id = $_GET['id'];

        $existing = $visit->getById($id);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Kunjungan tidak ditemukan']);
            break;
        }

        if ($visit->delete($id)) {
            echo json_encode(['status' => 'success', 'message' => 'Data kunjungan berhasil dihapus']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus data kunjungan']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
