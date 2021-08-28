const mongoose = require("mongoose");
const express = require("express");
const app = express();
const user = require(__dirname + "/models/User.js");
require("dotenv").config({ path: __dirname + "/config/.env" });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const defaultUsers = [
  {
    username: "ChuckyNorry",
    email: "dontudare@gmail.com",
  },
  { username: "VergilYamato", email: "morepower@morepower.com" },
];

// user
//   .create(defaultUsers)
//   .then(() => console.log("users created"))
//   .catch((err) => console.log(err));
app
  .route("/")
  .get((req, res) =>
    user.find({}, (err, data) =>
      err ? res.send(err.toString()) : res.send(data)
    )
  )
  // .post((req, res) => {
  //   const newUser = new user(req.body);
  //   newUser.save((err) =>
  //     err ? res.end("noooo") : res.send("user added successfully")
  //   );
  // })
  .post((req, res) => {
    const newUser = new user(req.body);
    newUser.save((err) =>
      !err ? res.send("user added successfully") : res.end(err.toString())
    );
  })
  .put((req, res) => {
    user.findByIdAndUpdate(req.body._id, req.body, { overwrite: true }, (err) =>
      !err ? res.send("user updated") : res.send(err.toString())
    );
    //put does a total update to the document, if the request doesn't contain an email,
    //the updated user won't have an email entry -- this is assured with the overwrite option set to true
  })
  .delete((req, res) => {
    user.findByIdAndDelete(req.body._id, (err) =>
      !err ? res.send("user deleted") : res.send(err.toString())
    );
  });
app.listen(3000, () => console.log("server is running on port 3000"));
