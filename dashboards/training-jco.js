async function getBPETSummary() {
  try {
    const res = await fetch("http://localhost:5001/api/training/bpet-summary");
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

let courses = [];
async function getAllCourses() {
  try {
    const res = await fetch("http://localhost:5001/api/courses/getAllCourses");
    const { data } = await res.json();
    console.log(data);
    courses = data;
    // update course select with the data
    const courseSelect = document.getElementById("courseSelect");
    courseSelect.innerHTML = "";
    const courseSelectUpload = document.getElementById("courseSelect-upload");
    courseSelectUpload.innerHTML = "";
    [{ _id: "", courseName: "Select Course" }, ...courses].forEach((course) => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = course.courseName;
      courseSelect.appendChild(option);
    });
    [{ _id: "", courseName: "Select Course" }, ...courses].forEach((course) => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = course.courseName;
      courseSelectUpload.appendChild(option);
    });
    const courseSelectPastTracker = document.getElementById(
      "course-select-past-tracker"
    );
    courseSelectPastTracker.innerHTML = "";
    [{ _id: "Other", courseName: "Other courses" }, ...courses].forEach(
      (course) => {
        const option = document.createElement("option");
        option.value = course._id;
        option.textContent = course.courseName;
        courseSelectPastTracker.appendChild(option);
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function assignCourseToUser(event) {
  event.preventDefault();
  const userId = document.getElementById("studentSelect").value;
  const courseId = document.getElementById("courseSelect").value;
  try {
    const res = await fetch(
      `http://localhost:5001/api/users/${userId}/assign-course`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      }
    );
    getUsersWithCourse();
  } catch (err) {
    console.log(err);
  }
}

let students = [];
async function getUsers() {
  try {
    const res = await fetch("http://localhost:5001/api/users/getAllStudents");
    const { data } = await res.json();
    console.log(data);
    students = data;
    // update student select with the data
    const studentSelect = document.getElementById("studentSelect");
    studentSelect.innerHTML = "";
    [{ _id: "", name: "Select Student" }, ...students].forEach((student) => {
      const option = document.createElement("option");
      option.value = student._id;
      option.textContent = student.name;
      studentSelect.appendChild(option);
    });
    const userSelectPastTracker = document.getElementById(
      "user-select-past-tracker"
    );
    userSelectPastTracker.innerHTML = "";
    [{ _id: "", name: "Select Trainee" }, ...students].forEach((student) => {
      const option = document.createElement("option");
      option.value = student._id;
      option.textContent = student.name;
      userSelectPastTracker.appendChild(option);
    });
  } catch (err) {
    console.log(err);
  }
}

async function updateUser(user) {
  console.log(user);
  try {
    const res = await fetch(`http://localhost:5001/api/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    getUsersWithCourse();
  } catch (err) {
    console.log(err);
  }
}

let studentsWithCourse = [];
async function getUsersWithCourse() {
  try {
    const res = await fetch(
      "http://localhost:5001/api/users/getAllStudentsWithCourse"
    );
    const { data } = await res.json();
    console.log(data);
    studentsWithCourse = data;
    // update bpet summary with the data
    const bpetSummary = document.getElementById("bpetSummary");
    bpetSummary.innerHTML = "";
    data.forEach((user, idx) => {
      bpetSummary.innerHTML += `<tr><td>${idx + 1}</td><td>${
        user.army_no
      }</td><td>${user.rank}</td><td>${user.name}</td><td>${
        user.course.courseName
      }</td>
      <td>
      <select onchange='updateUser({_id:"${user._id}", event: this.value})'>
      <option value="bpet" ${
        user.event === "bpet" ? "selected" : ""
      }>BPET</option>
      <option value="ppt" ${user.event === "ppt" ? "selected" : ""}>PPT</option>
      <option value="firing" ${
        user.event === "firing" ? "selected" : ""
      }>Firing</option>
      <option value="written" ${
        user.event === "written" ? "selected" : ""
      }>Written</option></select>
      </td>
      <td>
      <select onchange='updateUser({_id:"${user._id}", result: this.value})'>
      <option value="good" ${
        user.result === "good" ? "selected" : ""
      }>Good</option>
      <option value="excellent" ${
        user.result === "excellent" ? "selected" : ""
      }>Excellent</option>
      <option value="satisfactory" ${
        user.result === "satisfactory" ? "selected" : ""
      }>Satisfactory</option>
      <option value="fail" ${
        user.result === "fail" ? "selected" : ""
      }>Fail</option>
      <option value="a" ${user.result === "a" ? "selected" : ""}>A</option>
      <option value="b" ${user.result === "b" ? "selected" : ""}>B</option>
      <option value="c" ${
        user.result === "c" ? "selected" : ""
      }>C</option></select></td>
      <td><input type="text" onchange='updateUser({_id:"${
        user._id
      }", remarks: this.value})' value="${user.remarks}" /></td></tr>`;
    });
  } catch (err) {
    console.log(err);
  }
}

async function addStudent(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const student = Object.fromEntries(formData);
  try {
    await fetch("http://localhost:5001/api/users/addStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });
    getUsers();
  } catch (err) {
    console.log(err);
  }
}

async function uploadReport(event) {
  event.preventDefault();
  console.log("Form submitted", event.target);

  const formData = new FormData(event.target);

  // Remove course field if empty
  if (!formData.get("course") || formData.get("course").trim() === "") {
    formData.delete("course");
  }

  try {
    const res = await fetch("http://localhost:5001/api/materials", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    console.log("Response:", result);

    if (!res.ok) {
      throw new Error(result.message || "Upload failed");
    }

    alert("Material uploaded successfully!");
    event.target.reset(); // Clear form
    getMaterials(); // Refresh materials list
  } catch (err) {
    console.error("Upload error:", err);
    alert(`Error uploading material: ${err.message}`);
  }
}

async function getMaterials() {
  try {
    const res = await fetch("http://localhost:5001/api/materials");
    const { data } = await res.json();
    console.log(data);
    const materialSelect = document.getElementById("materialSelect");
    materialSelect.innerHTML = "";
    data.forEach((material) => {
      const materialCard = document.createElement("div");
      materialCard.className = "material-card";
      materialCard.innerHTML = `
        <h3>Title: ${material.title}</h3>
        <p>Description: ${material.description}</p>
        <p>Type: ${material.type}</p>
        <p>For Role: ${material.forRole}</p>
        <p>Course: ${material.course?.courseName || "N/A"}</p>
        <a href="http://localhost:5001/${
          material.link
        }" target="_blank">View</a>
      `;
      materialSelect.appendChild(materialCard);
    });
  } catch (err) {
    console.log(err);
  }
}

async function getAttendance() {
  try {
    // Fetch today's attendance records and all students with courses in parallel
    const [attendanceRes, studentsRes] = await Promise.all([
      fetch("http://localhost:5001/api/attendance"),
      fetch("http://localhost:5001/api/users/getAllStudentsWithCourse"),
    ]);

    const attendanceResponse = await attendanceRes.json();
    const studentsResponse = await studentsRes.json();

    console.log("Today's Attendance:", attendanceResponse);
    console.log("All Students:", studentsResponse);

    const attendanceTable = document.getElementById("attendanceTableBody");
    attendanceTable.innerHTML = "";

    const allStudents = studentsResponse.data || [];
    const attendanceRecords = attendanceResponse.attendance || [];

    if (allStudents.length === 0) {
      attendanceTable.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 20px;">
            No students found in the system
          </td>
        </tr>
      `;
      return;
    }

    // Create a map of student attendance records for quick lookup
    const attendanceMap = new Map();
    attendanceRecords.forEach((record) => {
      record.students.forEach((studentAttendance) => {
        attendanceMap.set(studentAttendance.student._id, {
          ...studentAttendance,
          course: record.course,
          date: record.date,
        });
      });
    });

    const today = new Date().toLocaleDateString();

    // Display each student with their attendance status
    allStudents.forEach((student, index) => {
      const attendanceData = attendanceMap.get(student._id);

      if (attendanceData) {
        // Student has attendance record
        const date = new Date(attendanceData.date).toLocaleDateString();
        attendanceTable.innerHTML += `
          <tr class="student-row">
            <td>${date}</td>
            <td>${attendanceData.course.courseName}</td>
            <td>
              <div class="student-attendance-info">
                <div class="student-details">
                  <strong>${student.army_no} - ${student.rank} ${
          student.name
        }</strong>
                </div>
                <div class="attendance-status">
                  <span class="status-badge status-${attendanceData.status.toLowerCase()}">
                    ${attendanceData.status}
                  </span>
                  ${
                    attendanceData.reasonForAbsence !== "-"
                      ? `<div class="reason">Reason: ${attendanceData.reasonForAbsence}</div>`
                      : ""
                  }
                  ${
                    attendanceData.remarks !== "-"
                      ? `<div class="remarks">Remarks: ${attendanceData.remarks}</div>`
                      : ""
                  }
                </div>
              </div>
            </td>
          </tr>
        `;
      } else {
        // Student has no attendance record
        attendanceTable.innerHTML += `
          <tr class="student-row no-attendance">
            <td>${today}</td>
            <td>${student.course?.courseName || "No Course Assigned"}</td>
            <td>
              <div class="student-attendance-info">
                <div class="student-details">
                  <strong>${student.army_no} - ${student.rank} ${
          student.name
        }</strong>
                </div>
                <div class="attendance-status">
                  <span class="status-badge status-not-marked">
                    Not Marked
                  </span>
                  <button class="mark-attendance-btn" onclick="markAttendance('${
                    student._id
                  }', '${student.course?._id || ""}')">
                    Mark Attendance
                  </button>
                </div>
              </div>
            </td>
          </tr>
        `;
      }
    });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    const attendanceTable = document.getElementById("attendanceTableBody");
    attendanceTable.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 20px; color: red;">
          Error loading attendance data: ${err.message}
        </td>
      </tr>
    `;
  }
}

// Function to mark attendance for a student
async function markAttendance(studentId, courseId) {
  if (!courseId) {
    alert("Student must be assigned to a course before marking attendance");
    return;
  }

  const status = prompt(
    "Enter attendance status:\n- Present\n- Absent\n",
    "Present"
  );
  if (!status || !["Present", "Absent"].includes(status)) {
    alert("Invalid status. Please enter: Present or Absent");
    return;
  }

  const reasonForAbsence =
    status !== "Present"
      ? prompt("Enter reason for absence (optional):", "") || "-"
      : "-";
  const remarks = prompt("Enter remarks (optional):", "") || "-";

  try {
    const response = await fetch("http://localhost:5001/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: courseId,
        // takenBy is optional - backend will use system user
        students: [
          {
            student: studentId,
            status: status,
            reasonForAbsence: reasonForAbsence,
            remarks: remarks,
          },
        ],
      }),
    });

    if (response.ok) {
      alert("Attendance marked successfully!");
      getAttendance(); // Refresh the table
    } else {
      const error = await response.json();
      alert(`Error marking attendance: ${error.message}`);
    }
  } catch (err) {
    console.error("Error marking attendance:", err);
    alert("Error marking attendance. Please try again.");
  }
}

