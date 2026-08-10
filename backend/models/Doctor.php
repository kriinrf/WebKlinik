<?php
// =============================================
// Model: Doctor
// =============================================

class Doctor {
    private $conn;
    private $table = 'doctors';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get single doctor by ID
    public function getById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    // Get doctor by No STR (for duplicate check)
    public function getByNoStr($noStr) {
        $query = "SELECT * FROM {$this->table} WHERE no_str = :no_str LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':no_str', $noStr);
        $stmt->execute();
        return $stmt->fetch();
    }

    // Create new doctor
    public function create($data) {
        $query = "INSERT INTO {$this->table} 
                  (name, poli, no_str, email) 
                  VALUES (:name, :poli, :no_str, :email)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':poli', $data['poli']);
        $stmt->bindParam(':no_str', $data['no_str']);
        $stmt->bindParam(':email', $data['email']);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update doctor profile
    public function update($id, $data) {
        $query = "UPDATE {$this->table} SET 
                  name = :name,
                  poli = :poli,
                  no_str = :no_str,
                  email = :email
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':poli', $data['poli']);
        $stmt->bindParam(':no_str', $data['no_str']);
        $stmt->bindParam(':email', $data['email']);
        
        return $stmt->execute();
    }

    // Get all doctors
    public function getAll() {
        $query = "SELECT * FROM {$this->table} ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
?>
