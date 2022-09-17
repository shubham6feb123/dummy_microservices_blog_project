const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

let posts = {};

const handleEvents = (type, data) => {
  try {
    if (type === "postCreated") {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
    }

    if (type === "commentCreated") {
      const { id, content, postId, status } = data;
      let post = posts[postId];
      post.comments.push({ id, content, status });
    }

    if (type === "commentUpdated") {
      const { id, content, postId, status } = data;

      console.log("data---->", data);

      const post = posts[postId];

      let comment = post?.comments?.find((comment) => {
        return comment.id === id;
      });

      comment.status = status;
      comment.content = content;
    }
  } catch (error) {
    console.log(`error in handle events ${error}`);
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  try {
    const { type, data } = req.body;

    handleEvents(type, data);

    res.send({ status: "OK" });
  } catch (error) {
    console.log(`error in query ${error}`);
  }
});

app.listen(4002, async () => {
  console.log("listening on port 4002");

  const res = await axios.get("http://localhost:4005/events");

  for (let event of res.data) {
    console.log(`processing event ${event.type}`);
    handleEvents(event.type, event.data);
  }
});
