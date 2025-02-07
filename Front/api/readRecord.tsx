import { apiAddress } from "@/constant/apiAddress";
import useAuthStore from "@/store/useAuthStore";

export const ReadTimerRecord = async (email: string, date: string) => {
  const { token } = useAuthStore();

  try {
    const response = await fetch(`${apiAddress.readRecord}/${email}/${date}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("응답 상태:", response);
      throw new Error("타이머 기록을 조회하는 중 문제가 발생했습니다. 다시 시도해 주세요.");
    }

    const data = await response.json();
    console.log("타이머 기록 조회 성공");

    return data.records;
  } catch (err) {
    console.error("타이머 기록 조회 실패:", err);
    throw new Error("타이머 기록 조회에 실패했습니다. 네트워크를 확인하고 다시 시도해 주세요.");
  }
};
