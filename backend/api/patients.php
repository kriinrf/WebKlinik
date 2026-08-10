<?php
// =============================================
// API: Patients (CRUD)
// =============================================
require_once __DIR__ . '/../utils/auth.php';
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

// Require admin role for default, but we will handle GET separately
$user = require_login();
require_once __DIR__ . '/../models/Patient.php';

$database = new Database();
$db = $database->getConnection();
$patient = new Patient($db);

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
            $result = $patient->getById($_GET['id']);
            if ($result) {
                // Mask if user is pasien and this is not their own data
                if ($user['role'] === 'pasien' && $result['id'] != $user['reference_id']) {
                    $result['name'] = mask_string($result['name']);
                    $result['nik'] = mask_nik($result['nik']);
                    $result['phone'] = mask_phone($result['phone']);
                    $result['address'] = mask_string($result['address']);
                }
                echo json_encode(['status' => 'success', 'data' => $result]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Pasien tidak ditemukan']);
            }
        } else {
            $search = isset($_GET['search']) ? $_GET['search'] : '';
            $result = $patient->getAll($search);
            
            // Mask data for pasien role
            if ($user['role'] === 'pasien') {
                foreach ($result as &$row) {
                    if ($row['id'] != $user['reference_id']) {
                        $row['name'] = mask_string($row['name']);
                        $row['nik'] = mask_nik($row['nik']);
                        $row['phone'] = mask_phone($row['phone']);
                        $row['address'] = mask_string($row['address']);
                    }
                }
            }
            
            echo json_encode(['status' => 'success', 'data' => $result]);
        }
        break;

    // ---- POST: Create new patient ----
    case 'POST':
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Hanya admin yang dapat menambah pasien']);
            break;
        }
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
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Hanya admin yang dapat mengubah data pasien']);
            break;
        }
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
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Hanya admin yang dapat menghapus data pasien']);
            break;
        }
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
