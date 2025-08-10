import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useGetOrderByIdQuery } from "../store/api/ordersApi";
import { useGetCommentsQuery } from "../store/api/commentsApi";
import {
  getOrderStatusInfo,
  getPaymentStatusInfo,
  formatPrice,
  formatDate,
} from "../utils/orderUtils";
import { useTelegramHaptic } from "../hooks/useTelegramHaptic";

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(id!);
  const { data: commentsData, isLoading: commentsLoading } =
    useGetCommentsQuery({
      orderId: id!,
      limit: 3, // Show only first 3 comments as preview
      offset: 0,
    });
  const { impactFeedback } = useTelegramHaptic();

  const handleCommentClick = () => {
    impactFeedback("light");
    // Comments sahifasiga o'tish
    navigate("/comments", { state: { orderId: id } });
  };

  const handlePaymentsClick = () => {
    impactFeedback("light");
    // Payments sahifasiga o'tish
    navigate(`/payments?orderId=${id}`);
  };

  const handleMessagesClick = () => {
    impactFeedback("light");
    // Messages sahifasiga o'tish
    navigate(`/messages?orderId=${id}`);
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= count ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <Card className="mb-4">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-40 bg-gray-200 rounded-lg w-full max-w-sm"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Buyurtma ma'lumotlari</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-3">
                Buyurtma ma'lumotlarini yuklashda xatolik yuz berdi
              </p>
              <button
                onClick={() => navigate(-1)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Orqaga qaytish
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Buyurtma ma'lumotlari</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 mb-3">Buyurtma topilmadi</p>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                Orqaga qaytish
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getOrderStatusInfo(order.status);
  const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
  const remainingAmount = order.price - order.paidAmount;

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
        <h1 className="text-2xl font-bold">Buyurtma #{order.orderNumber}</h1>
      </div>

      {/* Asosiy ma'lumotlar */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-start">
            <div>
              <span className="text-lg">{order.name}</span>
              <p className="text-sm text-gray-600 font-normal mt-1">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Buyurtma holati:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor} border ${statusInfo.borderColor}`}
              >
                {statusInfo.text}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">To'lov holati:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${paymentInfo.color} ${paymentInfo.bgColor} border ${paymentInfo.borderColor}`}
              >
                {paymentInfo.text}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Yuk rasmi va ma’lumotlari
              </h3>
              {order.photo && (
                <div className="mb-3">
                  <img
                    src={`https://file.emaxb.uz/api/files?key=${order.photo}`}
                    alt={order.name}
                    className="w-full max-w-sm rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                    onClick={() => {
                      impactFeedback("light");
                      window.open(
                        `https://file.emaxb.uz/api/files?key=${order.photo}`,
                        "_blank"
                      );
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Bosib kattaroq ko'rish
                  </p>
                </div>
              )}
              <p className="text-gray-600 mb-2">{order.description}</p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Og'irligi:</span> {order.weight}kg
              </p>
              {order.volume != null && order.volume > 0 && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Hajmi:</span> {order.volume} m³
                </p>
              )}
              {order.quantity != null && order.quantity > 0 && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Soni:</span> {order.quantity}{" "}
                  dona
                </p>
              )}
              {(order.warehouse?.name ||
                order.warehouseId ||
                order.warehouseArrivalDate) && (
                <div className="mt-3 p-3 bg-gray-50 border rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Ombor ma'lumotlari
                  </h4>
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
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Moliyaviy ma'lumotlar
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Umumiy narx:</span>
                  <span className="font-semibold">
                    {formatPrice(order.price)}
                  </span>
                </div>
                {order.paidAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">To'langan:</span>
                    <span className="text-green-600 font-semibold">
                      {formatPrice(order.paidAmount)}
                    </span>
                  </div>
                )}
                {remainingAmount > 0 && (
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Qoldiq:</span>
                    <span className="text-red-600 font-semibold">
                      {formatPrice(remainingAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {order.seller && order.seller && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Sotuvchi ma'lumotlari
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Ismi:</span>{" "}
                    {order.seller.fullName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Telefon:</span>{" "}
                    {order.seller.phone}
                  </p>
                  {order.seller.about && (
                    <p className="text-gray-600">
                      <span className="font-medium">Haqida:</span>{" "}
                      {order.seller.about}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sharh va harakatlar */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Harakatlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.status === "DONE" && (
              <button
                onClick={handleCommentClick}
                className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium text-blue-800">
                      {order.hasComment
                        ? "Sharhlarni ko'rish"
                        : "Sharh qoldirish"}
                    </p>
                    <p className="text-sm text-blue-600">
                      {order.hasComment
                        ? "Mavjud sharhlarni ko'ring"
                        : "Buyurtma haqida fikr bildiring"}
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={handleMessagesClick}
              className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <div className="text-left">
                  <p className="font-medium text-orange-800">
                    {order.hasChat ? "Xabarlar" : "Chat boshlash"}
                  </p>
                  <p className="text-sm text-orange-600">
                    {order.hasChat
                      ? "Sotuvchi bilan muloqot qiling"
                      : "Sotuvchi bilan chat boshlang"}
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button
              onClick={handlePaymentsClick}
              className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <div className="text-left">
                  <p className="font-medium text-green-800">
                    To'lovlarni ko'rish
                  </p>
                  <p className="text-sm text-green-600">
                    Buyurtma to'lovlarini ko'ring
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {order.contractFile && (
              <button
                onClick={() => {
                  impactFeedback("light");
                  window.open(
                    `https://file.emaxb.uz/api/files?key=${order.contractFile}`,
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
                      Shartnoma fayli
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
            )}
            {order.infoFile && (
              <button
                onClick={() => {
                  impactFeedback("light");
                  window.open(
                    `https://file.emaxb.uz/api/files?key=${order.infoFile}`,
                    "_blank"
                  );
                }}
                className="w-full flex items-center justify-between p-3 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors border border-cyan-200"
              >
                <div className="flex items-center gap-3">
                  {/* New SVG icon */}
                  <svg
                    className="w-5 h-5 text-cyan-600"
                    fill="none"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M14,9 C14.5523,9 15,9.44772 15,10 L15,13 C15,14.1046 14.1046,15 13,15 L3,15 C1.89543,15 1,14.1046 1,13 L1,10 C1,9.44772 1.44772,9 2,9 C2.55228,9 3,9.44771 3,10 L3,13 L13,13 L13,10 C13,9.44771 13.4477,9 14,9 Z M8,1 C8.55228,1 9,1.44772 9,2 L9,6.58579 L10.2929,5.29289 C10.6834,4.90237 11.3166,4.90237 11.7071,5.29289 C12.0976,5.68342 12.0976,6.31658 11.7071,6.70711 L8,10.4142 L4.29289,6.70711 C3.90237,6.31658 3.90237,5.68342 4.29289,5.29289 C4.68342,4.90237 5.31658,4.90237 5.70711,5.29289 L7,6.58579 L7,2 C7,1.44772 7.44772,1 8,1 Z"
                    />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium text-cyan-800">
                      Qo'shimcha ma'lumotlar
                    </p>
                    <p className="text-sm text-cyan-600">Faylni yuklab olish</p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-cyan-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h1v-4h1"
                  />
                </svg>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sharhlar preview */}
      {!commentsLoading && commentsData && commentsData.comments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Oxirgi sharhlar</span>
              <span className="text-sm font-normal text-gray-500">
                {commentsData.totalCount} ta sharh
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commentsData.comments.slice(0, 2).map((comment) => (
                <div
                  key={comment._id}
                  className="p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {comment.user.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    {renderStars(comment.stars)}
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}

              {commentsData.totalCount > 2 && (
                <button
                  onClick={handleCommentClick}
                  className="w-full text-center text-blue-600 text-sm font-medium py-2 hover:text-blue-700 transition-colors"
                >
                  Barcha {commentsData.totalCount} ta sharhni ko'rish
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderDetailsPage;
