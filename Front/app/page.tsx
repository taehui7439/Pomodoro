import Category from "@/components/category/category";
import LogOut from "@/components/logIn/logOut";
import LeftLine from "@/components/timeLine/leftLine";
import TimerClock from "@/components/timerClock/timerClock";
import QueryClientWrapper from "./QueryClientWrapper";

export default function Home() {
  return (
    <QueryClientWrapper>
      <div className="flex flex-row">
        {/* 왼쪽 부분 */}
        <div className="min-h-screen flex flex-col flex-1 items-center justify-center bg-background">
          <div className="flex flex-col justify-center items-center p-4 px-1 gap-3">
            <LogOut />
            <h1 className="text-2xl font-bold text-foreground mb-4">무엇을 집중하실건가요?</h1>
            <Category />
          </div>

          <TimerClock />
        </div>
        {/* 중간 선 */}
        <div className="border-l border-gray-300"></div>
        {/* 오른쪽 부분 */}
        <div className="min-h-screen flex flex-col flex-1 items-center justify-center bg-background">
          <LeftLine />
        </div>
      </div>
    </QueryClientWrapper>
  );
}
