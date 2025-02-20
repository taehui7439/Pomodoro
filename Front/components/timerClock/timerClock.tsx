"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import Image from "next/image";

import Timer from "./timer";
import { createTimerRecord } from "@/api/createRecord";
import userTimerStore from "@/store/useTimerStore";
import useAuthStore from "@/store/useAuthStore";

export default function TimerClock() {
  // 25분을 초로 변환 = 1500
  const TOTAL_TIME = 1500;
  // 남은 시간 및 타이머 동작 확인 상태
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  // 시간 초과 상태
  const [isOvertime, setIsOvertime] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  // 시작 시간 관리
  const [times, setTimes] = useState({
    currentTime: "00:00",
    endTime: "00:25",
  });
  const { user } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 시작 시간 가져오기
  // 현재 시간과 25분 후 시간 계산
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // 현재 시간과 예상 종료 시간 계산
  const getCurrentAndEndTime = () => {
    const now = new Date();
    const end = new Date(now.getTime() + TOTAL_TIME * 1000); // 25분을 밀리초로 변환

    return {
      currentTime: formatTime(now),
      endTime: formatTime(end),
    };
  };

  // 컴포넌트 마운트 시 초기 시간 설정
  useEffect(() => {
    setTimes(getCurrentAndEndTime());
  }, []);

  // 타이머 동작 로직
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft((prev) => prev - 1);
        } else {
          setIsOvertime(true);
          setOvertimeSeconds((prev) => prev + 1);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  // 시간 포맷팅 (mm:ss)
  const viewTimeLeft = () => {
    const totalSeconds = isOvertime ? TOTAL_TIME + overtimeSeconds : timeLeft;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const timeDisplay = viewTimeLeft();

  // 타이머 동작 - 진행도를 각도로 계산
  const calculateProgress = () => {
    if (isOvertime) {
      // 최대 각도로 고정
      return 150;
    }
    const progress = (timeLeft / TOTAL_TIME) * 100;
    return (progress / 100) * 150;
  };

  // 부채꼴 path 생성
  const createSectorPath = (angle: number) => {
    const centerX = 50;
    const centerY = 50;
    const radius = 30;

    // 시작점은 항상 12시 방향 (90도를 빼서 조정)
    const endAngle = (angle - 90) * (Math.PI / 180);

    // 부채꼴의 끝점 계산
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);

    // 큰 원호 여부 (180도 초과시 1)
    const largeArcFlag = angle > 180 ? 1 : 0;

    // SVG path 문자열 생성
    return `
      M ${centerX} ${centerY}
      L ${centerX} ${centerY - radius}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      L ${centerX} ${centerY}
      Z
    `;
  };

  const currentAngle = calculateProgress();

  // 60개의 눈금을 생성 (1분 = 60초)
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  // 중앙 반지름
  const radius = 25;

  // 타이머 동작
  const startTimer = useCallback(() => {
    setIsRunning(true);
    // 시작 시간 업데이트
    setTimes(getCurrentAndEndTime());
  }, []);
  const pauseTimer = useCallback(() => setIsRunning(false), []);
  const resetTimer = useCallback(async () => {
    if (isRunning) {
      try {
        const now = new Date();
        const startTime = times.currentTime;
        const endTime = formatTime(now);
        const duration = isOvertime ? TOTAL_TIME + overtimeSeconds : TOTAL_TIME - timeLeft;

        // 타이머 박스 추가
        userTimerStore.getState().addTimerBox({
          startTime,
          endTime,
        });

        // 테스트용 이메일 사용, 로그인 기능 구현시 이메일을 가져오도록 설정해야함
        await createTimerRecord(user.email, startTime, endTime, Math.ceil(duration / 60));
      } catch (error) {
        console.error("타이머 기록 생성 중 오류 발생:", error);
      }
    }

    // 기존 상태 초기화
    setIsRunning(false);
    setTimeLeft(TOTAL_TIME);
    setIsOvertime(false);
    setOvertimeSeconds(0);
    // 시간 초기화
    setTimes(getCurrentAndEndTime());
  }, [isRunning, times.currentTime, timeLeft, isOvertime, overtimeSeconds]);

  // Arrow 이미지 컴포넌트 분리 및 메모이제이션
  const ArrowImage = React.memo(() => (
    <div className="flex flex-col justify-center items-center p-[2px] px-[1px] gap-[10px] w-[12px] h-[10px]">
      <Image src="/images/timer/arrow.svg" alt="Arrow icon" width={10} height={8} priority />
    </div>
  ));

  return (
    <>
      <div className="relative w-64 h-64">
        {/* 눈금 */}
        <svg className="w-full h-full absolute" viewBox="0 0 100 100">
          {ticks.map((tick) => {
            // 각 눈금의 각도 계산 (360도 / 60 = 6도씩)
            const rotation = tick * 6;
            // 5의 배수 위치는 큰 눈금으로 표시
            const isMajorTick = tick % 5 === 0;

            return (
              <line
                key={tick}
                x1="50"
                y1={isMajorTick ? "5" : "8"} // 큰 눈금은 더 길게
                x2="50"
                y2="10"
                stroke="rgb(209 213 219)"
                strokeWidth={isMajorTick ? "1.5" : "1"}
                strokeLinecap="round"
                transform={`rotate(${rotation}, 50, 50)`}
              />
            );
          })}
        </svg>

        {/* 타이머 중앙 */}
        <svg className="w-full h-full absolute" viewBox="0 0 100 100">
          {/* 배경 원 */}
          <circle cx="50" cy="50" r={radius} fill="#FFE1CB" stroke="#FFE1CB" strokeWidth="10" />
          {/* 진행 원 */}

          <path
            d={createSectorPath(currentAngle)}
            fill="#FFA87C"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>

        {/* 시계침 */}
        <div
          className="absolute top-1/2 left-1/2 w-1 h-16 -ml-[2px] -mt-16 origin-bottom transition-transform duration-500"
          style={{ transform: `rotate(${currentAngle}deg)` }}
        >
          <div className="w-full h-full bg-[#FF7734] rounded-full transform -translate-y-4 z-9" />
        </div>

        {/* 중앙 점 */}
        <div className="absolute top-[125px] left-[125px] w-[20px] h-[20px] -ml-[6px] -mt-[6px] bg-[#ffffff] shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-full z-10" />
        <div className="absolute top-[120px] left-[120px] w-[30px] h-[30px] -ml-[6px] -mt-[6px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-full z-0" />
      </div>

      {/* 시간 표시 */}
      <div className="w-[220px] h-[68px] flex flex-col justify-center items-center p-[26px] gap-[6px]">
        <span className="font-inter font-medium text-[24px] leading-[24px] flex items-center text-[rgba(0,0,0,0.5)]">
          {timeDisplay}
        </span>
        <div className="box-border flex flex-row justify-center items-center p-[7px] gap-[3px] w-[168px] h-[28px] border-[1.5px] border-[rgba(0,0,0,0.11)] rounded-[20px]">
          <span className="font-inter font-medium text-[13px] leading-[13px] flex items-center text-center text-[rgba(0,0,0,0.66)]">
            {times.currentTime}
          </span>
          <ArrowImage />
          <span className="font-inter font-medium text-[13px] leading-[13px] flex items-center text-center text-[rgba(0,0,0,0.66)]">
            {times.endTime}
          </span>
        </div>
      </div>

      <Timer isRunning={isRunning} onStart={startTimer} onPause={pauseTimer} onReset={resetTimer} />
    </>
  );
}
