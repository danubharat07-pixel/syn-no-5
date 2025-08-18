-- 1) Core reference
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  s_no INT NOT NULL,
  army_no VARCHAR(32) NOT NULL UNIQUE,
  rank VARCHAR(32) NOT NULL,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(128) UNIQUE,
  unit VARCHAR(128),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','instructor','admin','superadmin') NOT NULL DEFAULT 'student',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_students_identity ON students (s_no, army_no, rank, name);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(32) NOT NULL UNIQUE,
  title VARCHAR(128) NOT NULL,
  description TEXT,
  status ENUM('active','archived') DEFAULT 'active'
);

CREATE TABLE course_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_on DATE NOT NULL,
  status ENUM('enrolled','completed','dropped') DEFAULT 'enrolled',
  UNIQUE KEY uq_enroll (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 2) Materials
CREATE TABLE materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(128) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(64),
  size_bytes INT,
  visibility ENUM('enrolled','public','hidden') DEFAULT 'enrolled',
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 3) Tests and marks
CREATE TABLE tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(128) NOT NULL,
  max_marks INT NOT NULL,
  pass_marks INT NOT NULL,
  test_date DATE NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE test_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT NOT NULL,
  student_id INT NOT NULL,
  obtained_marks INT NOT NULL,
  remarks VARCHAR(255),
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES tests(id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  UNIQUE KEY uq_attempt (test_id, student_id)
);

-- 4) Explicit progress (or compute via views)
CREATE TABLE student_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  completion_percent TINYINT NOT NULL DEFAULT 0, -- 0-100
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_progress (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 5) Suggestions
CREATE TABLE suggestions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  category VARCHAR(64) NOT NULL, -- e.g., 'Remedial', 'Upcoming', 'Material'
  suggestion_text VARCHAR(255) NOT NULL,
  source VARCHAR(32) NOT NULL DEFAULT 'system', -- 'system' | 'instructor'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_flag TINYINT(1) DEFAULT 0,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 6) Audit logs
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  action VARCHAR(64) NOT NULL, -- 'login','download','view_marks','export_csv'
  details VARCHAR(255),
  ip_addr VARCHAR(64),
  user_agent VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_student_time (student_id, created_at)
);
CREATE OR REPLACE VIEW v_student_marks AS
SELECT
  s.s_no AS s_no,
  s.army_no AS army_no,
  s.rank AS rank,
  s.name AS name,
  c.code AS course_code,
  c.title AS course_title,
  ts.title AS test_title,
  ts.test_date AS test_date,
  ts.max_marks AS max_marks,
  ts.pass_marks AS pass_marks,
  ta.obtained_marks AS obtained_marks,
  ROUND(100.0 * ta.obtained_marks / ts.max_marks, 2) AS percentage,
  CASE WHEN ta.obtained_marks >= ts.pass_marks THEN 'Pass' ELSE 'Fail' END AS result,
  ta.remarks AS remarks,
  ta.attempted_at AS attempted_at,
  ta.student_id AS student_id
FROM test_attempts ta
JOIN students s ON s.id = ta.student_id
JOIN tests ts ON ts.id = ta.test_id
JOIN courses c ON c.id = ts.course_id;

CREATE OR REPLACE VIEW v_student_progress AS
SELECT
  st.s_no AS s_no,
  st.army_no AS army_no,
  st.rank AS rank,
  st.name AS name,
  c.code AS course_code,
  c.title AS course_title,
  COALESCE(sp.completion_percent, 0) AS completion_percent,
  sp.last_updated AS last_updated,
  st.id AS student_id
FROM students st
JOIN course_enrollments ce ON ce.student_id = st.id
JOIN courses c ON c.id = ce.course_id
LEFT JOIN student_progress sp ON sp.student_id = st.id AND sp.course_id = c.id;
