<?php
header('Content-Type: application/json');

$pdo = new PDO("mysql:host=localhost;dbname=military_portal;charset=utf8mb4", "root", "");

$stmt = $pdo->prepare("SELECT * FROM v_student_progress ORDER BY last_updated DESC");
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
