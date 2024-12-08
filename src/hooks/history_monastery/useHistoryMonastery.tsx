"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { HistoryMonasteryResponse } from "@/types/types";
import { message } from "antd";

const fetchHistoryMonastery = async (
  token: string
): Promise<HistoryMonasteryResponse> => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    // Make the API request using handleAPI
    const response = await handleAPI(
      `${endpoints.nhaDong}`,
      "GET",
      null,
      token
    );
    return response;
  } catch (error) {
    console.error("Error fetching event list:", error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the queue list
const useHistoryMonastery = (refreshKey: number) => {
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
    queryKey: ["history", token, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchHistoryMonastery(token);
    },
    enabled: isReady && !!token,
    staleTime: 60000 * 30,
  });
};

interface updateHistory {
  about: string;
}

const CreateBlog = async (updateHistory: updateHistory, token: string) => {
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
      `${endpoints.nhaDong}`,
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
    mutationFn: async (updateHistory: updateHistory) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateBlog(updateHistory, token);
    },
    onSuccess: () => {
      message.success("Thông tin về nhà dòng đã được cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create blog.");
    },
  });
};

export { useHistoryMonastery, useUpdateHistory };
