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

  const queueData = data || null;

  return { queueData, isLoading, isError };
};
