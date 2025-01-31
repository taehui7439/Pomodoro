import Image from "next/image";
import React, { useState } from "react";

interface TimerButtonProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const Timer = React.memo(({ isRunning, onStart, onPause, onReset }: TimerButtonProps) => {
  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => {
    onPause();
    setIsPaused(true);
  };

  const handleStart = () => {
    onStart();
    setIsPaused(false);
  };

  return (
    <div className="mt-8 flex flex-row justify-center items-center p-[16px] gap-[20px]">
      {!isRunning && !isPaused ? (
        <button
          className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          onClick={isRunning ? handlePause : handleStart}
        >
          세션을 시작합니다
        </button>
      ) : (
        <>
          <button className="w-[50px] h-[50px] bg-[rgba(242,105,13,0.44)] rounded-[30px] hover:bg-orange-600 transition-colors">
            <div
              className="flex flex-row justify-center items-center p-[6px] px-[8px] gap-[10px]"
              onClick={isRunning ? handlePause : handleStart}
            >
              <Image src="/images/timer/pause.svg" alt="Pause icon" width={18} height={20} />
            </div>
          </button>
          <button
            className="w-[50px] h-[50px] bg-[rgba(242,105,13,0.44)] rounded-[30px] hover:bg-orange-600 transition-colors"
            onClick={onReset}
          >
            <div className="flex flex-row justify-center items-center p-[6px] px-[8px] gap-[10px]">
              <Image src="/images/timer/stop.svg" alt="Pause icon" width={18} height={20} />
            </div>
          </button>
        </>
      )}
    </div>
  );
});

export default Timer;
