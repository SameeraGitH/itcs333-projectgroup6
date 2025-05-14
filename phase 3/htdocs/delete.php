<?php
require 'db.php';

header('Content-Type: application/json');
$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'No ID provided']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM activities WHERE id = ?");
    $success = $stmt->execute([$id]);
    echo json_encode(['success' => $success]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}