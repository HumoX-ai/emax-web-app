import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router"; // Make sure react-router-dom is installed
import { useAppSelector } from "../store/hooks";
import BottomNavigation from "../components/BottomNavigation";
import FallbackBackButton from "../components/FallbackBackButton";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";
import { useTelegramBackButton } from "../hooks/useTelegramBackButton";

interface ProtectedLayoutProps {
  children?: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Telegram WebApp-ni initialize qilish
  useTelegramWebApp();

  // Telegram BackButton-ni boshqarish
  useTelegramBackButton();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If children are provided, render them; otherwise, render nested routes
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <FallbackBackButton />
      <main className="flex-1 flex flex-col items-center w-full pb-20 pt-2">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          {children ? <>{children}</> : <Outlet />}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default ProtectedLayout;
