const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Created uploads directory");
}

// cors allow all origins
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(uploadsDir));

// DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/training", require("./routes/trainingRoutes"));
app.use("/api/calendar", require("./routes/calendarRoutes"));
app.use("/api/courses", require("./routes/coursesRoutes"));
app.use("/api/materials", require("./routes/materialRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));

const PORT = process.env.PORT || 5001;
console.log(PORT);
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
