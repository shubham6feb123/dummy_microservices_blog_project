const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  try {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;
    console.log(title);
    posts[id] = { id, title };

    await axios.post("http://localhost:4005/events", {
      type: "postCreated",
      data: { id, title },
    });

    res.status(201).send(posts[id]);
  } catch (error) {
    console.log(`failed to create post ${error}`);
  }
});

app.post("/events", (req, res) => {
  try {
    console.log("Received event", req.body.type);
    res.send({ status: "OK" });
  } catch (error) {
    console.log("error in events", error);
  }
});

app.listen(4000, () => {
  console.log("v5")
  console.log("listening on port 4000")
})
