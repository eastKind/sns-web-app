import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import useLikeState from "../hooks/useLikeState";
import useIsMe from "../hooks/useIsMe";
import { deleteComment, likesComment } from "../redux/thunks/comment";
import { CommentData } from "../types";
import rtf from "../utils/rtf";
import Avatar from "./Avatar";
import styles from "../essets/scss/CommentItem.module.scss";
import Spinner from "./Spinner";

interface ListItemProps {
  comment: CommentData;
}

function CommentItem({ comment }: ListItemProps) {
  const { _id, postId, writer, contents, createdAt, likeUsers } = comment;
  const { sessionId } = useAppSelector((state) => state.auth);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isLiked, setIsLiked } = useLikeState(likeUsers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMe = useIsMe(writer._id);

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    await dispatch(deleteComment({ commentId: _id, postId }));
    setIsDeleting(false);
  };

  const handleLikesClick = async () => {
    if (!sessionId) {
      alert("로그인이 필요한 서비스입니다.");
      return navigate("/signin");
    }
    setIsLiked((prev) => !prev);
    await dispatch(likesComment({ commentId: _id, isLiked }));
  };

  return (
    <div className={styles.container}>
      <Link to={`${writer._id}/post`} className={styles.avatar}>
        <Avatar photo={writer.photoUrl} name={writer.name} />
      </Link>
      <div className={styles.body}>
        <div className={styles.header}>
          <Link to={`${writer._id}/post`}>
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
          <span className={styles.likeCount}>좋아요 {likeUsers.length}개</span>
          <span className={styles.createdAt}>{rtf(createdAt)}</span>
        </div>
      </div>
      {isDeleting && (
        <div className={styles.spinner}>
          <Spinner size={18} />
        </div>
      )}
    </div>
  );
}

export default CommentItem;
