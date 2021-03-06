import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useAppDispatch } from "../redux/hooks";
import useIsLiked from "../hooks/useIsLiked";
import useIsMe from "../hooks/useIsMe";
import { deleteComment, likesComment } from "../redux/thunks/comment";
import { CommentData } from "../types";
import rtf from "../utils/rtf";
import Avatar from "./Avatar";
import styles from "../essets/scss/CommentItem.module.scss";

interface ListItemProps {
  comment: CommentData;
}

function CommentItem({ comment }: ListItemProps) {
  const { _id, postId, writer, contents, createdAt, likeUsers } = comment;
  const dispatch = useAppDispatch();
  const isLiked = useIsLiked(likeUsers);
  const isMe = useIsMe(writer._id);

  const handleDeleteClick = async () => {
    try {
      await dispatch(deleteComment({ commentId: _id, postId }));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLikesClick = async () => {
    try {
      await dispatch(likesComment({ commentId: _id, isLiked }));
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <Link
        to={`${writer._id}/post`}
        state={{ isMe }}
        className={styles.avatar}
      >
        <Avatar photo={writer.photoUrl} name={writer.name} />
      </Link>
      <div className={styles.body}>
        <div className={styles.header}>
          <Link to={`${writer._id}/post`} state={{ isMe }}>
            <span>{writer.name}</span>
          </Link>
          {isMe && (
            <span
              onClick={handleDeleteClick}
              className={classNames(
                "material-symbols-rounded",
                styles.removeBtn
              )}
            >
              remove
            </span>
          )}
        </div>
        <div className={styles.contents}>{contents}</div>
        <div className={styles.footer}>
          <span
            onClick={handleLikesClick}
            className={classNames(
              "material-symbols-rounded",
              styles.likeBtn,
              isLiked && styles.liked
            )}
          >
            favorite
          </span>
          <span className={styles.likeCount}>????????? {likeUsers.length}???</span>
          <span className={styles.createdAt}>{rtf(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
