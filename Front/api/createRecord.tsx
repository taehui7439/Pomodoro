import { apiAddress } from "@/constant/apiAddress";

export const createTimerRecord = async (
  email: string,
  startTime: string,
  endTime: string,
  duration: number,
) => {
  try {
    const response = await fetch(apiAddress.createRecord, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        startTime,
        endTime,
        duration,
      }),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("타이머 기록 생성에 실패했습니다.");
    }

    const data = await response.json();
    console.log("타이머 기록 생성 성공:", data);
  } catch (error) {
    console.error("타이머 기록 생성 실패:", error);
  }
};
