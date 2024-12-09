"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { EventRegisterListResponse, SubmitEventRegister } from "@/types/types";
import { message } from "antd";

const fetchEventRegisterList = async (
  pageParam: number = 1,
  postId: string,
  token: string
): Promise<EventRegisterListResponse> => {
  if (!token) {
    throw new Error("No token provided");
  }
  try {
    // Construct the query string
    const queryString = new URLSearchParams({
      page: pageParam.toString(),
    }).toString();

    // Gửi request với token nếu có, không thì bỏ qua
    const response = await handleAPI(
      `${endpoints.eventRegister.replace(":id", postId)}${
        queryString ? `?${queryString}` : ""
      }`,

      "GET",
      null,
      token // Token chỉ được thêm nếu không null
    );
    console.log("🚀 ~ response:", response);
    return response;
  } catch (error) {
    console.error("Lỗi khi tải chi tiết bài viết:", error);
    throw error;
  }
};

// Custom hook for fetching the blog list
const useEventRegisterList = (
  postId: string,
  page: number,
  refreshKey: number
) => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  // Fetch token only once when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken); // Lưu token nếu có
    };

    fetchToken();
  }, [getToken]);

  return useQuery<EventRegisterListResponse, Error>({
    queryKey: ["eventRegisterList", token, postId, page, refreshKey],
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchEventRegisterList(page, postId, token);
    },
    enabled: !!postId,
    staleTime: 60000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 Duyệt người đăng ký sự kiện
 **/

const SubmitEventRegisterList = async (
  postId: string,
  newDoc: SubmitEventRegister,
  token: string
) => {
  const formData = new FormData();

  for (const key in newDoc) {
    const value = newDoc[key as keyof SubmitEventRegister];

    if (value) {
      // Thêm các trường khác
      formData.append(key, value as string);
    }
  }

  if (!token) throw new Error("No token available");

  try {
    const response = await handleAPI(
      `${endpoints.eventRegister.replace(":id", postId)}`,
      "PATCH",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    // Use 'any' type assertion
    console.error("Error creating docs:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to create event");
  }
};

const useSubmitEventRegisterList = (postId: string) => {
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
    mutationFn: async (newDoc: SubmitEventRegister) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return SubmitEventRegisterList(postId, newDoc, token); // Pass postId here
    },
    onSuccess: () => {
      message.success("Duyệt Đăng Ký Sự Kiện Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["eventRegisterList"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create event.");
    },
  });
};

export { useEventRegisterList, useSubmitEventRegisterList };
