import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { signout } from "../redux/thunks/auth";
import { initUser } from "../redux/reducers/user";
import Container from "./Container";
import Avatar from "./Avatar";
import DropDown from "./DropDown";
import logo from "../essets/images/logo.png";
import styles from "../essets/scss/Nav.module.scss";

interface NavProps {
  className?: string;
}

function Nav({ className }: NavProps) {
  const [drop, setDrop] = useState(false);
  const { me } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDrop((prev) => !prev);
  };

  const handleLogout = async () => {
    await dispatch(signout());
    dispatch(initUser());
    navigate("/signin");
  };

  return (
    <div className={classNames(styles.nav, className)}>
      <Container className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="fancimple" />
        </Link>
        <ul className={styles.menu}>
          <li>
            <Link to="/">
              <span className="material-symbols-rounded">home</span>
            </Link>
          </li>
          <li>
            <span className="material-symbols-rounded">add_circle</span>
          </li>
          <li onClick={handleClick}>
            <Avatar photo={me.photoUrl} name={me.name} />
            <DropDown show={drop} setShow={setDrop}>
              <ul>
                <Link to={`/${me._id}/post`} state={{ isMe: true }}>
                  <li>프로필</li>
                </Link>
                <Link to={`/${me._id}/bookmark`} state={{ isMe: true }}>
                  <li>북마크</li>
                </Link>
                <li onClick={handleLogout}>로그아웃</li>
              </ul>
            </DropDown>
          </li>
        </ul>
      </Container>
    </div>
  );
}

export default Nav;
