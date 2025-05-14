<?php
require 'db.php';

//  debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);


file_put_contents('debug.log', "Input received: " . $input . "\n", FILE_APPEND);

if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON data',
        'received' => $input
    ]);
    exit;
}

// Validating required fields
$required = ['title', 'club', 'dateTime', 'description'];
$missing = array_diff($required, array_keys($data));

if (!empty($missing)) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missing),
        'received' => array_keys($data)
    ]);
    exit;
}

try {
    // Format datetime for MariaDB
    $dateTime = date('Y-m-d H:i:s', strtotime($data['dateTime']));
    if (!$dateTime) {
        throw new Exception("Invalid date format: " . $data['dateTime']);
    }

    // Insert into database
    $stmt = $pdo->prepare("INSERT INTO activities (title, club, date_time, description) VALUES (?, ?, ?, ?)"); //preventing SQL injections
    $success = $stmt->execute([
        htmlspecialchars($data['title']),
        htmlspecialchars($data['club']),
        $dateTime,
        htmlspecialchars($data['description'])
    ]);

    if ($success) {
        // Geting  the inserted ID for confirmation
        $insertId = $pdo->lastInsertId();
        file_put_contents('debug.log', "Insert successful. ID: $insertId\n", FILE_APPEND);

        echo json_encode([
            'success' => true,
            'id' => $insertId
        ]);
    } else {
        $errorInfo = $stmt->errorInfo();
        file_put_contents('debug.log', "DB Error: " . print_r($errorInfo, true) . "\n", FILE_APPEND);

        echo json_encode([
            'success' => false,
            'message' => 'Database error',
            'error' => $errorInfo[2]
        ]);
    }
} catch (PDOException $e) {
    file_put_contents('debug.log', "PDO Exception: " . $e->getMessage() . "\n", FILE_APPEND);

    echo json_encode([
        'success' => false,
        'message' => 'Database exception',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    file_put_contents('debug.log', "General Exception: " . $e->getMessage() . "\n", FILE_APPEND);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

