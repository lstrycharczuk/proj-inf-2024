const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  auth: {
    type: String,
  },
});

const Users = mongoose.model("Users", UserSchema);
const usersRouter = express.Router();

const path = "/users";

usersRouter.get(path, async (req, resp) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = Math.max(0, parseInt(req.query.page) || 0);

  try {
    const users = await Users.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec();
    const count = await Users.countDocuments().exec();

    resp.json({
      users,
      page: page,
      totalPages: Math.ceil(count / perPage),
    });
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
});

usersRouter.post(path, async (req, resp) => {
  const user = new Users({
    email: req.body.email,
    password: req.body.password,
    auth: req.body.auth,
  });
  try {
    const newUser = await user.save();
    resp.status(201).json(newUser);
  } catch (err) {
    resp.status(400).json({ message: err.message });
  }
});

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

usersRouter.put(`${path}/:id`, async (req, res) => {
  try {
    const updateData = req.body;
    const user = await Users.findByIdAndUpdate(req.params.id, updateData);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await movie.save();
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

module.exports = usersRouter;
