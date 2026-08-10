<?php
// =============================================
// Model: Patient
// =============================================

class Patient {
    private $conn;
    private $table = 'patients';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all patients
    public function getAll($search = '') {
        $query = "SELECT * FROM {$this->table}";
        
        if (!empty($search)) {
            $query .= " WHERE name LIKE :search 
                         OR medical_record_no LIKE :search 
                         OR nik LIKE :search 
                         OR phone LIKE :search";
        }
        
        $query .= " ORDER BY id DESC";
        
        $stmt = $this->conn->prepare($query);
        
        if (!empty($search)) {
            $searchTerm = "%{$search}%";
            $stmt->bindParam(':search', $searchTerm);
        }
        
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Get single patient by ID
    public function getById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    // Create new patient
    public function create($data) {
        $query = "INSERT INTO {$this->table} 
                  (medical_record_no, nik, name, gender, birth_date, phone, address) 
                  VALUES (:medical_record_no, :nik, :name, :gender, :birth_date, :phone, :address)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':medical_record_no', $data['medical_record_no']);
        $stmt->bindParam(':nik', $data['nik']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':gender', $data['gender']);
        $stmt->bindParam(':birth_date', $data['birth_date']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':address', $data['address']);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update patient
    public function update($id, $data) {
        $query = "UPDATE {$this->table} SET 
                  medical_record_no = :medical_record_no,
                  nik = :nik,
                  name = :name,
                  gender = :gender,
                  birth_date = :birth_date,
                  phone = :phone,
                  address = :address
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':medical_record_no', $data['medical_record_no']);
        $stmt->bindParam(':nik', $data['nik']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':gender', $data['gender']);
        $stmt->bindParam(':birth_date', $data['birth_date']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':address', $data['address']);
        
        return $stmt->execute();
    }

    // Delete patient
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // Count total patients
    public function count() {
        $query = "SELECT COUNT(*) as total FROM {$this->table}";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch();
        return (int) $row['total'];
    }

    // Update patient contact info (phone & address)
    public function updateContact($id, $phone, $address) {
        $query = "UPDATE {$this->table} SET 
                  phone = :phone,
                  address = :address
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':address', $address);
        
        return $stmt->execute();
    }
}
?>
