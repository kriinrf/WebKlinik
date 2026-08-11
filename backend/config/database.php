<?php
// =============================================
// Database Configuration
// Sistem Informasi Klinik Sejahterah
// =============================================

class Database {
    private $host = 'sql107.infinityfree.com';
    private $db_name = 'if0_42625673_klinik_sejahterah';
    private $username = 'if0_42625673';
    private $password = 'XY8a3TYYijZM';
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Database connection failed: ' . $e->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}
