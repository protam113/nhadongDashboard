"use client";
import { useHistoryMonastery } from "@/hooks/history_monastery/useHistoryMonastery";
import { HistoryMonasteryResponse } from "@/types/types";

// Đảm bảo đây là client component

export const HistoryMonasteryData = (refreshKey: number): {
  queueData: HistoryMonasteryResponse | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isLoading, isError } = useHistoryMonastery(refreshKey);

  // Nếu `data` không tồn tại, trả về `null` thay vì mảng rỗng
  const queueData = data || null;

  return { queueData, isLoading, isError };
};
