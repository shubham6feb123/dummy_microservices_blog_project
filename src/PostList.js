import axios from "axios";
import React, { useEffect, useState } from "react";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
  const [post, setPost] = useState({});

  const fetchPost = async () => {
    const res = await axios.get("http://localhost:4002/posts");
    console.log("fetchpost", res.data);
    setPost(res.data);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const renderPost = Object.values(post).map((post) => {
    return (
      post.title.length > 0 && (
        <div
          key={post.id}
          className="card border-success mx-2"
          style={{ width: "30%", marginBottom: "20px" }}
        >
          <div className="card-body">
            <h3>{post.title}</h3>
            <CommentCreate postId={post.id} />
            <CommentList comments={post.comments} />
          </div>
        </div>
      )
    );
  });

  return (
    <>
      <h2 className="my-3">Posts</h2>
      <button onClick={fetchPost} className="btn btn-danger btn-sm">
        Load Post
      </button>
      <div className="d-flex flex-row flex-wrap justify-content-start my-2">
        {renderPost}
      </div>
    </>
  );
};

export default PostList;
