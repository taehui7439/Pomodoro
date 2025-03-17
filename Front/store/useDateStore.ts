import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DateState {
  selectDate: string;
  setSelectDate: (date: any) => void;
}

const useDateStore = create<DateState>()(
  persist(
    (set) => ({
      selectDate: new Date().toISOString().split("T")[0],
      setSelectDate: (date) => set({ selectDate: date }),
      resetStore: () => set({ selectDate: new Date().toISOString().split("T")[0] }),
    }),
    {
      name: "date-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useDateStore;
