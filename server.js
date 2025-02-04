const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = 3000;
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema and model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from MongoDB
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST a new user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = new User({
      name,
      email,
    });
    await newUser.save(); // Save the new user to MongoDB
    res.status(201).json(newUser); // Respond with the created user
  } catch (err) {
    res.status(400).json({ error: "Failed to create user" });
  }
});

// PUT (update) a user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    // Attempt to find and update the user by ID
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true } // Ensure the updated user is returned
    );

    // If no user is found, return a 404 error
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser); // Return the updated user
  } catch (err) {
    res.status(400).json({ error: "Failed to update user" });
  }
});

// DELETE a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Failed to delete user" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
