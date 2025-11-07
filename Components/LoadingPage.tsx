// components/LoadingPage.tsx
export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-pink-600">
      <div className="relative flex flex-col items-center">
        {/* Cute bouncing emoji */}
        <div className="text-6xl animate-bounce mb-4">🐻</div>
        <h1 className="text-2xl font-bold">Loading...</h1>

        {/* Subtext */}
        <p className="text-sm mt-2 text-pink-400">Please wait a moment 💕</p>

        {/* Soft pastel spinning heart */}
        <div className="mt-6 w-10 h-10 border-4 border-pink-300 border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Optional soft fade-in background cloud */}
      <div className="absolute bottom-10 text-pink-200 text-4xl animate-pulse">
        ☁️ ☁️ ☁️
      </div>
    </div>
  );
}
