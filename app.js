const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoUrl = "mongodb+srv://civvip06112003:admin@cluster0.abt0i0s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "djkhfsjdfsl73453jkf()hdufsdfngsdfg89ergnfvdcn\[\]\[\]hdafbdf";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

require('./UserDetails');
const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res.send({ data: "User already exists" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email });

  if (!oldUser) {
    return res.send({ error: "User doesn't exist" });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    return res.send({ status: "ok", data: token });
  } else {
    return res.send({ error: "error" });
  }
});

app.post("/userdata", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    User.findOne({ email: useremail }).then((data) => {
      return res.send({ status: "Ok", data: data });
    });
  } catch (error) {
    return res.send({ error: error });
  }
});

app.post("/update-user", async (req, res) => {
  const { firstName, lastName, email, image, gender, profession, mobile, name } = req.body;
  console.log(req.body);
  try {
    const updatedUser = await User.updateOne(
      { email },
      { $set: { firstName, lastName, image, gender, profession, mobile, name } },
      { new: true }
    );
    res.send({ status: "Ok", data: updatedUser });
  } catch (error) {
    return res.send({ error: error });
  }
});

app.listen(5001, () => {
  console.log("Node.js server started");
});