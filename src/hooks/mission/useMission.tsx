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
  NewDocs,
  EditDocs,
} from "@/types/types";

const fetchMissionlist = async (
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
      `${endpoints.missions}${queryString ? `?${queryString}` : ""}`,
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
const useMissionList = (
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
    queryKey: ["missionList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchMissionlist(page, token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000,
  });
};

const CreateMission = async (newDoc: NewDocs, token: string) => {
  const formData = new FormData();

  for (const key in newDoc) {
    const value = newDoc[key as keyof NewDocs];

    if (key === "category") {
      // Gửi category là một chuỗi đơn, không cần phải là mảng
      formData.append("category", value as string);
    }
    if (key === "file" && Array.isArray(value)) {
      value.forEach((file) => formData.append("file", file));
    } else if (key === "file_type" && Array.isArray(value)) {
      // Xử lý file
      value.forEach((string) => formData.append("file_type", string));
    } else if (key === "metadata" && Array.isArray(value)) {
      // Xử lý metadata
      value.forEach((string) => formData.append("metadata", string));
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
      `${endpoints.missions}`,
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

const useCreateMission = () => {
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
    mutationFn: async (newDoc: NewDocs) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateMission(newDoc, token);
    },
    onSuccess: () => {
      message.success("Sứ Vụ đã được thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["missionList"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to create docs.");
    },
  });
};

/**
 Xóa Sứ vụ
 **/

const DeleteMission = async (postId: string, token: string) => {
  if (!token) throw new Error("No token available");

  try {
    if (!endpoints.mission) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.mission.replace(":id", postId)}`,
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

const useDeleteMission = () => {
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
      return DeleteMission(postId, token);
    },
    onSuccess: () => {
      message.success("Xóa Bài Viết Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["missionList"] });
    },
    onError: (error: any) => {
      console.error(error.message || "Failed to delete category.");
    },
  });
};

/**
 Sửa Mission
 **/

const EditMission = async (
  editDoc: EditDocs,
  blogId: string,
  token: string
) => {
  const formData = new FormData();

  if (!token) throw new Error("No token available");

  // Duyệt qua các trường trong editBlog
  for (const key in editDoc) {
    const value = editDoc[key as keyof EditDocs];

    if (key === "category") {
      // Nếu là mảng, lấy giá trị đầu tiên; nếu không, giữ nguyên giá trị
      if (typeof value === "string") {
        formData.append("category", value); // Nếu đã là string thì truyền trực tiếp
      }
    }
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
    if (!endpoints.mission) {
      throw null;
    }
    // Gửi API
    const response = await handleAPI(
      `${endpoints.mission.replace(":id", blogId)}`,
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

const useEditMission = () => {
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
      editDoc: EditDocs;
      blogId: string;
    }) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return EditMission(editDoc, blogId, token);
    },
    onSuccess: () => {
      message.success("Sửa Sứ Vụ Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["missionList"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to edit blog.");
    },
  });
};

export { useMissionList, useCreateMission, useDeleteMission, useEditMission };
