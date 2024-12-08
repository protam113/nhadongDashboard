"use client";
import { useScheduleList } from "@/hooks/schedule/useSchedule";

// Sửa lại ScheduleList để truyền đúng tham số year và month
export const ScheduleList = ({ year, month, refreshKey }: { year: number; month: number; refreshKey: number }) => {
    const { data, isLoading, isError } = useScheduleList(
      { year: year, month: month }, // Truyền year và month đúng vào đây
      refreshKey
    );
  
    const queueData = data?.results || [];
    console.log("🚀 ~ queueData:", queueData);
  
    return { queueData, isLoading, isError };
  };
  