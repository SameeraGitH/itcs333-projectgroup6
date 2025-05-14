<?php
$host = 'localhost';
$db   = 'mydb';
$user = 'user1';
$pass = 'abcd1234';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

header('Content-Type: application/json');

// Handling different actions
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'getActivities':
            $stmt = $pdo->query("SELECT * FROM activities");
            echo json_encode($stmt->fetchAll());
            break;

        case 'getActivity':
            if (!isset($_GET['id'])) {
                echo json_encode(['error' => 'Missing activity ID']);
                break;
            }
            $stmt = $pdo->prepare("SELECT * FROM activities WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $activity = $stmt->fetch();

            if ($activity) {
                
                $activity['dateTime'] = $activity['date_time'] ?? $activity['dateTime'] ?? '';
                echo json_encode($activity);
            } else {
                echo json_encode(['error' => 'Activity not found']);
            }
            break;

        default:
            echo json_encode(['error' => 'Invalid action']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}