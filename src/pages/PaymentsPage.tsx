import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useGetPaymentsQuery } from "../store/api/paymentsApi";
import {
  getPaymentStatusText,
  formatPrice,
  formatDate,
} from "../utils/paymentUtils";
import { useTelegramHaptic } from "../hooks/useTelegramHaptic";

const PaymentsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { impactFeedback } = useTelegramHaptic();
  const orderId = searchParams.get("orderId");
  const limit = 10;
  const [offset, setOffset] = useState<number>(0);
  const { data, isLoading, isFetching, error } = useGetPaymentsQuery({
    orderId: orderId || undefined,
    limit,
    offset,
  });

  const handleNext = () => {
    setOffset((prev) => prev + limit);
  };

  const handlePrev = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  if (isLoading || isFetching) {
    return (
      <div className="p-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
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
          <h1 className="text-2xl font-bold">To'lovlar</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
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
          <h1 className="text-2xl font-bold">To'lovlar</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-3">
                To'lovlarni yuklashda xatolik yuz berdi
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Qayta urinish
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.payments || data.payments.length === 0) {
    return (
      <div className="p-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
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
          <h1 className="text-2xl font-bold">To'lovlar</h1>
        </div>
        {!orderId && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">
              To'lovlarni ko'rish uchun buyurtma tanlang yoki URL ga orderId
              parametrini qo'shing.
            </p>
          </div>
        )}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <p className="text-gray-500 mb-3">
                {orderId
                  ? "Bu buyurtma uchun to'lovlar yo'q"
                  : "Hozircha to'lovlaringiz yo'q"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
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
        <h1 className="text-2xl font-bold">To'lovlar</h1>
        <div className="text-sm text-gray-500 ml-auto">
          Jami: {data?.totalCount ?? 0}
        </div>
      </div>

      <div className="space-y-4">
        {data.payments.map((payment) => {
          const statusInfo = getPaymentStatusText(payment);

          return (
            <Card key={payment._id}>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>To'lov #{payment.orderNumber}</span>
                  <span className={`text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Summa:</span>{" "}
                    {formatPrice(payment.amount)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Sana:</span>{" "}
                    {formatDate(payment.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Buyurtma:</span>{" "}
                    {payment.order.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Sotuvchi:</span>{" "}
                    {payment.seller.fullName}
                  </p>
                  {payment.document && (
                    <div className="mt-3 pt-3 border-t">
                      <button
                        onClick={() => {
                          impactFeedback("light");
                          window.open(
                            `https://file.emaxb.uz/api/files?key=${payment.document}`,
                            "_blank"
                          );
                        }}
                        className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            className="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <div className="text-left">
                            <p className="font-medium text-purple-800">
                              To'lov hujjati
                            </p>
                            <p className="text-sm text-purple-600">
                              Hujjatni yuklab olish
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={handlePrev}
          disabled={offset === 0}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Oldingi
        </button>
        <button
          onClick={handleNext}
          disabled={data && offset + limit >= (data.totalCount || 0)}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Keyingi
        </button>
      </div>
    </div>
  );
};

export default PaymentsPage;
