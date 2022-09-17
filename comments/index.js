const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentBypostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentBypostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  try {
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;
    let comments = commentBypostId[req.params.id] || [];

    comments.push({ id: commentId, content, status: "pending" });

    commentBypostId[req.params.id] = comments;

    await axios.post("http://localhost:4005/events", {
      type: "commentCreated",
      data: {
        id: commentId, //comment id
        content,
        postId: req.params.id,
        status: "pending",
      },
    });

    res.status(201).send(commentBypostId[req.params.id]);
  } catch (error) {
    console.log(`failed to create comment ${error}`);
  }
});

app.post("/events", async (req, res) => {
  try {
    console.log("Received event", req.body.type);

    const { type, data } = req.body;

    if (type === "commentModerated") {
      const { id, postId, status, content } = data;

      const comments = commentBypostId[postId];

      const comment = comments.find((comment) => {
        return comment.id === id;
      });

      comment.status = status;

      await axios.post("http://localhost:4005/events", {
        type: "commentUpdated",
        data: {
          id,
          status,
          postId,
          content,
        },
      });
    }

    res.send({ status: "OK" });
  } catch (error) {
    console.log("error in events", error);
  }
});

app.listen(4001, () => console.log("listening on port 4001"));
