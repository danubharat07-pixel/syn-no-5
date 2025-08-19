// seedCourses.js
const mongoose = require("mongoose");
const Course = require("../models/Course"); // Adjust path if needed
require("dotenv").config();
const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const sampleCourses = [
      {
        courseName: "Sec Cdr",
        durationWeeks: 16,
        qualitativeRequirement: {
          minServiceYears: 8,
          age: { min: 26, max: 35 },
          civEdn: "Graduate or equivalent",
          milEdn: "MR II",
          punishments: "No major punishments in last 2 years",
        },
      },
      {
        courseName: "ITCA",
        durationWeeks: 4,
        qualitativeRequirement: {
          minServiceYears: 3,
          age: { min: 22, max: 38 },
          civEdn: "10+2 with IT background (optional)",
          milEdn: "MR III and above",
          punishments: "None",
        },
      },
      {
        courseName: "MMG Course",
        durationWeeks: 10,
        qualitativeRequirement: {
          minServiceYears: 4,
          age: { min: 25, max: 40 },
          civEdn: "Graduate in any discipline",
          milEdn: "MR II ",
          punishments: "No disciplinary actions in last 3 years",
        },
      },
    ];

    await Course.deleteMany({});
    const result = await Course.insertMany(sampleCourses);

    console.log(`✅ Seeded ${result.length} courses successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding courses:", err);
    process.exit(1);
  }
};

seedCourses();
