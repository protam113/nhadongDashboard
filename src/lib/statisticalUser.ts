"use client";

import { useStatisticalUser } from "@/hooks/statical/useStatical";

export const StaticalUser = (
  start_day: string ,
  end_day: string ,
  frequency: string,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useStatisticalUser(
    { start_day, end_day ,frequency},
    refreshKey
  );

  const queueData = data || {};

  return {
    queueData,
    isLoading,
    isError,
  };
};