// Order status uchun ranglar va matnlar
export const getOrderStatusInfo = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        text: "Kutilmoqda",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    case "IN_WAREHOUSE":
      return {
        text: "Omborda",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
      };
    case "IN_PROCESS":
      return {
        text: "Jarayonda",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    case "IN_BORDER":
      return {
        text: "Chegarada",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      };
    case "IN_CUSTOMS":
      return {
        text: "Bojxonada",
        color: "text-pink-600",
        bgColor: "bg-pink-50",
        borderColor: "border-pink-200",
      };
    case "DONE":
      return {
        text: "Yetkazildi",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    case "CANCELLED":
      return {
        text: "Bekor qilindi",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    default:
      return {
        text: "Noma'lum",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      };
  }
};

// Payment status uchun ranglar va matnlar
export const getPaymentStatusInfo = (status: string) => {
  switch (status) {
    case "PAID":
      return {
        text: "To'landi",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    case "UNPAID":
      return {
        text: "To'lanmagan",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    default:
      return {
        text: "Noma'lum",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      };
  }
};

// Narxni formatlash (sum)
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
};

// Sanani formatlash (faqat sana, vaqt yo'q)

// formatDate: Bugun bo'lsa soat, kecha bo'lsa "kecha", undan oldin bo'lsa sana
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  // Bugunmi?
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  // Kechami?
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    // Faqat soat: 14:23
    return date.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (isYesterday) {
    return "kecha";
  } else {
    // Sana: 01.07.2025
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }
};
