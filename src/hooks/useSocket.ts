import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (enabled: boolean = true) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize socket connection
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("[Socket] No token found in localStorage");
      return;
    }

    console.log("[Socket] Connecting to:", import.meta.env.VITE_API_URL);
    const socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected. Reason:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err);
    });

    socket.on("error", (error) => {
      console.error("[Socket] Error event:", error);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`[Socket] Reconnect attempt #${attempt}`);
    });

    socket.io.on("reconnect", (attempt) => {
      console.log(`[Socket] Reconnected after ${attempt} attempts`);
    });

    socket.io.on("reconnect_error", (err) => {
      console.error("[Socket] Reconnect error:", err);
    });

    socket.io.on("reconnect_failed", () => {
      console.error("[Socket] Reconnect failed");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      console.log("[Socket] Cleanup: Disconnected");
    };
  }, [enabled]);

  const emit = (event: string, data: unknown) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, handler: (data: unknown) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  };

  const off = (event: string, handler?: (data: unknown) => void) => {
    if (socketRef.current) {
      if (handler) {
        socketRef.current.off(event, handler);
      } else {
        socketRef.current.off(event);
      }
    }
  };

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
  };
};
