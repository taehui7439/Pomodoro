import { create } from "zustand";

interface TimerBox {
  startTime: string;
  endTime: string;
}

interface TimerState {
  timerBoxes: TimerBox[];
  addTimerBox: (boxes: TimerBox[]) => void;
  setTimerBoxes: (boxes: TimerBox[]) => void;
}

const userTimerStore = create<TimerState>((set) => ({
  // 초기 상태로 배열 설정
  timerBoxes: [],
  // 기존 timerBoxes에 새로운 box 추가
  addTimerBox: (boxes) =>
    set((state) => ({
      timerBoxes: [...state.timerBoxes, ...boxes],
    })),
  // 새로운 배열로 설정
  setTimerBoxes: (boxes) => set({ timerBoxes: boxes }),
}));

export default userTimerStore;
