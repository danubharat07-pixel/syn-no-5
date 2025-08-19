// scripts/seedUsers.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // ← adjust path if your model lives elsewhere

async function seedUsers() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✔️  Connected to MongoDB");
    // 2. Clear out existing users
    await User.deleteMany({});
    console.log("🗑  Cleared existing users");

    // 3. Define raw users
    const rawUsers = [
      {
        army_no: "ARMY001",
        rank: "Colonel",
        name: "Alice Smith",
        role: "CO",
        password: "Pass123!",
      },
      {
        army_no: "ARMY002",
        rank: "Major",
        name: "Bob Johnson",
        role: "TrgOffr",
        password: "Pass123!",
      },
      {
        army_no: "ARMY003",
        rank: "Sergeant",
        name: "Charlie Brown",
        role: "TrgJCO",
        password: "Pass123!",
      },
      {
        army_no: "ARMY004",
        rank: "Lieutenant",
        name: "Diana Prince",
        role: "Student",
        password: "Pass123!",
      },
    ];

    // 4. Hash passwords and prepare docs
    const users = [];
    for (const u of rawUsers) {
      const hash = await bcrypt.hash(u.password, 10);
      users.push({ ...u, password: hash });
    }

    // 5. Insert into DB
    await User.insertMany(users);
    console.log("✅  Seeded 4 users with distinct roles");

    process.exit(0);
  } catch (err) {
    console.error("❌  Seeding error:", err);
    process.exit(1);
  }
}

// Run the seeder
seedUsers();
