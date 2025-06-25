import { useTelegramBackButton } from "../hooks/useTelegramBackButton";
import { useTelegramHaptic } from "../hooks/useTelegramHaptic";

const FallbackBackButton = () => {
  const { goBack, isHomePage } = useTelegramBackButton();
  const { impactFeedback } = useTelegramHaptic();

  const handleBackClick = () => {
    // Light impact for navigation actions
    impactFeedback("light");
    goBack();
  };

  // Agar bosh sahifada bo'lsa yoki Telegram WebApp bo'lsa, fallback button ko'rsatmaslik
  if (isHomePage || window.Telegram?.WebApp) {
    return null;
  }

  return (
    <button
      onClick={handleBackClick}
      className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-sm hover:bg-white/90 transition-colors"
      aria-label="Orqaga qaytish"
    >
      <svg
        className="w-5 h-5 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

export default FallbackBackButton;
