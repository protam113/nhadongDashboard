"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { FetchMediaVideoResponse, NewVideo, EditVideo } from "@/types/types";
import { message } from "antd";

/*
        Hooks lấy danh sách tài liệu
    */

const fetchVideoList = async (
  pageParam: number = 1,
  token?: string
): Promise<FetchMediaVideoResponse> => {
  try {
    const queryString = new URLSearchParams({
      page: pageParam.toString(),
    }).toString();

    const response = await handleAPI(
      `${endpoints.videos}${queryString ? `?${queryString}` : ""}`,
      "GET",
      null,
      token || null
    );

    // Đảm bảo trả về đúng cấu trúc mà VideoList sử dụng
    return {
      data: response, // Giả sử API trả về mảng trực tiếp, không cần dùng `data` nếu API trả về mảng
    };
  } catch (error) {
    console.error("Error fetching gallery list:", error);
    throw error;
  }
};

// Custom hook for fetching the queue list
const useVideoList = (page: number, refreshKey: number) => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };

    fetchToken();
  }, [getToken]);

  return useQuery<FetchMediaVideoResponse, Error>({
    queryKey: ["videoList", page, token, refreshKey],
    queryFn: async () => {
      return fetchVideoList(page, token || undefined);
    },

    staleTime: 60000,
  });
};

/** 
 Tạo Video
**/

const CreateVideo = async (newVideo: NewVideo, token: string) => {
  const formData = new FormData();

  for (const key in newVideo) {
    const value = newVideo[key as keyof NewVideo];

    if (key === "image" && typeof value === "string") {
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
    const response = await handleAPI(
      `${endpoints.videos}`,
      "POST",
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

const useCreateVideo = () => {
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
    mutationFn: async (newVideo: NewVideo) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateVideo(newVideo, token);
    },
    onSuccess: () => {
      message.success("Thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["videoList"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create event.");
    },
  });
};

const EditVideoDetail = async (
  editVideo: EditVideo,
  videoId: string,
  token: string
) => {
  const formData = new FormData();

  if (!token) throw new Error("No token available");

  for (const key in editVideo) {
    if (Object.prototype.hasOwnProperty.call(editVideo, key)) {
      const value = editVideo[key as keyof EditVideo];

      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value instanceof File) {
        formData.append(key, value); // Đây là nơi bạn gửi tệp thực tế
      } else if (typeof value === "string") {
        formData.append(key, value);
      }
    }
  }

  try {
    if (!endpoints.video) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.video.replace(":id", videoId)}`,
      "PATCH",
      formData, // Gửi formData trong body request
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error editing category:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to edit category");
  }
};

const useEditVideo = () => {
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
      editVideo,
      videoId,
    }: {
      editVideo: EditVideo;
      videoId: string;
    }) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return EditVideoDetail(editVideo, videoId, token);
    },
    onSuccess: () => {
      message.success("Sửa Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["videoList"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to edit category.");
    },
  });
};

/**
 Xóa Thể Loại
 **/

const DeleteVideo = async (videoId: string, token: string) => {
  if (!token) throw new Error("No token available");

  try {
    if (!endpoints.video) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.video.replace(":id", videoId)}`,
      "DELETE",
      null,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error deleting category:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to delete category"
    );
  }
};

const useDeleteVideo = () => {
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
    mutationFn: async (videoId: string) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return DeleteVideo(videoId, token);
    },
    onSuccess: () => {
      message.success("Xóa Thể Loại Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["videoList"] });
    },
    onError: (error: any) => {
      console.error(error.message || "Failed to delete category.");
    },
  });
};

export { useVideoList, useCreateVideo, useEditVideo, useDeleteVideo };
