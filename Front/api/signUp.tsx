import { apiAddress } from "@/constant/apiAddress";

export const SignUp = async (email: string, password: string) => {
  try {
    // API 호출 예시
    const response = await fetch(apiAddress.signUp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      console.error("응답 상태:", response); // 상태 코드와 메시지 출력
      throw new Error(
        `회원가입 중 문제가 발생했습니다: ${errorDetail.message || "알 수 없는 오류입니다."}`,
      );
    }

    const data = await response.json();
    // 로컬 스토리지에 토큰 저장
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify({ email }));
    console.log("회원가입 성공:", data);

    return data;
  } catch (err) {
    console.error("회원가입 실패:", err);
    throw new Error("회원가입에 실패했습니다. 네트워크를 확인하고 다시 시도해 주세요.");
  }
};
