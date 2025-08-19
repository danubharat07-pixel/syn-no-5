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
        <a href="http://localhost:5001/${material.link}" target="_blank">View</a>
      `;
      materialSelect.appendChild(materialCard);
    });
  } catch (err) {
    console.log(err);
  }
}

getBPETSummary();
getUsers();
getUsersWithCourse();
getAllCourses();
getMaterials();
