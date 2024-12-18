"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { message } from "antd";
import {EditPost, FetchBLogsListResponse, Filters, NewPost} from "@/types/types";

const fetchNewslist = async (
  pageParam: number = 1,
  token: string,
  filters: Filters
): Promise<FetchBLogsListResponse> => {
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
      `${endpoints.news}${queryString ? `?${queryString}` : ""}`,
      "GET",
      null,
      token
    );
    return response;
  } catch (error) {
    console.error("Error fetching news list:", error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the queue list
const useNewsList = (
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

  return useQuery<FetchBLogsListResponse, Error>({
    queryKey: ["newsList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchNewslist(page, token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000,
  });
};

/**
 Tạo Tin Tức
 **/

const CreateNews = async (newNews: NewPost, token: string) => {
  const formData = new FormData();

  for (const key in newNews) {
    const value = newNews[key as keyof NewPost];

    if (key === "content") {
      // Xử lý content nếu là object hoặc JSON string
      formData.append(key, JSON.stringify(value));
    } else if (key === "category" && Array.isArray(value)) {
      value.forEach((id) => formData.append("category", id)); // Gửi từng ID
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
    const response = await handleAPI(
      `${endpoints.news}`,
      "POST",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    // Use 'any' type assertion
    console.error("Error creating news:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to create news");
  }
};

const useCreateNews = () => {
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
    mutationFn: async (newNews: NewPost) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateNews(newNews, token);
    },
    onSuccess: () => {
      message.success("Tin Tức đã được thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create news.");
    },
  });
};

/**
 Xóa Tin Tức
 **/

const DeleteNews = async (newsId: string, token: string) => {
  if (!token) throw new Error("No token available");

  try {
    if (!endpoints.new) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.new.replace(":id", newsId)}`,
      "DELETE",
      null,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error deleting news:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to delete news");
  }
};

const useDeleteNews = () => {
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
    mutationFn: async (newsId: string) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return DeleteNews(newsId, token);
    },
    onSuccess: () => {
      message.success("Xóa tin tức Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
    },
    onError: (error: any) => {
      console.error(error.message || "Failed to delete news.");
    },
  });
};

/**
 Sửa Tin Tức
 **/

const EditNews = async (editNews: EditPost, blogId: string, token: string) => {
  const formData = new FormData();

  if (!token) throw new Error("No token available");

  // Duyệt qua các trường trong editBlog
  for (const key in editNews) {
    const value = editNews[key as keyof EditPost];

    if (key === "category" && Array.isArray(value)) {
      value.forEach((id) => formData.append("category", id));
    } else if (key === "image") {
      // Xử lý trường image
      if (typeof value === "string") {
        // Nếu là URL, thêm vào formData
        formData.append("image", value); // Thêm URL vào FormData
      } else if (Array.isArray(value)) {
        value.forEach((file) => {
          // Kiểm tra nếu file là đối tượng kiểu File
          if (file instanceof File) {
            formData.append("image", file); // Thêm từng file vào FormData
          }
        });
      }
    } else if (value !== null && value !== undefined) {
      // Thêm các trường khác vào formData
      formData.append(key, value as string);
    }
  }

  try {
    if (!endpoints.new) {
      throw null;
    }
    // Gửi API
    const response = await handleAPI(
        `${endpoints.new.replace(":id", blogId)}`,
        "PATCH",
        formData,
        token
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

const useEditNews = () => {
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
                         editNews,
                         blogId,
                       }: {
      editNews: EditPost;
      blogId: string;
    }) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return EditNews(editNews, blogId, token);
    },
    onSuccess: () => {
      message.success("Sửa Bài Viết Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["newsList"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to edit blog.");
    },
  });
};
export { useNewsList, useCreateNews, useDeleteNews ,useEditNews};
