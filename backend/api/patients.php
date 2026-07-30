<?php
// =============================================
// API: Patients (CRUD)
// =============================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Patient.php';

$database = new Database();
$db = $database->getConnection();
$patient = new Patient($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // ---- GET: List all or single patient ----
    case 'GET':
        if (isset($_GET['id'])) {
            $result = $patient->getById($_GET['id']);
            if ($result) {
                echo json_encode(['status' => 'success', 'data' => $result]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Pasien tidak ditemukan']);
            }
        } else {
            $search = isset($_GET['search']) ? $_GET['search'] : '';
            $result = $patient->getAll($search);
            echo json_encode(['status' => 'success', 'data' => $result]);
        }
        break;

    // ---- POST: Create new patient ----
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        // Validation
        $errors = [];
        if (empty($data['medical_record_no'])) $errors[] = 'Nomor Rekam Medis wajib diisi';
        if (empty($data['name'])) $errors[] = 'Nama wajib diisi';
        if (empty($data['nik']) || !preg_match('/^\d{16}$/', $data['nik'])) $errors[] = 'NIK harus 16 digit angka';
        if (empty($data['gender'])) $errors[] = 'Jenis kelamin wajib dipilih';
        if (empty($data['birth_date'])) $errors[] = 'Tanggal lahir wajib diisi';

        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode(['status' => 'error', 'message' => 'Validasi gagal', 'errors' => $errors]);
            break;
        }

        try {
            $id = $patient->create($data);
            if ($id) {
                $newPatient = $patient->getById($id);
                http_response_code(201);
                echo json_encode(['status' => 'success', 'message' => 'Pasien berhasil ditambahkan', 'data' => $newPatient]);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Gagal menambahkan pasien']);
            }
        } catch (PDOException $e) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'Data duplikat: No RM atau NIK sudah digunakan']);
        }
        break;

    // ---- PUT: Update patient ----
    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID pasien diperlukan']);
            break;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'];

        // Check if exists
        $existing = $patient->getById($id);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Pasien tidak ditemukan']);
            break;
        }

        // Validation
        $errors = [];
        if (empty($data['medical_record_no'])) $errors[] = 'Nomor Rekam Medis wajib diisi';
        if (empty($data['name'])) $errors[] = 'Nama wajib diisi';
        if (empty($data['nik']) || !preg_match('/^\d{16}$/', $data['nik'])) $errors[] = 'NIK harus 16 digit angka';
        if (empty($data['gender'])) $errors[] = 'Jenis kelamin wajib dipilih';
        if (empty($data['birth_date'])) $errors[] = 'Tanggal lahir wajib diisi';

        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode(['status' => 'error', 'message' => 'Validasi gagal', 'errors' => $errors]);
            break;
        }

        try {
            if ($patient->update($id, $data)) {
                $updated = $patient->getById($id);
                echo json_encode(['status' => 'success', 'message' => 'Data pasien berhasil diperbarui', 'data' => $updated]);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui data pasien']);
            }
        } catch (PDOException $e) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'Data duplikat: No RM atau NIK sudah digunakan']);
        }
        break;

    // ---- DELETE: Delete patient ----
    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID pasien diperlukan']);
            break;
        }

        $id = $_GET['id'];

        $existing = $patient->getById($id);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Pasien tidak ditemukan']);
            break;
        }

        if ($patient->delete($id)) {
            echo json_encode(['status' => 'success', 'message' => 'Data pasien berhasil dihapus']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus data pasien']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
