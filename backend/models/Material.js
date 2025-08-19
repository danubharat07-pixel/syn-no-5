const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    type: {
      type: String,
      enum: ["planning", "report", "study"],
      required: true,
    },
    forRole: {
      type: [
        {
          type: String,
          enum: ["CO", "TrgOffr", "TrgJCO", "Student"],
        },
      ],
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Material", MaterialSchema);
