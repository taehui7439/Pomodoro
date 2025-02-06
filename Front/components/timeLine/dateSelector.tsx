"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import useDateStore from "@/store/useDateStore";

const DataSelector = () => {
  // 날짜 변경을 위한 상태
  const { selectDate, setSelectDate } = useDateStore();

  // 날짜 배열 생성
  const getDates = useMemo(() => {
    const dates = [];

    for (let i = -3; i <= 3; i += 1) {
      // 원본 날짜 유지하며 날짜 계산
      const date = new Date(selectDate);
      date.setDate(date.getDate() + i);
      dates.push({
        date: date.getDate(),
        day: ["일", "월", "화", "수", "목", "금", "토"][date.getDay()],
        full: date.toISOString().split("T")[0],
      });
    }

    return dates;
  }, [selectDate]);

  // 날짜 이동 함수
  const moveDate = useCallback(
    (direction: "prev" | "next") => {
      const newDate = new Date(selectDate);
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
      setSelectDate(new Date().toISOString().split("T")[0]);
    },
    [selectDate, setSelectDate],
  );

  return (
    <div className="p-[3px] px-[18px] gap-[6px]">
      <div className="flex flex-row justify-center items-center p-0 gap-[3px] flex-none order-0 flex-grow-0">
        <button
          className="flex justify-center items-center box-border w-[30px] h-[30px] border border-[rgba(0,0,0,0.11)] rounded-[5px] flex-none order-0 flex-grow-0"
          onClick={() => moveDate("prev")}
        >
          <Image
            src="/images/dateSelector/leftArrow.svg"
            alt="left arrow icon"
            width={9}
            height={15}
          />
        </button>
        <div className="flex justify-center items-center box-border w-[200px] h-[30px] border border-[rgba(0,0,0,0.11)] rounded-[5px] flex-none order-1 flex-grow-0">
          <span>오늘</span>
        </div>
        <button
          className="flex justify-center items-center box-border w-[30px] h-[30px] border border-[rgba(0,0,0,0.11)] rounded-[5px] flex-none order-2 flex-grow-0"
          onClick={() => moveDate("next")}
        >
          <Image
            src="/images/dateSelector/rightArrow.svg"
            alt="left arrow icon"
            width={9}
            height={15}
          />
        </button>
      </div>
      <div className="flex flex-row justify-center items-center p-0 gap-[5px] flex-none order-1 flex-grow-0">
        {getDates.map((date, i) => (
          <button
            key={date.full}
            onClick={() => {
              setSelectDate(date.full);
              console.log(new Date().toISOString().split("T")[0]);
            }}
            className={`flex flex-col items-center w-12 p-2 rounded ${
              i === 3 ? "bg-orange-500 text-white" : "hover:bg-orange-100"
            }`}
          >
            <span>{date.day}</span>
            <span>{date.date}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataSelector;
