import { useCallback } from "react";

export const useTelegramHaptic = () => {
  // Impact feedback - UI elementlar bosilganda
  const impactFeedback = useCallback(
    (style: "light" | "medium" | "heavy" | "rigid" | "soft" = "light") => {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
      } else {
        // Development modeda console log
        console.log(`🔨 Haptic Impact: ${style}`);
      }
    },
    []
  );

  // Notification feedback - muvaffaqiyat, xato yoki ogohlantirishlar uchun
  const notificationFeedback = useCallback(
    (type: "error" | "success" | "warning") => {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
      } else {
        // Development modeda console log
        console.log(`🔔 Haptic Notification: ${type}`);
      }
    },
    []
  );

  // Selection feedback - tanlash o'zgarganda
  const selectionFeedback = useCallback(() => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    } else {
      // Development modeda console log
      console.log(`✅ Haptic Selection Changed`);
    }
  }, []);

  return {
    impactFeedback,
    notificationFeedback,
    selectionFeedback,
  };
};
