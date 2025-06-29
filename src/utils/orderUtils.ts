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
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
