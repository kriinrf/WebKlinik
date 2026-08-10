<?php
// =============================================
// Model: Visit
// =============================================

class Visit {
    private $conn;
    private $table = 'visits';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all visits (with patient name and doctor name via JOIN)
    public function getAll($search = '') {
        $query = "SELECT v.*, p.name as patient_name, p.medical_record_no, d.name as doctor_name 
                  FROM {$this->table} v 
                  LEFT JOIN patients p ON v.patient_id = p.id
                  LEFT JOIN doctors d ON v.doctor_id = d.id";
        
        if (!empty($search)) {
            $query .= " WHERE p.name LIKE :search 
                         OR v.complaint LIKE :search 
                         OR d.name LIKE :search 
                         OR p.medical_record_no LIKE :search";
        }
        
        $query .= " ORDER BY v.visit_date DESC, v.id DESC";
        
        $stmt = $this->conn->prepare($query);
        
        if (!empty($search)) {
            $searchTerm = "%{$search}%";
            $stmt->bindParam(':search', $searchTerm);
        }
        
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Get single visit by ID
    public function getById($id) {
        $query = "SELECT v.*, p.name as patient_name, p.medical_record_no, d.name as doctor_name 
                  FROM {$this->table} v 
                  LEFT JOIN patients p ON v.patient_id = p.id 
                  LEFT JOIN doctors d ON v.doctor_id = d.id
                  WHERE v.id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function create($data) {
        $query = "INSERT INTO {$this->table} 
                  (patient_id, doctor_id, visit_date, complaint, status, note, service_note) 
                  VALUES (:patient_id, :doctor_id, :visit_date, :complaint, :status, :note, :service_note)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':patient_id', $data['patient_id'], PDO::PARAM_INT);
        $stmt->bindParam(':doctor_id', $data['doctor_id'], PDO::PARAM_INT);
        $stmt->bindParam(':visit_date', $data['visit_date']);
        $stmt->bindParam(':complaint', $data['complaint']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':note', $data['note']);
        $service_note = isset($data['service_note']) ? $data['service_note'] : null;
        $stmt->bindParam(':service_note', $service_note);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update visit
    public function update($id, $data) {
        $query = "UPDATE {$this->table} SET 
                  patient_id = :patient_id,
                  doctor_id = :doctor_id,
                  visit_date = :visit_date,
                  complaint = :complaint,
                  status = :status,
                  note = :note,
                  service_note = :service_note
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':patient_id', $data['patient_id'], PDO::PARAM_INT);
        $stmt->bindParam(':doctor_id', $data['doctor_id'], PDO::PARAM_INT);
        $stmt->bindParam(':visit_date', $data['visit_date']);
        $stmt->bindParam(':complaint', $data['complaint']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':note', $data['note']);
        $service_note = isset($data['service_note']) ? $data['service_note'] : null;
        $stmt->bindParam(':service_note', $service_note);
        
        return $stmt->execute();
    }

    // Delete visit
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // Count total visits
    public function count() {
        $query = "SELECT COUNT(*) as total FROM {$this->table}";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch();
        return (int) $row['total'];
    }

    // Get latest visits (for dashboard)
    public function getLatest($limit = 5) {
        $query = "SELECT v.*, p.name as patient_name, p.medical_record_no, d.name as doctor_name 
                  FROM {$this->table} v 
                  LEFT JOIN patients p ON v.patient_id = p.id 
                  LEFT JOIN doctors d ON v.doctor_id = d.id
                  ORDER BY v.visit_date DESC, v.id DESC 
                  LIMIT :limit";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Get visit counts grouped by date range (for dashboard chart)
    public function getChartData($groupBy = 'month', $year = null) {
        if ($year === null) {
            $year = date('Y');
        }

        switch ($groupBy) {
            case 'day':
                $query = "SELECT DATE(visit_date) as label, COUNT(*) as total 
                          FROM {$this->table} 
                          WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) 
                          GROUP BY DATE(visit_date) 
                          ORDER BY visit_date ASC";
                break;
            case 'week':
                $query = "SELECT YEARWEEK(visit_date, 1) as week_num,
                                 MIN(visit_date) as week_start,
                                 MAX(visit_date) as week_end,
                                 COUNT(*) as total 
                          FROM {$this->table} 
                          WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK) 
                          GROUP BY YEARWEEK(visit_date, 1) 
                          ORDER BY week_num ASC";
                break;
            case 'month':
                $query = "SELECT MONTH(visit_date) as month_num, COUNT(*) as total 
                          FROM {$this->table} 
                          WHERE YEAR(visit_date) = :year 
                          GROUP BY MONTH(visit_date) 
                          ORDER BY month_num ASC";
                break;
            case 'year':
                $query = "SELECT YEAR(visit_date) as year_num, COUNT(*) as total 
                          FROM {$this->table} 
                          WHERE YEAR(visit_date) >= YEAR(CURDATE()) - 4 
                          GROUP BY YEAR(visit_date) 
                          ORDER BY year_num ASC";
                break;
            default:
                return [];
        }

        $stmt = $this->conn->prepare($query);
        if ($groupBy === 'month') {
            $stmt->bindParam(':year', $year, PDO::PARAM_INT);
        }
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Get today's visits for a specific doctor
    public function getTodayVisitsByDoctor($doctorUsername) {
        $query = "SELECT v.*, p.name as patient_name, p.medical_record_no, p.birth_date, p.gender, d.name as doctor_name 
                  FROM {$this->table} v 
                  LEFT JOIN patients p ON v.patient_id = p.id 
                  LEFT JOIN doctors d ON v.doctor_id = d.id
                  WHERE DATE(v.visit_date) = CURDATE()
                  ORDER BY v.status ASC, v.id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Update status only (for Doctor role)
    public function updateStatus($id, $status) {
        $query = "UPDATE {$this->table} SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status);
        return $stmt->execute();
    }

    // Update service note (for Doctor role)
    public function updateNote($id, $note) {
        $query = "UPDATE {$this->table} SET service_note = :note WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':note', $note);
        return $stmt->execute();
    }

    // Get visit history for a specific patient
    public function getPatientHistory($patientId) {
        $query = "SELECT v.*, p.name as patient_name, p.medical_record_no, d.name as doctor_name 
                  FROM {$this->table} v 
                  LEFT JOIN patients p ON v.patient_id = p.id 
                  LEFT JOIN doctors d ON v.doctor_id = d.id
                  WHERE v.patient_id = :patient_id 
                  ORDER BY v.visit_date DESC, v.id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':patient_id', $patientId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
?>
