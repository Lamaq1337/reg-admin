<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

$pdo = new PDO("mysql:host=localhost;dbname=123123", "root", "");

$stmt = $pdo->query("SELECT id, file_name, file_path FROM pending_photos");
$pendingPhotos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["pendingPhotos" => $pendingPhotos]);
?>
