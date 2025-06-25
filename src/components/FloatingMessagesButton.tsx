import { useState } from "react";
import { useNavigate } from "react-router";
import { useTelegramHaptic } from "../hooks/useTelegramHaptic";

interface FloatingMessagesButtonProps {
  className?: string;
}

const FloatingMessagesButton = ({
  className = "",
}: FloatingMessagesButtonProps) => {
  const navigate = useNavigate();
  const { impactFeedback } = useTelegramHaptic();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    impactFeedback("medium");
    navigate("/messages");
  };

  return (
    <button
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        fixed bottom-24 right-4 z-50
        w-14 h-14 
        bg-blue-500 hover:bg-blue-600 active:bg-blue-700
        text-white 
        rounded-full 
        shadow-lg hover:shadow-xl 
        transition-all duration-200 ease-in-out
        flex items-center justify-center
        ${isPressed ? "scale-95" : "scale-100"}
        ${className}
      `}
      title="Xabarlar"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default FloatingMessagesButton;
