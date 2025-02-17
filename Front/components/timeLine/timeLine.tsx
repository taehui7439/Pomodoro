"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

import DataSelector from "./dateSelector";
import { ReadTimerRecord } from "@/api/readRecord";
import userTimerStore from "@/store/useTimerStore";
import useDateStore from "@/store/useDateStore";
import useAuthStore from "@/store/useAuthStore";

// 성능 측정을 위한 유틸리티 함수
// const measurePerformance = async (action: () => void | Promise<void>, iterations: number = 1) => {
//   const times: number[] = [];

//   for (let i = 0; i < iterations; i++) {
//     const start = performance.now();
//     await action();
//     const end = performance.now();
//     times.push(end - start);
//   }

//   return {
//     average: times.reduce((a, b) => a + b, 0) / times.length,
//     min: Math.min(...times),
//     max: Math.max(...times),
//     median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)],
//   };
// };

const TimeLine = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [containerH, setContainerH] = useState(0);
  const [performanceResults, setPerformanceResults] = useState<any>(null);

  // 타임라인 기록을 위한 상태
  const { setTimerBoxes } = userTimerStore();
  // 날짜 변경을 위한 상태
  const { selectDate, setSelectDate } = useDateStore();
  // 이메일을 위한 상태
  const { user, token } = useAuthStore();

  // 타임라인 컨테이너에 대한 참조
  const timeLineRef = useRef<HTMLDivElement>(null);

  // React Query를 사용한 데이터 fetching
  const { data: timerBoxes = [] } = useQuery({
    queryKey: ["timerRecords", user?.email, selectDate],
    queryFn: async () => {
      if (!user) {
        console.log("사용자 정보가 없습니다.");
        return [];
      }
      return await ReadTimerRecord(user.email, selectDate, token);
    },
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 fresh로 유지
    gcTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    throwOnError: true,
    enabled: !!user?.email,
  });

  // 데이터 로드되면 타이머 박스 상태 업데이트
  useEffect(() => {
    if (timerBoxes && timerBoxes.length > 0) {
      // Zustand의 상태와 비교하여 변동이 있을 때만 업데이트
      const currentBoxes = userTimerStore.getState().timerBoxes;

      if (JSON.stringify(currentBoxes) !== JSON.stringify(timerBoxes)) {
        setTimerBoxes(timerBoxes);
      }
    }
  }, [timerBoxes, setTimerBoxes]);

  // 컨테이너 높이 측정 및 업데이트
  useEffect(() => {
    const updateHeight = () => {
      if (timeLineRef.current) {
        // 현재 컨테이너의 높이를 상태에 저장
        setContainerH(timeLineRef.current.clientHeight);
      }
    };

    // 컴포넌트가 마운트될 때 높이 측정
    updateHeight();

    // 윈도우 리사이즈 시 높이 업데이트
    window.addEventListener("resize", updateHeight);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // 현재 시간을 1분마다 업데이트
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // 1분마다 현재 시간을 업데이트
  //     setCurrentTime(new Date());
  //   }, 60000);

  //   return () => clearInterval(interval);
  // }, []);

  // 시간대 생성 (00:00 AM부터 12:00 PM까지)
  const timeSlots = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => {
        // 24시간 형식으로 시간 계산
        const hour = i % 24;
        return `${String(hour).padStart(2, "0")}:00 ${hour < 12 ? "AM" : "PM"}`;
      }),
    [],
  );

  // 현재 시간의 위치를 계산 (퍼센트)
  const getCurrentTimePosition = useMemo(() => {
    if (containerH === 0) return 0;
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // 현재 시간의 위치를 퍼센트로 계산
    return ((hours * 60 + minutes) / containerH) * 100;
  }, [containerH]);

  // 타이머 박스 위치 계산
  const calculateBoxPosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);

    // 주어진 시간의 위치를 퍼센트로 계산
    return ((hours * 60 + minutes) / containerH) * 100;
  };

  // 타이머 박스 높이 계산
  const calculateBoxHeight = (startTime: string, endTime: string) => {
    const startPosition = calculateBoxPosition(startTime);
    const endPosition = calculateBoxPosition(endTime);

    return endPosition - startPosition;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center p-0 pl-2 gap-8 isolate overflow-scroll bg-white border-l border-r border-gray-300 border-opacity-10">
      <div className="relative top-0 z-10 w-full bg-white pb-4">
        <DataSelector />
      </div>

      {/* 타임라인 컨테이너 */}
      <div className="w-full h-[calc(100%-60px)] relative">
        <div ref={timeLineRef} className="h-[80vh] border-gray-200 overflow-y-auto">
          {/* 시간 표시 컨테이너 */}
          <div className="relative h-full border-gray-200 ml-[70px]">
            {/* 시간대 표시 */}
            {timeSlots.map((time, index) => (
              <div key={index} className="relative h-[60px] border-b border-gray-100">
                <span className="absolute -left-[70px] top-0 text-xs text-gray-400">{time}</span>
              </div>
            ))}

            {/* 타이머 기록 박스들 */}
            {timerBoxes.map((box, i) => (
              <div
                key={i}
                className="absolute right-[100px] w-[calc(64%)] bg-orange-500 rounded-md border-l-4 border-orange-500"
                style={{
                  top: `${calculateBoxPosition(box.startTime)}%`,
                  height: `${calculateBoxHeight(box.startTime, box.endTime)}%`,
                }}
              />
            ))}

            {/* 현재 시간 표시선 */}
            <div
              className="absolute left-0 w-full h-[2px] bg-red-500"
              style={{
                top: `${getCurrentTimePosition}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div className="absolute -left-[6px] -top-[4px] w-[10px] h-[10px] bg-red-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLine;
