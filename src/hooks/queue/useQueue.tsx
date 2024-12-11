"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { Filters, FetchQueueListResponse } from "@/types/types";

const fetchQueueList = async (
  pageParam: number = 1,
  token: string,
  filters: Filters
): Promise<FetchQueueListResponse> => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    // Filter out undefined or empty values from filters
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== ""
      )
    );

    // Construct the query string
    const queryString = new URLSearchParams({
      page: pageParam.toString(),
      ...validFilters, // Merge the valid filters into the query string
    }).toString();

    // Make the API request using handleAPI
    const response = await handleAPI(
      `${endpoints.queues}${queryString ? `?${queryString}` : ""}`,
      "GET",
      null,
      token
    );
    return response;
  } catch (error) {
    console.error("Error fetching queue list:", error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the queue list
const useQueueList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
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

  return useQuery<FetchQueueListResponse, Error>({
    queryKey: ["queueList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchQueueList(page, token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000,
  });
};

interface BrowseQueue {
  [key: string]: any; // Hoặc bạn có thể định nghĩa các trường cụ thể mà bạn cần
}

const CreateBrowseQueue = async (browseManager: BrowseQueue, token: string) => {
  const formData = new FormData();

  // Duyệt qua các trường trong browseManager
  for (const key in browseManager) {
    const value = browseManager[key];
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else {
      formData.append(key, value);
    }
  }
  // Nếu không có token, ném lỗi
  if (!token) throw new Error("No token available");

  try {
    // Gửi yêu cầu POST với formData
    const response = await handleAPI(
      `${endpoints.queueApprove}`,
      "POST",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error browse queue:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to browse queue");
  }
};

const useBrowseQueue = () => {
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
    mutationFn: async (browseManager: BrowseQueue) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateBrowseQueue(browseManager, token);
    },
    onSuccess: () => {
      console.log("duyệt hàng đợi thành công");
      queryClient.invalidateQueries({ queryKey: ["queueList"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to browse queue.");
    },
  });
};

export { useQueueList, useBrowseQueue };
