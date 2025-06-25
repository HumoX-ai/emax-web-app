import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router";
import { useTelegramHaptic } from "../hooks/useTelegramHaptic";
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
} from "../store/api/commentsApi";
import { useGetOrdersQuery } from "../store/api/ordersApi";
import { formatDate } from "../utils/orderUtils";
import { toast } from "sonner";

const CommentsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [newComment, setNewComment] = useState({ text: "", stars: 5 });

  const { impactFeedback } = useTelegramHaptic();

  // URL dan orderId olish (OrderDetailsPage dan kelganda)
  const orderIdFromState = location.state?.orderId;
  const orderIdFromParams = searchParams.get("orderId");
  const filterOrderId = orderIdFromState || orderIdFromParams;

  // Comments olish
  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
  } = useGetCommentsQuery({
    orderId: filterOrderId || undefined,
    limit: 20,
    offset: 0,
  });

  // Orders olish (dropdown uchun)
  const { data: ordersData } = useGetOrdersQuery({
    limit: 100,
    offset: 0,
  });

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();

  // Agar ma'lum bir buyurtma uchun komment yozilayotgan bo'lsa, uni avtomatik tanlash
  useEffect(() => {
    if (filterOrderId && isDialogOpen) {
      setSelectedOrderId(filterOrderId);
    }
  }, [filterOrderId, isDialogOpen]);

  const handleWriteComment = () => {
    impactFeedback("medium");
    setIsDialogOpen(true);
  };

  const handleSubmitComment = async () => {
    if (!selectedOrderId || !newComment.text.trim()) {
      toast.error("Buyurtma va komment matni majburiy!");
      return;
    }

    try {
      await createComment({
        orderId: selectedOrderId,
        stars: newComment.stars,
        text: newComment.text.trim(),
      }).unwrap();

      toast.success("Komment muvaffaqiyatli qo'shildi!");
      setIsDialogOpen(false);
      setNewComment({ text: "", stars: 5 });
      setSelectedOrderId("");
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Noma'lum xatolik";
      toast.error("Komment qo'shishda xatolik", {
        description: errorMessage,
      });
    }
  };

  const renderStars = (
    count: number,
    interactive = false,
    onStarClick?: (star: number) => void
  ) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onStarClick?.(star)}
            className={`text-lg ${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : ""
            } ${star <= count ? "text-yellow-500" : "text-gray-300"}`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (commentsLoading) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">
          {filterOrderId ? "Buyurtma sharxlari" : "Barcha sharxlar"}
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (commentsError) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">sharxlar</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-3">
                sharxlarni yuklashda xatolik yuz berdi
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="destructive"
              >
                Qayta urinish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const comments = commentsData?.comments || [];

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        {filterOrderId && (
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
        )}
        <div className="flex justify-between items-center flex-1">
          <h1 className="text-2xl font-bold">
            {filterOrderId ? "" : "Barcha sharxlar"}
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleWriteComment}>Komment yozish</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Yangi komment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Buyurtmani tanlang
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedOrderId(e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    disabled={!!filterOrderId}
                  >
                    <option value="">Buyurtmani tanlang</option>
                    {ordersData?.orders.map((order) => (
                      <option key={order._id} value={order._id}>
                        #{order.orderNumber} - {order.name}
                      </option>
                    ))}
                  </select>
                  {filterOrderId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Buyurtma avtomatik tanlangan
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Baho ({newComment.stars}/5)
                  </label>
                  {renderStars(newComment.stars, true, (star) =>
                    setNewComment((prev) => ({ ...prev, stars: star }))
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Komment matni
                  </label>
                  <Textarea
                    value={newComment.text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewComment((prev) => ({
                        ...prev,
                        text: e.target.value,
                      }))
                    }
                    placeholder="Sizning fikringiz..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={
                      isCreating || !selectedOrderId || !newComment.text.trim()
                    }
                    className="flex-1"
                  >
                    {isCreating ? "Yuborilmoqda..." : "Yuborish"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Bekor qilish
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-500 mb-3">
                  {filterOrderId
                    ? "Bu buyurtma uchun hali komment yo'q"
                    : "Hali sharxlar yo'q"}
                </p>
                <Button onClick={handleWriteComment} variant="outline">
                  Birinchi kommentni qoldiring
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment._id}>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-start">
                  <div>
                    <span>Buyurtma #{comment.orderNumber}</span>
                    <p className="text-sm text-gray-600 font-normal mt-1">
                      {comment.user.fullName} tomonidan
                    </p>
                  </div>
                  {renderStars(comment.stars)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{comment.text}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
