const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  auth: {
    type: String,
  },
});

const Users = mongoose.model("Users", UserSchema);
const usersRouter = express.Router();

const path = "/users";

usersRouter.get("/users", async (req, res) => {
  try {
    const { email } = req.query;
    if (email) {
      const user = await Users.findOne({ email });
      if (user) {
        return res.json(user);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      const users = await Users.find();
      res.json(users);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


usersRouter.post("/users", async (req, res) => {
  const { email, password, auth } = req.body;

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      if (existingUser.password === password) {
        return res.status(200).json(existingUser);
      } else {
        return res.status(400).json({ message: "User already exists with a different password." });
      }
    }

    const user = new Users({ email, password, auth });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

usersRouter.get("/users/latestCode", async (req, res) => {
  try {
    const latestUser = await Users.findOne().sort({ _id: -1 });
    res.json({ code: latestUser.auth });
  } catch (error) {
    console.error("Error fetching latest code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


usersRouter.delete(path, async(req, resp) => {
  try {
    await Users.deleteMany();
    resp.json({ message: "All users deleted" });
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
})

usersRouter.get(`${path}/:id`, async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Define a route to save the code for a user
usersRouter.post(`${path}/:id/code`, async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;
    
    // Update the user's code in the database
    const user = await Users.findByIdAndUpdate(id, { code }, { new: true });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


usersRouter.put(`${path}/:id`, async (req, res) => {
  try {
    const updateData = req.body;
    const user = await Users.findByIdAndUpdate(req.params.id, updateData);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

usersRouter.delete(`${path}/:id`, async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Nowy endpoint na serwerze (na przykład w pliku api.js)
usersRouter.get(`${path}/latestCode`, async (req, res) => {
  try {
    // Zapytanie do bazy danych, aby pobrać ostatnio dodany kod
    const latestCode = await db.query("SELECT auth FROM Users ORDER BY id DESC LIMIT 1");
    res.json({ code: latestCode.rows[0].code });
  } catch (error) {
    console.error("Error fetching latest code from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = usersRouter;
