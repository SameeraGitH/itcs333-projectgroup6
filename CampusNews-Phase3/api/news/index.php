<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

require_once '../../connection.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
  if ($method === 'GET') {
    if (isset($_GET['id'])) {
      $stmt = $pdo->prepare("SELECT * FROM news WHERE id = ?");
      $stmt->execute([$_GET['id']]);
      $item = $stmt->fetch();
      echo json_encode($item ?: []);
    } else {
      $page = isset($_GET['page']) ? max((int)$_GET['page'], 1) : 1;
      $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
      $offset = ($page - 1) * $limit;

      $stmt = $pdo->prepare("SELECT * FROM news");
      $stmt->execute();
      echo json_encode($stmt->fetchAll());
    }

  } elseif ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['title'], $input['college'], $input['date'], $input['summary'], $input['content'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing required fields']);
      exit;
    }

    $stmt = $pdo->prepare("INSERT INTO news (title, college, date, summary, content, image) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
      $input['title'],
      $input['college'],
      $input['date'],
      $input['summary'],
      $input['content'],
      $input['image'] ?? ''
    ]);

    echo json_encode(['message' => 'News created successfully']);

  } elseif ($method === 'PUT') {
    parse_str($_SERVER["QUERY_STRING"], $query);
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($query['id'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing ID for update']);
      exit;
    }

    $stmt = $pdo->prepare("UPDATE news SET title = ?, college = ?, date = ?, summary = ?, content = ?, image = ? WHERE id = ?");
    $stmt->execute([
      $input['title'],
      $input['college'],
      $input['date'],
      $input['summary'],
      $input['content'],
      $input['image'] ?? '',
      $query['id']
    ]);

    echo json_encode(['message' => 'News updated successfully']);

  } elseif ($method === 'DELETE') {
    parse_str($_SERVER["QUERY_STRING"], $query);
    if (!isset($query['id'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing ID for deletion']);
      exit;
    }

    $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
    $stmt->execute([$query['id']]);
    echo json_encode(['message' => 'News deleted successfully']);

  } else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
  }

} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
