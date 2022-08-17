import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import UserAPI from "../api/User";
import { User, GetUsersReqData } from "../types";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import Avatar from "./Avatar";
import Spinner from "./Spinner";
import styles from "../essets/scss/UserList.module.scss";

interface UserListProps {
  userId: string;
  isFollowList: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

function UserList({ userId, isFollowList, setShow }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [cursor, setCursor] = useState("");
  const targetRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useInfiniteScroll(targetRef);

  const handleLoad = useCallback(
    async (options: GetUsersReqData) => {
      try {
        setLoading(true);
        const { users: nextUsers, hasNext } = isFollowList
          ? await UserAPI.getFollowings(options)
          : await UserAPI.getFollowers(options);
        const nextCursor =
          nextUsers.length > 0 ? nextUsers[nextUsers.length - 1]._id : "";
        if (options.cursor) setUsers((prev) => [...prev, ...nextUsers]);
        else setUsers(nextUsers);
        setHasNext(hasNext);
        setCursor(nextCursor);
      } catch (error: any) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
    [isFollowList]
  );

  const handleClose = () => setShow(false);

  useEffect(() => {
    handleLoad({ userId, cursor: "", limit: 10 });
  }, [userId, handleLoad]);

  useEffect(() => {
    if (isIntersecting && hasNext) {
      handleLoad({ userId, cursor, limit: 10 });
    }
  }, [isIntersecting, hasNext, userId, cursor, handleLoad]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {isFollowList ? "팔로잉" : "팔로워"}
        <span
          className={classNames("material-symbols-rounded", styles.closeBtn)}
          onClick={handleClose}
        >
          close
        </span>
      </div>
      <ul className={styles.list}>
        {users.map((user) => (
          <li key={user._id} className={styles.listItem}>
            <Link to={`/${user._id}/post`} state={{ isMe: false }}>
              <Avatar width="45px" photo={user.photoUrl} name={user.name} />
            </Link>
            <Link to={`/${user._id}/post`} state={{ isMe: false }}>
              <span>{user.name}</span>
            </Link>
            <div className={styles.desc}>{"hello :)"}</div>
          </li>
        ))}
        <div
          className={classNames(styles.observer, hasNext && styles.show)}
          ref={targetRef}
        >
          {loading && <Spinner size="30px" />}
        </div>
      </ul>
    </div>
  );
}

export default UserList;