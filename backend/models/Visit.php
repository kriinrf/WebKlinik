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

    // Get all visits (with patient name via JOIN)
    public function getAll($search = '') {
        $query = "SELECT v.*, p.name as patient_name, p.medical_record_no 
                  FROM {$this->table} v 
                  LEFT JOIN patients p ON v.patient_id = p.id";
        
        if (!empty($search)) {
            $query .= " WHERE p.name LIKE :search 
                         OR v.complaint LIKE :search 
                         OR v.doctor LIKE :search 
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
        $query = "SELECT v.*, p.name as patient_name, p.medical_record_no 
                  FROM {$this->table} v 
                  LEFT JOIN patients p ON v.patient_id = p.id 
                  WHERE v.id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    // Create new visit
    public function create($data) {
        $query = "INSERT INTO {$this->table} 
                  (patient_id, visit_date, complaint, doctor, status, note) 
                  VALUES (:patient_id, :visit_date, :complaint, :doctor, :status, :note)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':patient_id', $data['patient_id'], PDO::PARAM_INT);
        $stmt->bindParam(':visit_date', $data['visit_date']);
        $stmt->bindParam(':complaint', $data['complaint']);
        $stmt->bindParam(':doctor', $data['doctor']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':note', $data['note']);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update visit
    public function update($id, $data) {
        $query = "UPDATE {$this->table} SET 
                  patient_id = :patient_id,
                  visit_date = :visit_date,
                  complaint = :complaint,
                  doctor = :doctor,
                  status = :status,
                  note = :note
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':patient_id', $data['patient_id'], PDO::PARAM_INT);
        $stmt->bindParam(':visit_date', $data['visit_date']);
        $stmt->bindParam(':complaint', $data['complaint']);
        $stmt->bindParam(':doctor', $data['doctor']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':note', $data['note']);
        
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
        $query = "SELECT v.*, p.name as patient_name, p.medical_record_no 
                  FROM {$this->table} v 
                  LEFT JOIN patients p ON v.patient_id = p.id 
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
                // Last 7 days
                $query = "SELECT DATE(visit_date) as label, COUNT(*) as total 
                          FROM {$this->table} 
                          WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) 
                          GROUP BY DATE(visit_date) 
                          ORDER BY visit_date ASC";
                break;

            case 'week':
                // Last 4 weeks
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
                // All months of a given year
                $query = "SELECT MONTH(visit_date) as month_num, COUNT(*) as total 
                          FROM {$this->table} 
                          WHERE YEAR(visit_date) = :year 
                          GROUP BY MONTH(visit_date) 
                          ORDER BY month_num ASC";
                break;

            case 'year':
                // Last 5 years
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
}
