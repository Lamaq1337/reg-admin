<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

$pdo = new PDO("mysql:host=localhost;dbname=123123", "root", "");

$stmt = $pdo->query("SELECT id, name, email, phone, username FROM pending_users");
$pendingUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["pendingUsers" => $pendingUsers]);
?>
