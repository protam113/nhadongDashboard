import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { ScheduleList, Filters, CreateSchedule } from "@/types/types";

// Hàm fetch dữ liệu lịch
const fetchScheduleList = async (
  token: string,
  filters: Filters
): Promise<ScheduleList> => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    // Lọc bỏ các giá trị không hợp lệ
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([value]) => value !== undefined && value !== "" // Bỏ qua key
      )
    );

    // Chuyển các giá trị thành chuỗi cho URLSearchParams
    const stringifiedFilters = Object.fromEntries(
      Object.entries(validFilters).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(",") : String(value),
      ])
    );

    // Tạo chuỗi query
    const queryString = new URLSearchParams(stringifiedFilters).toString();

    // Gọi API
    const response = await handleAPI(
      `${endpoints.schedules}${queryString ? `?${queryString}` : ""}`,
      "GET",
      null,
      token
    );

    return response;
  } catch (error) {
    console.error("Error fetching schedule list:", error);
    throw error;
  }
};

// Custom hook để lấy dữ liệu lịch
const useScheduleList = (filters: Filters = {}, refreshKey: number) => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
      setIsReady(true);
    };
    fetchToken();
  }, [getToken]);

  return useQuery<ScheduleList, Error>({
    queryKey: ["scheduleList", token, filters, refreshKey],
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchScheduleList(token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000,
  });
};

const CreateScheduleItem = async (
  scheduleId: string,
  newSchedule: CreateSchedule,
  token: string
) => {
  const formData = new FormData();

  for (const key in newSchedule) {
    if (Object.prototype.hasOwnProperty.call(newSchedule, key)) {
      const value = newSchedule[key as keyof CreateSchedule];

      if (typeof value === "string") {
        // If the value is a string, append to FormData
        formData.append(key, value);
      }
    }
  }

  if (!token) throw new Error("No token available");

  try {
    const response = await handleAPI(
      `${endpoints.schedule.replace(":id", scheduleId)}`,
      "POST",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating category:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to create category"
    );
  }
};

const useCreateSchedule = (scheduleId: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };
    fetchToken();
  }, [getToken]);

  return useMutation({
    mutationFn: async (newSchedule: CreateSchedule) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateScheduleItem(scheduleId, newSchedule, token);
    },
    onSuccess: () => {
      console.log("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categoriesList"] });
    },
    onError: (error: any) => {
      console.error(error.message || "Failed to create category.");
    },
  });
};

export { useScheduleList, useCreateSchedule };
