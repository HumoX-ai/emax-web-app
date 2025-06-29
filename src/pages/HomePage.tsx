import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useTelegramHaptic } from "../hooks/useTelegramHaptic";
import { useGetOrdersQuery } from "../store/api/ordersApi";
import FloatingMessagesButton from "../components/FloatingMessagesButton";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  const { impactFeedback } = useTelegramHaptic();
  const { data: ordersData } = useGetOrdersQuery({});

  // Buyurtmalar statistikasini hisoblash
  const activeOrders =
    ordersData?.orders?.filter((order) =>
      ["PENDING", "IN_PROCESS", "IN_BORDER", "DONE"].includes(order.status)
    ).length || 0;

  const completedOrders =
    ordersData?.orders?.filter((order) => order.status === "DONE").length || 0;

  const handleActiveOrdersClick = () => {
    impactFeedback("light");
    // Barcha buyurtmalar uchun status parametrsiz navigate qilish
    navigate("/orders");
  };

  const handleCompletedOrdersClick = () => {
    impactFeedback("light");
    // Yakunlangan buyurtmalar uchun status=\"DONE\" bilan navigate qilish
    navigate("/orders?status=DONE");
  };

  const handleHelp = () => {
    // Light impact for secondary actions
    impactFeedback("light");
    // Bu yerda yordam sahifasiga o'tish logikasi bo'ladi
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Bosh sahifa</h1>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Xush kelibsiz!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Logistika ilovamizga xush kelibsiz. Bu yerda siz o'z
              buyurtmalaringizni kuzatishingiz, to'lovlar tarixini ko'rishingiz
              va sharxlar qoldirishingiz mumkin.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleActiveOrdersClick}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                <h3 className="font-medium text-sm">Barcha buyurtmalar</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {activeOrders}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleCompletedOrdersClick}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-sm">Yakunlangan buyurtmalar</h3>
                <p className="text-2xl font-bold text-green-600">
                  {completedOrders}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tezkor havolalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={handleHelp}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Yordam markazi
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      <FloatingMessagesButton />
    </div>
  );
};

export default HomePage;
