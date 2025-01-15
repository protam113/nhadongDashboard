"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { message } from "antd";
import {
  FetchDocsListResponse,
  Filters,
  NewMessage,
  EditMessageDetail,
} from "@/types/types";

const fetchMessagelist = async (
  pageParam: number = 1,
  token: string,
  filters: Filters
): Promise<FetchDocsListResponse> => {
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
      `${endpoints.messages}${queryString ? `?${queryString}` : ""}`,
      "GET",
      null,
      token
    );
    return response;
  } catch (error) {
    console.error("Error fetching blogs list:", error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the queue list
const useMessageList = (
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

  return useQuery<FetchDocsListResponse, Error>({
    queryKey: ["messageList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchMessagelist(page, token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000,
  });
};

const CreateMessage = async (newDoc: NewMessage, token: string) => {
  const formData = new FormData();

  for (const key in newDoc) {
    const value = newDoc[key as keyof NewMessage];

    if (key === "image" && typeof value === "string") {
      // Nếu là URL hình ảnh
      formData.append(key, value);
    }
    if (key === "file" && Array.isArray(value)) {
      value.forEach((file) => formData.append("file", file));
    } else if (key === "file_type" && Array.isArray(value)) {
      // Xử lý file
      value.forEach((string) => formData.append("file_type", string));
    } else if (key === "metadata" && Array.isArray(value)) {
      // Xử lý metadata
      value.forEach((string) => formData.append("metadata", string));
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
      `${endpoints.messages}`,
      "POST",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    // Use 'any' type assertion
    console.error("Error creating docs:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to create docs");
  }
};

const useCreateMessage = () => {
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
    mutationFn: async (newDoc: NewMessage) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateMessage(newDoc, token);
    },
    onSuccess: () => {
      message.success("Thư đã được thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to create docs.");
    },
  });
};

/**
   Xóa Sứ vụ
   **/

const DeleteMessage = async (postId: string, token: string) => {
  if (!token) throw new Error("No token available");

  try {
    if (!endpoints.message) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.message.replace(":id", postId)}`,
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

const useDeleteMessage = () => {
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
    mutationFn: async (postId: string) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return DeleteMessage(postId, token);
    },
    onSuccess: () => {
      message.success("Xóa Bài Viết Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    },
    onError: (error: any) => {
      console.error(error.message || "Failed to delete category.");
    },
  });
};

const EditMessage = async (
  editDoc: EditMessageDetail,
  blogId: string,
  token: string
) => {
  const formData = new FormData();

  if (!token) throw new Error("No token available");

  // Duyệt qua các trường trong editBlog
  for (const key in editDoc) {
    const value = editDoc[key as keyof EditMessageDetail];

    if (key === "file" && Array.isArray(value)) {
      value.forEach((file) => formData.append("file", file));
    } else if (key === "file_type" && Array.isArray(value)) {
      // Xử lý file
      value.forEach((string) => formData.append("file_type", string));
    } else if (key === "metadata" && Array.isArray(value)) {
      // Xử lý metadata
      value.forEach((string) => formData.append("metadata", string));
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
    if (!endpoints.message) {
      throw null;
    }
    // Gửi API
    const response = await handleAPI(
      `${endpoints.message.replace(":id", blogId)}`,
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

const useEditMessage = () => {
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
      editDoc,
      blogId,
    }: {
      editDoc: EditMessageDetail;
      blogId: string;
    }) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return EditMessage(editDoc, blogId, token);
    },
    onSuccess: () => {
      message.success("Sửa Bài Viết Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to edit blog.");
    },
  });
};

export { useMessageList, useCreateMessage, useDeleteMessage, useEditMessage };
