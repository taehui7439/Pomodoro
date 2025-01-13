import Category from "@/components/category/category";
import TimerClock from "@/components/timerClock/timerClock";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col justify-center items-center p-4 px-1 gap-3">
        <h1 className="text-2xl font-bold text-foreground mb-4">무엇을 집중하실건가요?</h1>
        <Category />
      </div>

      <TimerClock />
    </div>
  );
}
