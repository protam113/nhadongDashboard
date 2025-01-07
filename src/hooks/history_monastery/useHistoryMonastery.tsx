"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { HistoryMonasteryResponse, Filters } from "@/types/types";
import { message } from "antd";

const fetchHistoryMonastery = async (
  token: string,
  filters: Filters
): Promise<HistoryMonasteryResponse> => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    // Filter out invalid or undefined filter values
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    );

    // Convert all filter values to strings
    const stringifiedFilters = Object.fromEntries(
      Object.entries(validFilters).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(",") : String(value),
      ])
    );

    // Construct the query string
    const queryString = new URLSearchParams(stringifiedFilters).toString();

    // Make the API request using handleAPI
    const response = await handleAPI(
      `${endpoints.nhaDong}${queryString ? `?${queryString}` : ""}`,
      "GET",
      null,
      token
    );
    return response;
  } catch (error) {
    console.error("Error fetching history list:", error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the queue list
const useHistory = (refreshKey: number, filters: Filters = {}) => {
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

  return useQuery<HistoryMonasteryResponse, Error>({
    queryKey: ["history", token, filters, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchHistoryMonastery(token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000 * 30,
  });
};

interface updateHistory {
  about: string;
}

const CreateBlog = async (
  updateHistory: updateHistory,
  historyId: string,
  token: string
) => {
  const formData = new FormData();

  // Duyệt qua các thuộc tính của `newBlog` và xử lý
  for (const key in updateHistory) {
    const value = updateHistory[key as keyof updateHistory];

    if (value) {
      // Thêm các trường khác
      formData.append(key, value as string);
    }
  }

  if (!token) throw new Error("No token available");

  try {
    // Gửi FormData tới backend
    const response = await handleAPI(
      `${endpoints.nhaDongDetail?.replace(":id", historyId)}`,
      "PATCH",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating blog:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to create blog");
  }
};

const useUpdateHistory = () => {
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
    mutationFn: async ({
      updateHistory,
      historyId,
    }: {
      updateHistory: updateHistory;
      historyId: string;
    }) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateBlog(updateHistory, historyId, token);
    },
    onSuccess: () => {
      message.success("Thông tin về nhà dòng đã được cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["historyDetail"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create blog.");
    },
  });
};

export { useHistory, useUpdateHistory };
