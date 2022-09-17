import React from "react";

const CommentList = ({ comments }) => {
  const renderComments = comments.map((comment, index) => {
    let content;
    if (comment.status === "approved") {
      content = comment.content;
    } else if (comment.status === "rejected") {
      content = "This comment is rejected by admin";
    } else {
      content = "This comment is awaiting moderation";
    }

    return comment.content.length > 0 && <li key={index}>{content}</li>;
  });

  return (
    <>
      <span>{comments.length} Comments</span> <ul>{renderComments}</ul>
    </>
  );
};

export default CommentList;
