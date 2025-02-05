import { create } from "zustand";

interface DateState {
  selectDate: string;
  setSelectDate: (date: any) => void;
}

const useDateStore = create<DateState>((set) => ({
  selectDate: new Date().toISOString().split("T")[0],
  setSelectDate: (date) => set({ selectDate: date }),
}));

export default useDateStore;
