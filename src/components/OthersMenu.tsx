import React, { Dispatch, SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { follow } from "../redux/thunks/user";
import { PostData } from "../types";
import DropDown from "./DropDown";
import styles from "../essets/scss/PostMenu.module.scss";
import useFollowState from "../hooks/useFollowState";
import { useNavigate } from "react-router-dom";

interface OthersMenuProps {
  post: PostData;
  isDropped: boolean;
  setDrop: Dispatch<SetStateAction<boolean>>;
}

function OthersMenu({ post, isDropped, setDrop }: OthersMenuProps) {
  const { writer } = post;
  const { sessionId } = useAppSelector((state) => state.auth);
  const { isFollowed, setIsFollowed } = useFollowState(writer._id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDrop = () => setDrop((prev) => !prev);

  const handleClickFollow = async () => {
    if (!sessionId) {
      alert("로그인이 필요한 서비스입니다.");
      return navigate("/signin");
    }
    setIsFollowed((prev) => !prev);
    await dispatch(follow({ userId: writer._id, isFollowed }));
  };

  return (
    <DropDown isDropped={isDropped} setDrop={setDrop}>
      <ul className={styles.list} onClick={handleDrop}>
        <li onClick={handleClickFollow}>
          <span>{isFollowed ? "팔로우 취소" : "팔로우"}</span>
        </li>
        <li>
          <span>즐겨찾기 등록</span>
        </li>
        <li>
          <span>공유하기</span>
        </li>
        <li>
          <span>링크 복사</span>
        </li>
      </ul>
    </DropDown>
  );
}

export default OthersMenu;
