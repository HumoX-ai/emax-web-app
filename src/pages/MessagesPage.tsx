import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  useGetMessagesQuery,
  useCreateMessageMutation,
  type Message,
} from "../store/api/messagesApi";
import { useGetOrderByIdQuery } from "../store/api/ordersApi";
import { StartChatModal } from "../components/chat/StartChatModal";
import { useTelegramHaptic } from "../hooks/useTelegramHaptic";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";
import { useSocket } from "../hooks/useSocket";
import { formatDate } from "../utils/orderUtils";

const MessagesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { impactFeedback } = useTelegramHaptic();
  const { isTelegramWebApp } = useTelegramWebApp();
  const [messageText, setMessageText] = useState("");
  const [showStartChatModal, setShowStartChatModal] = useState(false);
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { on, off } = useSocket(true);
  // iOS aniqlash va input focus state
  const isIOS =
    typeof window !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const [isFocused, setIsFocused] = useState(false);

  // Telegram WebApp viewport expand va scroll fix
  useEffect(() => {
    if (isTelegramWebApp && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();

      // Prevent default scroll behavior va layout fix
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";

      // Telegram WebApp specific fixes - REMOVE touchAction: "none" for iOS compatibility
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";

      // iOS specific fixes using setProperty for webkit properties
      document.body.style.setProperty("-webkit-touch-callout", "none");
      document.body.style.setProperty(
        "-webkit-tap-highlight-color",
        "transparent"
      );
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
      document.body.style.height = "unset";
      document.documentElement.style.overflow = "unset";
      document.body.style.userSelect = "unset";
      document.body.style.webkitUserSelect = "unset";
      document.body.style.removeProperty("-webkit-touch-callout");
      document.body.style.removeProperty("-webkit-tap-highlight-color");
    };
  }, [isTelegramWebApp]);

  // Get orderId from URL params or location state
  const urlParams = new URLSearchParams(location.search);
  const orderId =
    urlParams.get("orderId") ||
    (location.state as { orderId?: string })?.orderId;

  // Fetch order data to check hasChat field
  const { data: orderData } = useGetOrderByIdQuery(orderId!, {
    skip: !orderId,
  });

  const {
    data: messagesData,
    isLoading,
    refetch,
  } = useGetMessagesQuery(
    { orderId: orderId!, limit: 100, offset: 0 },
    { skip: !orderId }
  );

  const [createMessage, { isLoading: isSending }] = useCreateMessageMutation();

  // Check if chat exists and show modal if not
  useEffect(() => {
    if (orderId && orderData && !orderData.hasChat) {
      setShowStartChatModal(true);
    }
  }, [orderId, orderData]);

  // Socket event handling for real-time messages
  useEffect(() => {
    if (!orderId) return;

    const handleNewMessage = (data: unknown) => {
      const message = data as Message;
      // Only add message if it belongs to current order
      if (message.orderId === orderId) {
        setRealtimeMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some((msg) => msg._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
        // Auto scroll to bottom when new message arrives
        setTimeout(() => scrollToBottom(), 100);
      }
    };

    // Listen for new messages
    on("newMessage", handleNewMessage);

    // Cleanup
    return () => {
      off("newMessage", handleNewMessage);
    };
  }, [orderId, on, off]);

  // Combine server messages with real-time messages
  const allMessages = [...(messagesData?.messages || []), ...realtimeMessages];

  // Remove duplicates based on message ID
  const uniqueMessages = allMessages
    .filter(
      (message, index, array) =>
        array.findIndex((m) => m._id === message._id) === index
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const handleChatCreated = () => {
    // Clear real-time messages when chat is created
    setRealtimeMessages([]);
    // Refetch order data to update hasChat status
    if (orderData) {
      // Force refresh the order data
      window.location.reload();
    }
  };

  // Auto scroll to bottom when new messages are loaded
  useEffect(() => {
    scrollToBottom();
  }, [uniqueMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !orderId || isSending) return;

    try {
      impactFeedback("light");
      await createMessage({
        orderId,
        text: messageText.trim(),
      }).unwrap();
      setMessageText("");
      // Clear real-time messages since we'll refetch from server
      setRealtimeMessages([]);
      // Refetch messages to get the latest state
      setTimeout(() => refetch(), 100);
    } catch (error) {
      console.error("Error sending message:", error);
      impactFeedback("heavy");
    }
  };

  // Handle button press for iOS compatibility
  const handleButtonPress = () => {
    // Only proceed if not sending and there's message text
    if (!messageText.trim() || isSending) return;

    handleSendMessage();
  };

  // Separate touch handler for iOS
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleButtonPress();
  };

  // Additional touch end handler for better iOS compatibility
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle iOS viewport resize when keyboard appears
  useEffect(() => {
    const handleViewportResize = () => {
      // For iOS, when keyboard appears, auto-scroll to bottom
      if (isTelegramWebApp) {
        setTimeout(() => scrollToBottom(), 100);
      }
    };

    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, [isTelegramWebApp]);

  if (!orderId) {
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
          <h1 className="text-2xl font-bold">Xabarlar</h1>
        </div>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h2 className="text-xl font-bold text-blue-800 mb-2">
                Xabarlar markazi
              </h2>
              <p className="text-blue-600 mb-4">
                Sotuvchilar bilan muloqot qilish uchun avval buyurtmani tanlang
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Buyurtmalarni ko'rish
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  Orqaga qaytish
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 pb-16">
        <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
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
            <h1 className="text-xl font-bold">Xabarlar</h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div
                className={`flex ${
                  i % 2 === 0 ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[70%]">
                  <div className="h-12 bg-gray-200 rounded-2xl mb-1"></div>
                  <div className="h-3 bg-gray-100 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const messages = uniqueMessages;

  return (
    <div className="flex flex-col h-screen bg-gray-50 fixed top-0 left-0 right-0 bottom-0">
      {/* Header - Fixed at top */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
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
          <div>
            <h1 className="text-xl font-bold">Xabarlar</h1>
            {messages.length > 0 && (
              <p className="text-sm text-gray-600">
                Buyurtma #{messages[0].orderNumber} bilan muloqot
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages List - Scrollable area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg font-medium mb-2">Hali xabarlar yo'q</p>
            <p className="text-sm">Birinchi xabaringizni yuboring!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isUserMessage = message.senderType === "USER";
            return (
              <div
                key={message._id}
                className={`flex ${
                  isUserMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${isUserMessage ? "order-1" : ""}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 break-words ${
                      isUserMessage
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {!isUserMessage && (
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        {message.seller?.fullName}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Message attachment"
                        className="mt-2 rounded-lg max-w-full h-auto"
                      />
                    )}
                  </div>
                  <p
                    className={`text-xs text-gray-500 mt-1 ${
                      isUserMessage ? "text-right" : "text-left"
                    }`}
                  >
                    {formatDate(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed at bottom with proper spacing from bottom nav */}
      <div
        className={`bg-white border-t border-gray-200 p-4 flex-shrink-0 mb-16 ${
          isIOS ? "pb-10" : ""
        } ${isFocused && isIOS ? "mb-[230px]" : ""}`}
      >
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Xabar yozing..."
              className="resize-none rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isSending}
              maxLength={1000}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              style={{
                WebkitAppearance: "none",
                fontSize: "16px", // Prevents zoom on iOS
              }}
            />
          </div>
          <button
            onClick={handleButtonPress}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            disabled={!messageText.trim() || isSending}
            className="rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed px-6 py-2.5 text-white font-medium transition-colors touch-manipulation"
            style={{
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            {isSending ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
        {/* <div className="mt-2 text-xs text-gray-500 text-right">
          {messageText.length}/1000
        </div> */}
      </div>

      {/* Start Chat Modal */}
      {orderId && orderData && (
        <StartChatModal
          isOpen={showStartChatModal}
          onClose={() => setShowStartChatModal(false)}
          orderId={orderId}
          orderNumber={orderData.orderNumber}
          onChatCreated={handleChatCreated}
        />
      )}
    </div>
  );
};

export default MessagesPage;
