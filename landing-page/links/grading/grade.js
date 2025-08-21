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
      ${user.event ? user.event : "N/A"}
      </td>
      <td>
      ${user.result ? user.result : "N/A"}
      </td>
      <td>
      ${user.remarks ? user.remarks : "N/A"}
      </td>
      </tr>`;
    });
  } catch (err) {
    console.log(err);
  }
}
getUsersWithCourse();
