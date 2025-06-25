import { useEffect } from "react";

export const useTelegramWebApp = () => {
  useEffect(() => {
    // Telegram WebApp-ni initialize qilish
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // WebApp-ni ready holatiga keltirish
      tg.ready();

      // App-ni expand qilish (to'liq ekranga)
      tg.expand();

      tg.isVerticalSwipesEnabled = false;

      // Header va background ranglarini sozlash
      if (tg.headerColor !== "#ffffff") {
        tg.headerColor = "#ffffff";
      }

      if (tg.backgroundColor !== "#ffffff") {
        tg.backgroundColor = "#ffffff";
      }
    }
  }, []);

  // Telegram WebApp mavjudligini tekshirish
  const isTelegramWebApp = () => {
    return typeof window !== "undefined" && window.Telegram?.WebApp;
  };

  // Telegram WebApp ma'lumotlarini olish
  const getTelegramData = () => {
    if (isTelegramWebApp()) {
      return {
        platform: window.Telegram.WebApp.platform,
        version: window.Telegram.WebApp.version,
        isExpanded: window.Telegram.WebApp.isExpanded,
        viewportHeight: window.Telegram.WebApp.viewportHeight,
        viewportStableHeight: window.Telegram.WebApp.viewportStableHeight,
      };
    }
    return null;
  };

  return {
    isTelegramWebApp: isTelegramWebApp(),
    telegramData: getTelegramData(),
  };
};
