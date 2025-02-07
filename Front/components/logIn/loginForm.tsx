"use client";

import React, { useState } from "react";

import useAuthStore from "@/store/useAuthStore";
import { SignUp } from "@/api/signUp";
// import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(email, password);
    } catch (err) {
      console.log("로그인 실패:", err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await SignUp(email, password); // 회원가입 API 호출
    } catch (err) {
      console.log("회원가입 실패:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

        {/* {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}
        {error}

        <form
          className="space-y-4 flex flex-col justify-center items-center"
          onSubmit={isSignUp ? handleRegister : handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 text-white rounded-full w-[200px]
              ${isLoading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}
              transition-colors duration-200`}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            onClick={() => setIsSignUp(true)}
            className={`px-6 py-3 text-white rounded-full w-[200px]
              ${isLoading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}
              transition-colors duration-200`}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
