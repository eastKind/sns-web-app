import React, { useState } from "react";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { likesPost } from "../redux/thunks/post";
import { PostData } from "../types";
import styles from "../essets/scss/Interactions.module.scss";

interface InteractionsProps {
  post: PostData;
  onComment: () => void;
}

function Interactions({ post, onComment }: InteractionsProps) {
  const { _id, likeUsers } = post;
  const { userData: user } = useAppSelector((state) => state.auth);
  const INIT_STATE = likeUsers.includes(user._id);
  const [isLiked, setIsLiked] = useState(INIT_STATE);
  const dispatch = useAppDispatch();

  const handleComment = () => onComment();

  const handleLikes = async () => {
    try {
      await dispatch(likesPost({ postId: _id, isLiked }));
      setIsLiked((prev) => !prev);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.interactions}>
      <span
        onClick={handleLikes}
        className={classNames(
          "material-symbols-rounded",
          isLiked && styles.liked
        )}
      >
        favorite
      </span>
      <span className="material-symbols-rounded" onClick={handleComment}>
        mode_comment
      </span>
      <span className="material-symbols-rounded">bookmark</span>
    </div>
  );
}

export default Interactions;
