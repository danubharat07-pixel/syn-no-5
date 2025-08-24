// models/Course.js
const mongoose = require("mongoose");

const QualitativeRequirementSchema = new mongoose.Schema({
  minServiceYears: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "minServiceYears must be an integer",
    },
  },
  age: {
    min: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "age.min must be an integer",
      },
    },
    max: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "age.max must be an integer",
      },
    },
  },
  civEdn: { type: String, required: true, trim: true }, // e.g., "Graduate or equivalent"
  milEdn: { type: String, required: true, trim: true }, // e.g., "YO Course completed"
  punishments: {
    type: String,
    trim: true,
    default: "None", // e.g., "No major punishments in last 2 years"
  },
});

// Ensure age.max >= age.min
QualitativeRequirementSchema.pre("validate", function (next) {
  if (this.age && this.age.max < this.age.min) {
    return next(new Error("age.max must be greater than or equal to age.min"));
  }
  next();
});

const CourseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true, unique: true, trim: true },
    durationWeeks: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "durationWeeks must be an integer",
      },
    },
    qualitativeRequirement: {
      type: QualitativeRequirementSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CourseSchema.index({ courseName: 1 }, { unique: true });

module.exports = mongoose.model("Course", CourseSchema);
