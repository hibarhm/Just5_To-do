// src/components/Toast.tsx
import { useEffect } from "react";

interface ToastProps {
  message: string;
  duration?: number; // in milliseconds
  onClose: () => void;
}

export default function Toast({ message, duration = 2000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 bg-[#a47376] text-white px-4 py-2 rounded-md shadow-md text-sm z-50 animate-fadeInOut">
      {message}
    </div>
  );
}
