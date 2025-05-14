<?php
require 'db.php';

header('Content-Type: application/json');
$id = $_GET['id'] ?? null;
$data = json_decode(file_get_contents('php://input'), true);

if (!$id || !$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE activities SET title=?, club=?, date_time=?, description=? WHERE id=?");
    $success = $stmt->execute([
        htmlspecialchars($data['title']),
        htmlspecialchars($data['club']),
        date('Y-m-d H:i:s', strtotime($data['dateTime'])),
        htmlspecialchars($data['description']),
        $id
    ]);

    echo json_encode(['success' => $success]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
