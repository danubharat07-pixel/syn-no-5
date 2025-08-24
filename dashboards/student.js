async function getStudentData() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const res = await fetch("http://localhost:5001/api/users/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = await res.json();
    if (data.profileImage) {
      const profilePic = document.getElementById("profile-pic");
      profilePic.src = `http://localhost:5001/${data.profileImage}`;
    }
    const bioDataTable = document.getElementById("bioDataTable");
    bioDataTable.innerHTML = `
      <tr>
        <th>Army No</th>
        <td>${data.army_no}</td>
      </tr>
      <tr>
        <th>Rank</th>
        <td>${data.rank}</td>
      </tr>
      <tr>
        <th>Name</th>
        <td>${data.name}</td>
      </tr>
      <tr>
        <th>Course</th>
        <td>${data.course.courseName}</td>
      </tr>
      <tr>
        <th>Duration</th>
        <td>${data.course.durationWeeks} weeks</td>
      </tr>
    `;
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
}

async function updateProfileImage(event) {
  event.preventDefault();
  const statusDiv = document.getElementById("upload-status");

  try {
    statusDiv.textContent = "Uploading...";
    statusDiv.style.color = "#666";

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const form = document.getElementById("profile-pic-form");
    const formData = new FormData(form);
    const res = await fetch("http://localhost:5001/api/users/profile-image", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status}`);
    }

    const { data } = await res.json();
    console.log(data);

    // Update the profile picture immediately
    // if (data.profileImage) {
    //   const profilePic = document.getElementById("profile-pic");
    //   profilePic.src = `http://localhost:5001/${data.profileImage}`;
    // }

    // Show success message
    statusDiv.textContent = "Profile picture updated successfully!";
    statusDiv.style.color = "#51cf66";

    // Clear the status message after 3 seconds
    setTimeout(() => {
      statusDiv.textContent = "";
    }, 3000);
  } catch (error) {
    console.error("Error updating profile image:", error);
    statusDiv.textContent = "Upload failed. Please try again.";
    statusDiv.style.color = "#ff6b6b";

    // Clear error message after 5 seconds
    setTimeout(() => {
      statusDiv.textContent = "";
    }, 5000);
  }
}

async function getMaterials() {
  try {
    const res = await fetch(
      "http://localhost:5001/api/materials?forRole=Student"
    );
    const { data } = await res.json();
    console.log(data);
    const materialList = document.getElementById("materialList");
    materialList.innerHTML = "";
    data.forEach((material) => {
      const materialCard = document.createElement("div");
      materialCard.className = "material-card";
      materialCard.innerHTML = `
        <h3>Title: ${material.title}</h3>
        <p>Description: ${material.description}</p>
        <p>Type: ${material.type}</p>
        <p>Course: ${material.course?.courseName || "N/A"}</p>
        <a href="http://localhost:5001/${
          material.link
        }" target="_blank">View</a>
      `;
      materialList.appendChild(materialCard);
    });
  } catch (err) {
    console.log(err);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}

// Function to submit feedback
async function submitFeedback(event) {
  event.preventDefault();
  
  const feedbackStatus = document.getElementById("feedback-status");
  
  try {
    feedbackStatus.textContent = "Submitting feedback...";
    feedbackStatus.style.color = "#666";
    
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    
    const formData = new FormData(event.target);
    const feedbackData = {
      forRole: formData.get("forRole"),
      feedback: formData.get("feedback"),
      howToImprove: formData.get("howToImprove"),
      rating: parseInt(formData.get("rating")),
      isAnonymous: formData.get("isAnonymous") === "on"
    };
    
    const res = await fetch("http://localhost:5001/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(feedbackData),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Submission failed: ${res.status}`);
    }
    
    const { data } = await res.json();
    console.log("Feedback submitted:", data);
    
    // Show success message
    feedbackStatus.textContent = "Feedback submitted successfully!";
    feedbackStatus.style.color = "#51cf66";
    
    // Reset form
    event.target.reset();
    
    // Refresh the feedback list to show the new feedback
    loadMyFeedback();
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      feedbackStatus.textContent = "";
    }, 3000);
    
  } catch (error) {
    console.error("Error submitting feedback:", error);
    feedbackStatus.textContent = `Submission failed: ${error.message}`;
    feedbackStatus.style.color = "#ff6b6b";
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      feedbackStatus.textContent = "";
    }, 5000);
  }
}

// Function to load user's own feedback
async function loadMyFeedback() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch("http://localhost:5001/api/feedback/my-feedback", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load feedback: ${response.status}`);
    }

    const { data: feedbacks } = await response.json();
    displayMyFeedback(feedbacks);

  } catch (error) {
    console.error("Error loading feedback:", error);
    const feedbackList = document.getElementById("my-feedback-list");
    feedbackList.innerHTML = `<p class="no-feedback">Error loading feedback: ${error.message}</p>`;
  }
}

// Function to display user's feedback
function displayMyFeedback(feedbacks) {
  const feedbackList = document.getElementById("my-feedback-list");
  
  if (feedbacks.length === 0) {
    feedbackList.innerHTML = '<p class="no-feedback">You haven\'t submitted any feedback yet.</p>';
    return;
  }

  feedbackList.innerHTML = feedbacks.map(feedback => {
    const date = new Date(feedback.createdAt).toLocaleDateString();
    const rating = "⭐".repeat(feedback.rating);
    
    return `
      <div class="feedback-item">
        <div class="feedback-header">
          <div class="feedback-rating">${rating} ${feedback.rating}/5</div>
          <div class="feedback-date">${date}</div>
        </div>
        <div class="feedback-content">
          <h4>For: ${feedback.forRole}</h4>
          <h4>Feedback:</h4>
          <p>${feedback.feedback}</p>
          <h4>How to Improve:</h4>
          <p>${feedback.howToImprove}</p>
          ${feedback.isAnonymous ? '<p><small><em>Submitted anonymously</em></small></p>' : ''}
        </div>
        <div class="feedback-actions">
          <button class="btn-delete" onclick="deleteFeedback('${feedback._id}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

// Function to delete feedback
async function deleteFeedback(feedbackId) {
  if (!confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`http://localhost:5001/api/feedback/${feedbackId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Delete failed: ${response.status}`);
    }

    // Show success message
    alert("Feedback deleted successfully!");
    
    // Reload feedback list
    loadMyFeedback();

  } catch (error) {
    console.error("Error deleting feedback:", error);
    alert(`Failed to delete feedback: ${error.message}`);
  }
}

getStudentData();
getMaterials();
loadMyFeedback();
