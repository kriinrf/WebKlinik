<?php
require_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "Memulai proses hashing password pada database...\n";

try {
    $db->beginTransaction();
    
    // Ambil semua user
    $stmt = $db->query("SELECT id, password FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $updatedCount = 0;
    foreach ($users as $user) {
        // Cek jika password sudah di-hash (panjang bcrypt hash = 60, dan mulai dengan $2y$)
        if (strlen($user['password']) === 60 && substr($user['password'], 0, 4) === '$2y$') {
            continue; // Sudah di-hash
        }
        
        $hashed = password_hash($user['password'], PASSWORD_BCRYPT);
        
        $updateStmt = $db->prepare("UPDATE users SET password = :password WHERE id = :id");
        $updateStmt->bindParam(':password', $hashed);
        $updateStmt->bindParam(':id', $user['id'], PDO::PARAM_INT);
        $updateStmt->execute();
        
        $updatedCount++;
    }
    
    $db->commit();
    echo "Berhasil menghash password untuk $updatedCount user.\n";
} catch (Exception $e) {
    $db->rollBack();
    echo "Terjadi kesalahan: " . $e->getMessage() . "\n";
}
?>
