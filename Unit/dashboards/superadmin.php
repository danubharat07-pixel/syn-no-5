<?php
header('Content-Type: application/json');
$pdo = new PDO('mysql:host=localhost;dbname=training', 'user', 'pass');

// Optional: filter by date or course
$date = $_GET['date'] ?? date('Y-m-d');
$course = $_GET['course'] ?? '';

$sql = "SELECT trainee_id, course_name, status FROM attendance WHERE date = ?";
$params = [$date];

if ($course !== '') {
  $sql .= " AND course_name = ?";
  $params[] = $course;
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);
<?php
$pdo = new PDO('mysql:host=localhost;dbname=training', 'user', 'pass');
$trainee_id = $_POST['trainee_id'];
$course_name = $_POST['course_name'];
$date = $_POST['date'];
$status = $_POST['status'];

$sql = "INSERT INTO attendance (trainee_id, course_name, date, status)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status = VALUES(status)";
$stmt = $pdo->prepare($sql);
$stmt->execute([$trainee_id, $course_name, $date, $status]);

echo "Attendance recorded.";
<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "army_training";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
<?php
header('Content-Type: application/json');
$pdo = new PDO('mysql:host=localhost;dbname=training', 'user', 'pass');

// Optional: filter by trainee or course
$trainee = $_GET['trainee'] ?? '';
$course = $_GET['course'] ?? '';

$sql = "SELECT trainee_id, trainee_name, course_name, performance_score, remarks, last_updated FROM progress_reports WHERE 1=1";
$params = [];

if ($trainee !== '') {
  $sql .= " AND trainee_name LIKE ?";
  $params[] = "%$trainee%";
}
if ($course !== '') {
  $sql .= " AND course_name = ?";
  $params[] = $course;
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);
