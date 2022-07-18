import React, { useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getMe as getMeAsync } from "../redux/userSlice";
import { GetPostsQuery } from "../types";
import { getPosts as getPostsAsync } from "../redux/postSlice";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";

function Home() {
  const { sessionId } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLoad = useCallback(async (arg: GetPostsQuery) => {
    await dispatch(getMeAsync());
    await dispatch(getPostsAsync(arg));
  }, []);

  useEffect(() => {
    handleLoad({ cursor: "", limit: 10 });
  }, [handleLoad]);

  if (!sessionId) return <Navigate to="/signin" />;

  return (
    <div>
      <h1>Home</h1>
      <PostForm />
      <PostList />
    </div>
  );
}

export default Home;
