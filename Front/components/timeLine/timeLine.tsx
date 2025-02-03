"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { start } from "repl";

interface TimerBox {
  startTime: string;
  endTime: string;
}

const TimeLine = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [containerH, setContainerH] = useState(0);
  // 타임라인 기록을 위한 상태
  const [timerBoxes, setTimerBoxes] = useState<TimerBox[]>([]);
  const timeLineRef = useRef<HTMLDivElement>(null);

  // 컨테이너 높이 측정 및 업데이트
  useEffect(() => {
    const updateHeight = () => {
      if (timeLineRef.current) {
        setContainerH(timeLineRef.current.clientHeight);
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // 현재 시간을 1분마다 업데이트 및 스크롤 위치 조정
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // 시간대 생성 (00:00 AM부터 12:00 PM까지)
  const timeSlots = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => {
        const hour = i % 24;
        return `${String(hour).padStart(2, "0")}:00 ${hour < 12 ? "AM" : "PM"}`;
      }),
    [],
  );

  // 현재 시간의 위치를 계산 (퍼센트)
  const getCurrentTimePosition = useMemo(() => {
    if (containerH === 0) return 0;

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return ((hours * 60 + minutes) / containerH) * 100;
  }, [currentTime, containerH]);

  // 타이머 박스 위치 계산
  const calculateBoxPosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);

    return ((hours * 60 + minutes) / containerH) * 100;
  };

  // 타이머 박스 높이 계산
  const calculateBoxHeight = (startTime: string, endTime: string) => {
    const startPosition = calculateBoxPosition(startTime);
    const endPosition = calculateBoxPosition(endTime);

    return endPosition - startPosition;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center p-0 pl-5 gap-8 isolate overflow-scroll bg-white border-l border-r border-gray-300 border-opacity-10">
      {/* 타임라인 컨테이너 */}
      <div
        ref={timeLineRef}
        className="fixed w-[50%] h-[80vh] border-l border-gray-200 overflow-y-auto"
      >
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
              className="absolute right-0 w-[calc(100%-20px)] bg-orange-100 rounded-l-md border-l-4 border-orange-500"
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
  );
};

export default TimeLine;
