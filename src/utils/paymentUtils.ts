import { formatDate, formatPrice } from "./orderUtils";
import type { Payment } from "../store/api/paymentsApi";

// Payment status uchun ranglar va matnlar
export const getPaymentStatusText = (payment: Payment) => {
  // Hozircha API-da payment status yo'q, shuning uchun amount bo'yicha belgilaymiz
  if (payment.amount > 0) {
    return {
      text: "To'langan",
      color: "text-green-600",
    };
  } else {
    return {
      text: "To'lanmagan",
      color: "text-red-600",
    };
  }
};

// Payment uchun formatlar
export { formatDate, formatPrice };
