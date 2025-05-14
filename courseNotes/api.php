<?php
$host = '127.0.0.1';
$db = 'courseNotes';
$user = 'marwa';
$pass = 'ma123467';
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
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

//function to handle creating new notes
function createNote() {
    global $pdo;
    $title = $_POST['title'];
    $content = $_POST['content'];

    $stmt = $pdo->prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
    $stmt->execute([$title, $content]);

    echo json_encode(['message' => 'Note created successfully']);
}


?>
