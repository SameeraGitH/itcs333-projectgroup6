<?php

try {
  $pdo = new PDO("mysql:host=127.0.0.1;dbname=mydb","campus-news","", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([ 'error' => 'DB connection failed: ' . $e->getMessage() ]);
  exit;
}
