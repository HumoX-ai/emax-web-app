import { useState } from "react";
import {
  useGetUserInfoQuery,
  useUpdateUserMutation,
} from "../store/api/userApi";
import UpdateUserForm from "../components/auth/UpdateUserForm";
import { Button } from "../components/ui/button";
import { formatDate } from "../utils/orderUtils";
import { useTelegramHaptic } from "../hooks/useTelegramHaptic";
import { toast } from "sonner";

const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: userInfo, isLoading, error, refetch } = useGetUserInfoQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { impactFeedback } = useTelegramHaptic();

  const handleEditToggle = () => {
    impactFeedback("light");
    setIsEditing(!isEditing);
  };

  const handleUpdateUser = async (values: {
    fullName: string;
    birthday: string;
    gender: string;
  }) => {
    try {
      await updateUser(values).unwrap();
      toast.success("Ma'lumotlar muvaffaqiyatli yangilandi!");
      setIsEditing(false);
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Noma'lum xatolik";
      toast.error("Ma'lumotlarni yangilashda xatolik", {
        description: errorMessage,
      });
    }
  };

  function handleLogout() {
    impactFeedback("light");
    localStorage.removeItem("token");
    window.location.reload();
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-4" />
        <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <span className="text-3xl text-red-400">!</span>
          </div>
          <p className="text-red-600 mb-3 font-medium">
            Profil ma'lumotlarini yuklashda xatolik yuz berdi
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="destructive"
          >
            Qayta urinish
          </Button>
        </div>
      </div>
    );
  }

  const user = userInfo?.data;
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-3xl text-gray-400">?</span>
        </div>
        <p className="text-gray-500">Foydalanuvchi ma'lumotlari topilmadi</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-gradient-to-b from-white to-blue-50">
      {/* Avatar, ism, telefon */}
      <div className="flex flex-col items-center pt-8 pb-4">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mb-2 shadow">
          {getInitials(user.fullName)}
        </div>
        <div className="text-xl font-semibold text-gray-900">
          {user.fullName}
        </div>
        <div className="text-gray-500 text-sm mt-1">{user.phone}</div>
        <Button
          onClick={handleEditToggle}
          variant={isEditing ? "outline" : "secondary"}
          size="sm"
          className="mt-4"
        >
          {isEditing ? "Bekor qilish" : "Tahrirlash"}
        </Button>
      </div>

      {/* Ma'lumotlar yoki tahrirlash formi */}
      <div className="flex-1 w-full max-w-md mx-auto px-4">
        {isEditing ? (
          <div className="mt-2">
            <UpdateUserForm
              defaultValues={{
                fullName: user.fullName,
                birthday: user.birthday.split("T")[0],
                gender: user.gender as "MALE" | "FEMALE",
              }}
              onSubmit={handleUpdateUser}
              loading={isUpdating}
            />
            <div className="mt-4 flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isUpdating}
                onClick={() => {
                  const form = document.querySelector("form");
                  if (form) form.requestSubmit();
                }}
              >
                {isUpdating ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleEditToggle}
                disabled={isUpdating}
              >
                Bekor qilish
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mt-2">
              <div className="rounded-xl bg-white shadow-sm px-5 py-4 flex items-center gap-4">
                <span className="text-gray-400 w-24 text-sm">Jins</span>
                <span className="font-medium text-gray-800">
                  {user.gender === "MALE" ? "Erkak" : "Ayol"}
                </span>
              </div>
              <div className="rounded-xl bg-white shadow-sm px-5 py-4 flex items-center gap-4">
                <span className="text-gray-400 w-24 text-sm">
                  Tug'ilgan sana
                </span>
                <span className="font-medium text-gray-800">
                  {formatDate(user.birthday)}
                </span>
              </div>
              <div className="rounded-xl bg-white shadow-sm px-5 py-4 flex items-center gap-4">
                <span className="text-gray-400 w-24 text-sm">
                  Ro'yxatdan o'tgan
                </span>
                <span className="font-medium text-gray-800">
                  {formatDate(user.createdAt)}
                </span>
              </div>
              {/* {user.sellerId && (
                <div className="rounded-xl bg-white shadow-sm px-5 py-4 flex items-center gap-4">
                  <span className="text-gray-400 w-24 text-sm">
                    Sotuvchi ID
                  </span>
                  <span className="font-mono text-gray-700 text-xs">
                    {user.sellerId}
                  </span>
                </div>
              )} */}
            </div>
            {/* Logout button UX: info bloklardan keyin, markazda, ajratilgan */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLogout}
                className="bg-red-500 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
              >
                Chiqish
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
