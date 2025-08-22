const mongoose = require("mongoose");

const stickySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["CO", "TrgJCO"],
      default: "CO",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Sticky = mongoose.model("Sticky", stickySchema);

module.exports = Sticky;
