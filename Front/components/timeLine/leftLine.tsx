"use client";

import useAuthStore from "@/store/useAuthStore";
import TimeLine from "./timeLine";
import LoginForm from "../logIn/loginForm";

const LeftLine = () => {
  const { isAuthenticated } = useAuthStore();

  return <>{isAuthenticated ? <TimeLine /> : <LoginForm />}</>;
};

export default LeftLine;
