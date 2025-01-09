import Category from '@/components/category/category';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col justify-center items-center p-4 px-1 gap-3">
        <h1 className="text-2xl font-bold text-foreground mb-4">무엇을 집중하실건가요?</h1>
        <Category />
      </div>

      <div className="relative w-64 h-64">
        <div className="w-full h-full rounded-full border-8 border-gray-200">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-4xl font-bold">
              {/* {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} */}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
          세션을 시작합니다
        </button>
      </div>

      <div className="mt-8 flex gap-2">
        {[6, 7, 8, 9, 10, 11, 12].map((day) => (
          <div
            key={day}
            className="w-8 h-8 flex items-center justify-center border rounded-full text-sm"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
