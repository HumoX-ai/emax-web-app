import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useCreateChatMutation } from "../../store/api/chatsApi";
import { useTelegramHaptic } from "../../hooks/useTelegramHaptic";

interface StartChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: number;
  onChatCreated: () => void;
}

export const StartChatModal = ({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  onChatCreated,
}: StartChatModalProps) => {
  const [createChat, { isLoading }] = useCreateChatMutation();
  const { impactFeedback } = useTelegramHaptic();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateChat = async () => {
    try {
      setIsCreating(true);
      impactFeedback("light");

      await createChat({ orderId }).unwrap();

      impactFeedback("light");
      onChatCreated();
      onClose();
    } catch (error) {
      console.error("Error creating chat:", error);
      impactFeedback("heavy");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    impactFeedback("light");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Chat boshlash</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-500"
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
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Buyurtma #{orderNumber} uchun chat boshlash
            </h3>
            <p className="text-gray-600 text-sm">
              Sotuvchi bilan muloqot qilish uchun chatni boshlashingiz kerak.
              Chat boshlangandan so'ng xabar almashinuvni boshlay olasiz.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isCreating}
              className="flex-1"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleCreateChat}
              disabled={isLoading || isCreating}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
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
                  <span>Yaratilmoqda...</span>
                </div>
              ) : (
                "Chat boshlash"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
