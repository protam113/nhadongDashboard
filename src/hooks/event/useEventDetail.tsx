"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { message } from "antd";
import { EventList, UpdateEvent } from "@/types/types";

const fetchEventDetail = async (
  postId: string,
  token: string // Token là tùy chọn
): Promise<EventList> => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    if (!endpoints.event) {
      throw null;
    }
    // Gửi request với token nếu có, không thì bỏ qua
    const response = await handleAPI(
      `${endpoints.event.replace(":id", postId)}`,
      "GET",
      null,
      token // Token chỉ được thêm nếu không null
    );
    return response;
  } catch (error) {
    console.error("Lỗi khi tải chi tiết bài viết:", error);
    throw error;
  }
};

// Custom hook for fetching the blog list
const useEventDetail = (postId: string) => {
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

  return useQuery<EventList, Error>({
    queryKey: ["eventDetail", token, postId],
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchEventDetail(postId, token);
    }, // Không ép buộc token
    enabled: !!postId,
    staleTime: 60000, // Đặt stale time để không yêu cầu API mỗi lần
    retry: 2, // Retry 2 lần khi gặp lỗi mạng
    refetchOnWindowFocus: false, // Tắt tự động gọi lại khi focus window
  });
};

const UpdateEventDetail = async (
  postId: string,
  updateEvent: UpdateEvent,
  token: string
) => {
  const formData = new FormData();

  for (const key in updateEvent) {
    const value = updateEvent[key as keyof UpdateEvent];

    if (key === "description") {
      // Xử lý content nếu là object hoặc JSON string
      formData.append(key, JSON.stringify(value));
    } else if (key === "image" && typeof value === "string") {
      // Nếu là URL hình ảnh
      formData.append(key, value);
    } else if (key === "image" && Array.isArray(value)) {
      // Nếu là mảng hình ảnh tải lên
      value.forEach((file) => {
        formData.append("image", file);
      });
    } else if (value) {
      // Thêm các trường khác
      formData.append(key, value as string);
    }
  }

  if (!token) throw new Error("No token available");

  try {
    if (!endpoints.event) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.event.replace(":id", postId)}`,
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

const useUpdateEvent = (postId: string) => {
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
    mutationFn: async (updateEvent: UpdateEvent) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return UpdateEventDetail(postId, updateEvent, token);
    },
    onSuccess: () => {
      message.success("Cập Nhật Sự Kiện Thành Công");
      queryClient.invalidateQueries({ queryKey: ["eventList"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create event.");
    },
  });
};

export { useEventDetail, useUpdateEvent };
