<?php
// backend/api/auth/update_profile.php
// Universal profile update for all roles
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$user = require_login();
$data = json_decode(file_get_contents('php://input'), true);

$database = new Database();
$db = $database->getConnection();

try {
    $db->beginTransaction();

    if ($user['role'] === 'pasien' && $user['reference_id']) {
        // Update patients table
        if (empty($data['name']) || empty($data['nik']) || empty($data['phone']) || 
            empty($data['birth_place']) || empty($data['birth_date']) || empty($data['address']) || empty($data['email'])) {
            http_response_code(422);
            echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi']);
            exit;
        }

        // Validasi NIK 16 angka
        if (!preg_match('/^\d{16}$/', $data['nik'])) {
            http_response_code(422);
            echo json_encode(['status' => 'error', 'message' => 'NIK harus 16 angka']);
            exit;
        }

        // Cek NIK unik (exclude diri sendiri)
        $stmt = $db->prepare("SELECT id FROM patients WHERE nik = :nik AND id != :id LIMIT 1");
        $stmt->bindParam(':nik', $data['nik']);
        $stmt->bindParam(':id', $user['reference_id'], PDO::PARAM_INT);
        $stmt->execute();
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'NIK sudah digunakan oleh pasien lain']);
            exit;
        }

        $stmt = $db->prepare("UPDATE patients SET 
                              name = :name, nik = :nik, phone = :phone, 
                              birth_place = :birth_place, birth_date = :birth_date, 
                              address = :address, email = :email 
                              WHERE id = :id");
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':nik', $data['nik']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':birth_place', $data['birth_place']);
        $stmt->bindParam(':birth_date', $data['birth_date']);
        $stmt->bindParam(':address', $data['address']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':id', $user['reference_id'], PDO::PARAM_INT);
        $stmt->execute();

        // Update name in session
        $_SESSION['user']['name'] = $data['name'];

    } elseif ($user['role'] === 'dokter' && $user['reference_id']) {
        // Update doctors table
        if (empty($data['name']) || empty($data['poli']) || empty($data['no_str']) || empty($data['email'])) {
            http_response_code(422);
            echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi']);
            exit;
        }

        // Validasi No STR 4 angka
        if (!preg_match('/^\d{4}$/', $data['no_str'])) {
            http_response_code(422);
            echo json_encode(['status' => 'error', 'message' => 'No STR harus 4 angka']);
            exit;
        }

        // Cek No STR unik (exclude diri sendiri)
        $stmt = $db->prepare("SELECT id FROM doctors WHERE no_str = :no_str AND id != :id LIMIT 1");
        $stmt->bindParam(':no_str', $data['no_str']);
        $stmt->bindParam(':id', $user['reference_id'], PDO::PARAM_INT);
        $stmt->execute();
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'No STR sudah digunakan oleh dokter lain']);
            exit;
        }

        $stmt = $db->prepare("UPDATE doctors SET 
                              name = :name, poli = :poli, no_str = :no_str, email = :email 
                              WHERE id = :id");
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':poli', $data['poli']);
        $stmt->bindParam(':no_str', $data['no_str']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':id', $user['reference_id'], PDO::PARAM_INT);
        $stmt->execute();

        // Update name in session
        $_SESSION['user']['name'] = $data['name'];

    } elseif ($user['role'] === 'admin') {
        // Admin can only update username
        if (!empty($data['username'])) {
            // Cek username unik
            $stmt = $db->prepare("SELECT id FROM users WHERE username = :username AND id != :id LIMIT 1");
            $stmt->bindParam(':username', $data['username']);
            $stmt->bindParam(':id', $user['id'], PDO::PARAM_INT);
            $stmt->execute();
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['status' => 'error', 'message' => 'Username sudah digunakan']);
                exit;
            }

            $stmt = $db->prepare("UPDATE users SET username = :username WHERE id = :id");
            $stmt->bindParam(':username', $data['username']);
            $stmt->bindParam(':id', $user['id'], PDO::PARAM_INT);
            $stmt->execute();

            $_SESSION['user']['username'] = $data['username'];
        }
    }

    $db->commit();

    echo json_encode([
        'status' => 'success', 
        'message' => 'Profil berhasil diperbarui',
        'data' => $_SESSION['user']
    ]);

} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui profil: ' . $e->getMessage()]);
}
?>
