$stmt = $pdo->prepare("SELECT * FROM v_student_marks WHERE student_id = ?");
$stmt->execute([$_SESSION['user_id']]);