// Function to mark attendance for multiple students at once
async function markBulkAttendance() {
  const courseId = prompt(
    "Enter Course ID (you can get this from the course list):"
  );
  if (!courseId) return;

  const session = prompt(
    "Enter session (Morning/Afternoon/Evening/Full Day):",
    "Full Day"
  );
  if (!["Morning", "Afternoon", "Evening", "Full Day"].includes(session)) {
    alert(
      "Invalid session. Please enter: Morning, Afternoon, Evening, or Full Day"
    );
    return;
  }

  // Get students for the course
  try {
    const studentsResponse = await fetch(
      "http://localhost:5001/api/users/getAllStudentsWithCourse"
    );
    const studentsData = await studentsResponse.json();
    const allStudents = studentsData.data || [];

    // Filter students by course
    const courseStudents = allStudents.filter(
      (student) => student.course?._id === courseId
    );

    if (courseStudents.length === 0) {
      alert("No students found for this course.");
      return;
    }

    // Create attendance data for all students (default to Present)
    const studentsAttendance = courseStudents.map((student) => ({
      student: student._id,
      status: "Present",
      reasonForAbsence: "-",
      remarks: "-",
    }));

    const response = await fetch("http://localhost:5001/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: courseId,
        // takenBy is optional - backend will use system user
        session: session,
        students: studentsAttendance,
      }),
    });

    if (response.ok) {
      alert(
        `Bulk attendance marked successfully for ${courseStudents.length} students!`
      );
      getAttendance(); // Refresh the table
    } else {
      const error = await response.json();
      alert(`Error marking bulk attendance: ${error.message}`);
    }
  } catch (err) {
    console.error("Error marking bulk attendance:", err);
    alert("Error marking bulk attendance. Please try again.");
  }
}

async function getStickyNotes() {
  try {
    const res = await fetch("http://localhost:5001/api/sticky?role=TrgJCO", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const { data } = await res.json();

    const stickyNotesTableBody = document.getElementById(
      "sticky-notes-table-body"
    );
    stickyNotesTableBody.innerHTML = "";
    data.forEach((sticky, index) => {
      stickyNotesTableBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${sticky.content}</td>
        <td>${sticky.createdBy.name}</td>
        <td>${new Date(sticky.createdAt).toLocaleDateString()}</td>
      </tr>`;
    });
  } catch (err) {
    console.error("Error getting sticky notes:", err);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}

async function addPastTracker(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const pastTracker = Object.fromEntries(formData);
  console.log(pastTracker);
  try {
    const res = await fetch("http://localhost:5001/api/past-tracker/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(pastTracker),
    });
    event.target.reset();
  } catch (err) {
    console.error("Error adding past tracker:", err);
  }
}

getBPETSummary();
getUsers();
getUsersWithCourse();
getAllCourses();
getMaterials();
getAttendance();
getStickyNotes();
