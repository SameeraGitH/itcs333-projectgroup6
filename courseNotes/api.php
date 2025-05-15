<?php
$host = '127.0.0.1';
$db = 'courseNotes';
$user = 'marwa';
$pass = 'ma123467';
$charset = 'utf8mb4';



$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Database connection successful!";

    $sql=CREATE TABLE notes2 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
 
    $pdo->exec($sql);

} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Function to create a new note
function createNote() {
    global $pdo;
    $title = $_POST['title'];
    $content = $_POST['content'];

    $stmt = $pdo->prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
    $stmt->execute([$title, $content]);

    echo json_encode(['message' => 'Note created successfully']);
}

// Function to fetch all notes
function getNotes() {
    global $pdo;
    $stmt = $pdo->query('SELECT * FROM notes');
    $notes = $stmt->fetchAll();

    echo json_encode($notes);
}

// Function to update a note
function updateNote() {
    global $pdo;
    $id = $_POST['id'];
    $title = $_POST['title'];
    $content = $_POST['content'];

    $stmt = $pdo->prepare('UPDATE notes SET title = ?, content = ? WHERE id = ?');
    $stmt->execute([$title, $content, $id]);

    echo json_encode(['message' => 'Note updated successfully']);
}

// Function to delete a note
function deleteNote() {
    global $pdo;
    $id = $_POST['id'];

    $stmt = $pdo->prepare('DELETE FROM notes WHERE id = ?');
    $stmt->execute([$id]);

    echo json_encode(['message' => 'Note deleted successfully']);
}


// Routing logic to handle different API requests
$request_method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'];

switch ($request_method) {
    case 'POST':
        if ($path == '/create') {
            createNote();
        } elseif ($path == '/update') {
            updateNote();
        } elseif ($path == '/delete') {
            deleteNote();
        }
        break;
    case 'GET':
        if ($path == '/notes') {
            getNotes();
        }
        break;
    default:
        echo json_encode(['message' => 'Invalid request method']);
        break;
}



?>

