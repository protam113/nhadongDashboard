"use client";
import { useStatistical } from "@/hooks/statical/useStatical";

export const StaticalData = (
  start_day: string ,
  end_day: string ,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useStatistical(
    { start_day, end_day },
    refreshKey
  );

  const queueData = data || {
    today_views: 0,
    total_views: 0,
    filtered_views: []
  };

  return {
    queueData,
    isLoading,
    isError,
  };
};