<?php
header("Content-Type: application/json");
require 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM activities"); 
    $activities = $stmt->fetchAll();
    echo json_encode($activities);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch activities: ' . $e->getMessage()]);
}
?>
