import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/App";
import Account from "./pages/Account";
import Bookmark from "./pages/Bookmark";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProfileHome from "./pages/ProfileHome";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path=":id" element={<Profile />}>
            <Route path="post" element={<ProfileHome />} />
            <Route path="bookmark" element={<Bookmark />} />
          </Route>
          <Route path="account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
