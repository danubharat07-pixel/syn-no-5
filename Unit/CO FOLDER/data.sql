CREATE OR REPLACE VIEW v_card_precourses AS
SELECT 
  ROW_NUMBER() OVER (PARTITION BY c.syndicate_id ORDER BY c.title) AS s_no,
  u.service_no AS army_no,
  r.code AS rank,
  CONCAT(u.first_name, ' ', u.last_name) AS name,
  c.syndicate_id,
  COUNT(*) AS precourses_count
FROM courses c
JOIN enrollments e ON e.course_id = c.id
JOIN users u ON u.id = e.user_id
JOIN ranks r ON r.id = u.rank_id
WHERE c.category = 'Pre-Course'
GROUP BY c.syndicate_id, u.service_no, r.code, u.first_name, u.last_name;

CREATE OR REPLACE VIEW v_card_progress AS
SELECT 
  ROW_NUMBER() OVER (PARTITION BY u.syndicate_id ORDER BY u.last_name) AS s_no,
  u.service_no AS army_no,
  r.code AS rank,
  CONCAT(u.first_name, ' ', u.last_name) AS name,
  u.syndicate_id,
  AVG(p.percentage) AS avg_progress
FROM users u
JOIN ranks r ON r.id = u.rank_id
JOIN (
  SELECT p1.user_id, p1.percentage
  FROM progress p1
  JOIN (
    SELECT user_id, course_id, MAX(as_of_date) AS max_date
    FROM progress
    GROUP BY user_id, course_id
  ) latest ON latest.user_id = p1.user_id
          AND latest.course_id = p1.course_id
          AND latest.max_date = p1.as_of_date
) p ON p.user_id = u.id
WHERE u.status = 'active'
GROUP BY u.syndicate_id, u.service_no, r.code, u.first_name, u.last_name;


CREATE OR REPLACE VIEW v_card_attendance AS
SELECT 
  ROW_NUMBER() OVER (PARTITION BY u.syndicate_id ORDER BY u.last_name) AS s_no,
  u.service_no AS army_no,
  r.code AS rank,
  CONCAT(u.first_name, ' ', u.last_name) AS name,
  u.syndicate_id,
  (SUM(CASE WHEN a.status IN ('present','late','excused') THEN 1 ELSE 0 END)
/ NULLIF(COUNT(*),0)) * 100 AS attendance_rate
FROM attendance a
JOIN users u ON u.id = a.user_id
JOIN ranks r ON r.id = u.rank_id
WHERE a.session_date >= CURDATE() - INTERVAL 30 DAY
GROUP BY u.syndicate_id, u.service_no, r.code, u.first_name, u.last_name;



CREATE OR REPLACE VIEW v_card_alerts AS
SELECT 
  ROW_NUMBER() OVER (PARTITION BY synd_id ORDER BY al.created_at DESC) AS s_no,
  ident.army_no,
  ident.rank,
  ident.name,
  synd_id AS syndicate_id,
  COUNT(*) AS unread_alerts
FROM alerts al
JOIN (
    SELECT u.id AS user_id, u.syndicate_id AS synd_id,
           u.service_no AS army_no, r.code AS rank,
           CONCAT(u.first_name, ' ', u.last_name) AS name
    FROM users u
    JOIN ranks r ON r.id = u.rank_id
) ident ON ident.user_id = al.user_id
WHERE al.is_read = 0
GROUP BY synd_id, ident.army_no, ident.rank, ident.name;



CREATE OR REPLACE VIEW v_feedback_table AS
SELECT 
  ROW_NUMBER() OVER (PARTITION BY u.syndicate_id ORDER BY f.created_at DESC) AS s
  
  
  _no,
  u.service_no AS army_no,
  r.code AS rank,
  CONCAT(u.first_name, ' ', u.last_name) AS name,
  c.title AS course,
  f.rating,
  f.comments,
  f.created_at,
  u.syndicate_id
FROM feedback f
JOIN users u ON u.id = f.trainee_id
JOIN ranks r ON r.id = u.rank_id
JOIN courses c ON c.id = f.course_id;


CREATE OR REPLACE VIEW v_events_table AS
SELECT
  ROW_NUMBER() OVER (PARTITION BY e.syndicate_id ORDER BY e.event_date) AS s_no,
  u.service_no AS army_no,
  r.code AS rank,
  CONCAT(u.first_name, ' ', u.last_name) AS name,
  e.title AS event,
  e.event_date AS date,
  e.location,
  e.status,
  e.syndicate_id
FROM events e
JOIN courses c ON c.id = e.course_id
JOIN enrollments en ON en.course_id = c.id
JOIN users u ON u.id = en.user_id
JOIN ranks r ON r.id = u.rank_id;



CREATE OR REPLACE VIEW v_progress_trend AS
SELECT 
  ROW_NUMBER() OVER (PARTITION BY u.syndicate_id ORDER BY p.as_of_date) AS s_no,
  u.service_no AS army_no,
  r.code AS rank,
  CONCAT(u.first_name, ' ', u.last_name) AS name,
  u.syndicate_id,
  p.as_of_date,
  p.percentage
FROM progress p
JOIN users u ON u.id = p.user_id
JOIN ranks r ON r.id = u.rank_id;



CREATE OR REPLACE VIEW v_attendance_trend AS
SELECT 
  ROW_NUMBER() OVER (PARTITION BY u.syndicate_id ORDER BY a.session_date) AS s_no,
  u.service_no AS army_no,
  r.code AS rank,
  CONCAT(u.first_name, ' ', u.last_name) AS name,
  u.syndicate_id,
  a.session_date,
  (CASE WHEN COUNT(*) > 0 
        THEN (SUM(CASE WHEN a.status IN ('present','late','excused') THEN 1 ELSE 0 END)/COUNT(*))*100 
        ELSE 0 END) AS attendance_rate
FROM attendance a
JOIN users u ON u.id = a.user_id
JOIN ranks r ON r.id = u.rank_id
GROUP BY u.syndicate_id, a.session_date, u.service_no, r.coCREATE OR REPLACE VIEW v_trg_calendar AS
SELECT 
  ROW_NUMBER() OVER (PARTITION BY tc.syndicate_id ORDER BY tc.start_datetime) AS s_no,
  u.service_no AS army_no,
  r.code AS rank,
  CONCAT(u.first_name, ' ', u.last_name) AS name,
  tc.title,
  tc.event_type,
  tc.start_datetime,
  tc.end_datetime,
  tc.location,
  tc.notes,
  tc.syndicate_id
FROM trg_calendar tc
JOIN users u ON u.syndicate_id = tc.syndicate_id
JOIN ranks r ON r.id = u.rank_id;
de, u.first_name, u.last_name;



CREATE OR REPLACE VIEW v_trg_calendar AS
SELECT 
  ROW_NUMBER() OVER (PARTITION BY tc.syndicate_id ORDER BY tc.start_datetime) AS s_no,
  u.service_no AS army_no,
  r.code AS rank,
  CONCAT(u.first_name, ' ', u.last_name) AS name,
  tc.title,
  tc.event_type,
  tc.start_datetime,
  tc.end_datetime,
  tc.location,
  tc.notes,
  tc.syndicate_id
FROM trg_calendar tc
JOIN users u ON u.syndicate_id = tc.syndicate_id
JOIN ranks r ON r.id = u.rank_id;



