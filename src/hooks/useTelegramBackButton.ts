import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

export const useTelegramBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Telegram WebApp mavjudligini tekshirish
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Back button handler
      const handleBackButton = () => {
        // Haptic feedback for back button
        if (tg.HapticFeedback) {
          tg.HapticFeedback.impactOccurred("light");
        }

        // Agar bosh sahifada bo'lsa, Telegram app-ni yopish
        if (location.pathname === "/") {
          tg.close();
        } else {
          // Boshqa sahifalarda bir qadam orqaga qaytish
          navigate(-1);
        }
      };

      // Back button ko'rsatish/yashirish logikasi
      if (location.pathname === "/") {
        // Bosh sahifada yashirish
        tg.BackButton.hide();
      } else {
        // Boshqa sahifalarda ko'rsatish
        tg.BackButton.show();
        tg.BackButton.onClick(handleBackButton);
      }

      // Cleanup function
      return () => {
        tg.BackButton.offClick(handleBackButton);
        tg.BackButton.hide();
      };
    }
  }, [location.pathname, navigate]);

  // Manual back button function (fallback uchun)
  const goBack = () => {
    if (location.pathname === "/") {
      // Agar Telegram mavjud bo'lsa, app-ni yopish
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
      }
    } else {
      navigate(-1);
    }
  };

  return {
    goBack,
    isHomePage: location.pathname === "/",
  };
};
