<?php
require_once __DIR__ . '/../inc/auth.php';
$user = require_student(); // Auth check for trainee role
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Trainee Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
<style>
    body { font-family: 'Roboto', sans-serif; background:#f4f6f8; margin:0; }
    .container { max-width: 1000px; margin:auto; padding:2rem; }
    .card { background:#fff; padding:1.5rem; border-radius:12px; box-shadow:0 3px 10px rgba(0,0,0,0.08); margin-bottom:2rem; }
    .profile { display:flex; gap:2rem; align-items:center; }
    .profile img { width:120px; height:160px; object-fit:cover; border-radius:6px; border:2px solid #0077b6; }
    h2, h3 { margin:0 0 .5rem; color:#0077b6; }
    .label { font-weight:bold; }
    .progress-bar { height:12px; background:#ddd; border-radius:6px; overflow:hidden; margin-top:.5rem; }
    .progress-bar span { display:block; height:100%; background:#0077b6; }
    table { width:100%; border-collapse:collapse; margin-top:1rem; }
    th, td { padding:.6rem; border-bottom:1px solid #ccc; text-align:left; }
    th { background:#0077b6; color:#fff; }
    .download-link { display:inline-block; margin-top:.3rem; padding:.4rem .8rem; background:#0077b6; color:#fff; text-decoration:none; border-radius:4px; }
</style>
</head>
<body>
<div class="container">

    <!-- Profile Section -->
    <div class="card profile">
        <img src="../uploads/photos/<?= htmlspecialchars($user['army_no']) ?>.jpg" alt="Profile Photo"
             onerror="this.src='../assets/default_avatar.png'">
        <div>
            <h2><?= htmlspecialchars($user['name']) ?></h2>
            <p><span class="label">S No:</span> <?= htmlspecialchars($user['s_no']) ?></p>
            <p><span class="label">Army No:</span> <?= htmlspecialchars($user['army_no']) ?></p>
            <p><span class="label">Rank:</span> <?= htmlspecialchars($user['rank']) ?></p>
            <p><span class="label">Unit:</span> <?= htmlspecialchars($user['unit'] ?? 'N/A') ?></p>
        </div>
    </div>

    <!-- Current Course Section -->
    <div class="card" id="current-course">
        <h3>📘 Current Course</h3>
        <p><span class="label">Course:</span> <span id="course-title"></span></p>
        <p><span class="label">Duration:</span> <span id="course-start"></span> to <span id="course-end"></span> (<span id="course-duration"></span> days)</p>
        <div class="progress-bar"><span id="progress-bar" style="width:0%"></span></div>
        <p><span id="progress-text">0%</span> complete</p>
    </div>

    <!-- Marks Section -->
    <div class="card" id="marks">
        <h3>📝 Previous Marks</h3>
        <table>
            <thead>
                <tr>
                    <th>Course</th><th>Test</th><th>Date</th><th>Obtained</th><th>Max</th><th>%</th><th>Result</th>
                </tr>
            </thead>
            <tbody id="marks-body"></tbody>
        </table>
    </div>

    <!-- Materials Section -->
    <div class="card" id="materials">
        <h3>📂 Course Materials</h3>
        <ul id="materials-list"></ul>
    </div>

</div>

<script>
async function loadCourse(){
    const res = await fetch('../api/current_course.php');
    const course = await res.json();
    document.getElementById('course-title').textContent = `${course.course_title} (${course.course_code})`;
    document.getElementById('course-start').textContent = course.start_date;
    document.getElementById('course-end').textContent = course.end_date;
    document.getElementById('course-duration').textContent = course.duration_days;
    document.getElementById('progress-bar').style.width = course.completion_percent + '%';
    document.getElementById('progress-text').textContent = course.completion_percent + '%';
}
async function loadMarks(){
    const res = await fetch('../api/marks.php');
    const data = await res.json();
    const tbody = document.getElementById('marks-body'); tbody.innerHTML='';
    data.forEach(r=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.course_title}</td><td>${r.test_title}</td><td>${r.test_date}</td>
                        <td>${r.obtained_marks}</td><td>${r.max_marks}</td><td>${r.percentage}</td><td>${r.result}</td>`;
        tbody.appendChild(tr);
    });
}
async function loadMaterials(){
    const res = await fetch('../api/materials.php');
    const data = await res.json();
    const list = document.getElementById('materials-list'); list.innerHTML='';
    data.forEach(r=>{
        const li = document.createElement('li');
        li.innerHTML = `<strong>${r.course_title}</strong>: ${r.material_title}
                        <a class="download-link" href="../api/download.php?id=${r.material_id}">Download</a>`;
        list.appendChild(li);
    });
}
loadCourse(); loadMarks(); loadMaterials();
</script>
</body>
</html>
