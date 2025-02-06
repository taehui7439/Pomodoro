import { create } from "zustand";

import { SignUp } from "@/api/\bsignUp";
import { logIn } from "@/api/logIn";
import { persist } from "zustand/middleware";

interface AuthState {
  user: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// 로컬 스토리지에서 초기 상태를 가져오는 함수
const getInitialAuthState = () => {
  const token = localStorage.getItem("authToken");
  const userData = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  return {
    token,
    user: userData, // 사용자 정보는 null로 유지
    isAuthenticated: !!token, // 토큰이 있으면 인증된 상태로 설정
  };
};

const useAuthStore = create<AuthState>()((set, get) => ({
  ...getInitialAuthState(),
  isLoading: false,
  error: null,

  // signUp: async (email: string, password: string) => {
  //   try {
  //     set({ isLoading: true, error: null });

  //     const data = await SignUp(email, password);

  //     set({
  //       user: data.userId,
  //       token: data.token,
  //       isAuthenticated: true,
  //       isLoading: false,
  //     });
  //   } catch (err) {
  //     set({
  //       error: err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.",
  //       isLoading: false,
  //     });
  //   }
  // },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const data = await logIn(email, password);
      set({
        user: { email: data.userId },
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.",
        isLoading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
