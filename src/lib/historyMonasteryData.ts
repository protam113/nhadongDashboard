"use client";
import { useHistory } from "@/hooks/history_monastery/useHistoryMonastery";

// Đảm bảo đây là client component

export const HistoryMonasteryData = (refreshKey: number,model: string) => {

  const { data, isLoading, isError } = useHistory(refreshKey,{category: [model],});

  const queueData = data || null;

  return { queueData, isLoading, isError };
};
