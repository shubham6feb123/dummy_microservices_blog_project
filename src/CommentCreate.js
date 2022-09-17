import axios from "axios";
import React, { useState } from "react";

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState("");
  const [commentsLength, setCommentsLength] = useState(0);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `http://localhost:4001/posts/${postId}/comments`,
      {
        content,
      }
    );
    setCommentsLength(res.data.length);
    setContent("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">
            Comment
          </label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(() => e.target.value)}
            className="form-control"
            id="comment"
            placeholder="Comment Here"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentCreate;
