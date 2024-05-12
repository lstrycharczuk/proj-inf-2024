const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRouter = require("./models/user");
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
    `tu kiedys byedzie backend apki na inf`
  );
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
