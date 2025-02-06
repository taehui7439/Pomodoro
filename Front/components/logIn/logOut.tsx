"use client";

import useAuthStore from "@/store/useAuthStore";

const LogOut = () => {
  const { logout } = useAuthStore();
  return (
    <div className="absolute top-4">
      <button
        className="px-2 py-1 bg-orange-400 text-white text-[14px] rounded-full hover:bg-orange-500 transition-colors"
        onClick={() => logout()}
      >
        로그아웃
      </button>
    </div>
  );
};

export default LogOut;
