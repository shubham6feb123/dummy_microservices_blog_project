const express = require("express");
const app = express();
const { json } = require("body-parser");
const axios = require("axios");

app.use(json());

const handleModeration = async (type, data) => {
  if (type == "commentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://localhost:4005/events", {
      type: "commentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }
};

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  // console.log("type", type);
  console.log(type, "---->", data);

  await handleModeration(type, data);

  res.send({});
});

app.listen(4003, async () => {
  console.log("listening on port 4003");

  const res = await axios.get("http://localhost:4005/events");

  for (let event of res.data) {
    console.log(`processing event in moderation ${event.type}`);
    handleModeration(event.type, event.data);
  }
});
