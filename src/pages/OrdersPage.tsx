import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useNavigate, useSearchParams } from "react-router";
import { useGetOrdersQuery } from "../store/api/ordersApi";
import {
  getOrderStatusInfo,
  getPaymentStatusInfo,
  formatPrice,
  formatDate,
} from "../utils/orderUtils";
import { useTelegramHaptic } from "../hooks/useTelegramHaptic";
import { useState, useEffect } from "react";
import FloatingMessagesButton from "../components/FloatingMessagesButton";

const ORDER_STATUSES = [
  { value: undefined, label: "Barchasi" },
  { value: "PENDING", label: "Kutilmoqda" },
  { value: "IN_WAREHOUSE", label: "Omborda" },
  { value: "IN_PROCESS", label: "Tayyor&Yo'lda" },
  { value: "IN_BORDER", label: "Chegarada" },
  { value: "IN_CUSTOMS", label: "Bojxonada" },
  { value: "DONE", label: "Tayyor" },
];

const OrdersPage = () => {
  const navigate = useNavigate();
  const { impactFeedback } = useTelegramHaptic();
  const [searchParams, setSearchParams] = useSearchParams();

  // Statusni searchParams dan olish
  const statusParam = searchParams.get("status");
  const status =
    typeof statusParam === "string"
      ? statusParam === "undefined"
        ? undefined
        : statusParam
      : ORDER_STATUSES[0].value;
  const limit = 10;
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    setOffset(0); // status o'zgarsa, offsetni 0 ga qaytarish
  }, [status]);

  const { data, isLoading, isFetching, error } = useGetOrdersQuery({
    status,
    limit,
    offset,
  });

  const handleOrderClick = (orderId: string) => {
    impactFeedback("light");
    navigate(`/orders/${orderId}`);
  };

  const handleNext = () => {
    setOffset((prev) => prev + limit);
  };
  const handlePrev = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  if (isLoading || isFetching) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Buyurtmalar</h1>
        <div className="mb-4 flex gap-2 overflow-x-auto whitespace-nowrap">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              className={`inline-block px-3 py-1 rounded-full border text-sm ${
                status === s.value ||
                (typeof status === "undefined" &&
                  typeof s.value === "undefined")
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => {
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  if (typeof s.value === "undefined") {
                    params.delete("status");
                  } else {
                    params.set("status", s.value);
                  }
                  return params;
                });
                setOffset(0);
              }}
            >
              {s.label}
            </button>
          ))}
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
        <h1 className="text-2xl font-bold mb-6">Buyurtmalar</h1>
        <div className="mb-4 flex gap-2 overflow-x-auto whitespace-nowrap">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              className={`inline-block px-3 py-1 rounded-full border text-sm ${
                status === s.value ||
                (typeof status === "undefined" &&
                  typeof s.value === "undefined")
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => {
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  if (typeof s.value === "undefined") {
                    params.delete("status");
                  } else {
                    params.set("status", s.value);
                  }
                  return params;
                });
                setOffset(0);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-3">
                Buyurtmalarni yuklashda xatolik yuz berdi
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

  if (!data?.orders || data.orders.length === 0) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Buyurtmalar</h1>
        <div className="mb-4 flex gap-2 overflow-x-auto whitespace-nowrap">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              className={`inline-block px-3 py-1 rounded-full border text-sm ${
                status === s.value ||
                (typeof status === "undefined" &&
                  typeof s.value === "undefined")
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => {
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  if (typeof s.value === "undefined") {
                    params.delete("status");
                  } else {
                    params.set("status", s.value);
                  }
                  return params;
                });
                setOffset(0);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-500 mb-3">
                Hozircha buyurtmalaringiz yo'q
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Buyurtmalar</h1>
        <div className="text-sm text-gray-500">
          Jami: {data?.totalCount ?? 0}
        </div>
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto whitespace-nowrap">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s.value}
            className={`inline-block px-3 py-1 rounded-full border text-sm ${
              status === s.value ||
              (typeof status === "undefined" && typeof s.value === "undefined")
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => {
              setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                if (typeof s.value === "undefined") {
                  params.delete("status");
                } else {
                  params.set("status", s.value);
                }
                return params;
              });
              setOffset(0);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      {isLoading && (
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
      )}
      <div className="space-y-4">
        {data?.orders.map((order) => {
          const statusInfo = getOrderStatusInfo(order.status);
          const paymentInfo = getPaymentStatusInfo(order.paymentStatus);

          return (
            <Card
              key={order._id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleOrderClick(order._id)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-start">
                  <div>
                    <span>Buyurtma #{order.orderNumber}</span>
                    <p className="text-sm text-gray-600 font-normal mt-1">
                      {order.name}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">
                      Buyurtma holati:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor} border ${statusInfo.borderColor}`}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">
                      To'lov holati:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${paymentInfo.color} ${paymentInfo.bgColor} border ${paymentInfo.borderColor}`}
                    >
                      {paymentInfo.text}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Mahsulot:</span>{" "}
                    {order.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Og'irligi:</span>{" "}
                    {order.weight}kg
                  </p>
                  {order.volume != null && order.volume > 0 && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Hajmi:</span> {order.volume}{" "}
                      m³
                    </p>
                  )}
                  {order.quantity != null && order.quantity > 0 && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Soni:</span>{" "}
                      {order.quantity} dona
                    </p>
                  )}
                  {(order.warehouse?.name || order.warehouseId) && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Ombor:</span>{" "}
                      {order.warehouse?.name ?? order.warehouseId}
                    </p>
                  )}
                  {order.warehouseArrivalDate && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">
                        Omborga kelish sanasi:
                      </span>{" "}
                      {formatDate(order.warehouseArrivalDate)}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Narxi:</span>{" "}
                    {formatPrice(order.price)}
                  </p>
                  {order.paidAmount > 0 && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">To'langan:</span>{" "}
                      {formatPrice(order.paidAmount)}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Sotuvchi:</span>{" "}
                    {order.seller?.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Sana:</span>{" "}
                    {formatDate(order.createdAt)}
                  </p>
                  {order.hasComment && (
                    <div className="flex items-center gap-1 mt-2">
                      <svg
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs text-yellow-600">
                        Komment qoldirilgan
                      </span>
                    </div>
                  )}
                  {order.hasChat && (
                    <div className="flex items-center gap-1 mt-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs text-green-600">
                        Chat mavjud
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        impactFeedback("light");
                        navigate(`/payments?orderId=${order._id}`);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
                    >
                      To'lovlar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        impactFeedback("light");
                        navigate(`/messages?orderId=${order._id}`);
                      }}
                      className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full hover:bg-orange-600 transition-colors"
                    >
                      {order.hasChat ? "Xabarlar" : "Chat boshlash"}
                    </button>
                  </div>
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
      <FloatingMessagesButton />
    </div>
  );
};

export default OrdersPage;
