const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRouter = require("./models/user");
const mailRouter = require("./mail")
const port = process.env.PORT || 3000;
require("dotenv").config();



const connectToDatabase = () => {
  const mongoose = require("mongoose");
  mongoose.connect(process.env.MONGO_DB);
};
connectToDatabase();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", usersRouter);





app.get("/", (req, resp) => {
  resp.send(
    `backend is running on http://localhost:${port}/api/users and connected to database`
  );
});

app.use("/api/sendCodeMail", mailRouter)

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

