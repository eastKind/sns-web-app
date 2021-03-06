import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { follow } from "../redux/thunks/user";

interface OthersMenuProps {
  postId: string;
  writerId: string;
}

function OthersMenu({ postId, writerId }: OthersMenuProps) {
  const { me } = useAppSelector((state) => state.user);
  const [isFollowed, setIsFollowed] = useState(
    me.followings.includes(writerId)
  );
  const dispatch = useAppDispatch();

  const handleClickFollow = async () => {
    try {
      await dispatch(follow({ userId: writerId, isFollowed }));
      setIsFollowed((prev) => !prev);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <ul style={{ width: "150px" }}>
      <li onClick={handleClickFollow}>
        {isFollowed ? "팔로우 취소" : "팔로우"}
      </li>
      <li>즐겨찾기 등록</li>
      <li>공유하기</li>
      <li>링크 복사</li>
    </ul>
  );
}

export default OthersMenu;
