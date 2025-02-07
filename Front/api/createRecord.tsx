import { apiAddress } from "@/constant/apiAddress";
import useAuthStore from "@/store/useAuthStore";

export const createTimerRecord = async (
  email: string,
  startTime: string,
  endTime: string,
  duration: number,
) => {
  const { token } = useAuthStore();

  try {
    const response = await fetch(apiAddress.createRecord, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        startTime,
        endTime,
        duration,
      }),
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      console.error("응답 상태:", response); // 상태 코드와 메시지 출력
      throw new Error(
        `타이머 기록을 생성하는 중 문제가 발생했습니다: ${errorDetail.message || "알 수 없는 오류입니다."}`,
      );
    }

    const data = await response.json();
    console.log("타이머 기록 생성 성공:", data);
  } catch (err) {
    console.error("타이머 기록 생성 실패:", err);
    throw new Error("타이머 기록 생성에 실패했습니다. 네트워크를 확인하고 다시 시도해 주세요.");
  }
};
