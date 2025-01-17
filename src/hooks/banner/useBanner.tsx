"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import {
  FetchBannerListResponse,
  Filters,
  BannerCreate,
  BannerEdit,
} from "@/types/types";
import { message } from "antd";

/*
        Hooks lấy danh sách tài liệu
    */

const fetchBannerList = async (
  filters: Filters,
  pageParam: number = 1,
  token: string
): Promise<FetchBannerListResponse> => {
  try {
    // Filter out undefined or empty values from filters
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([, value]) => value !== undefined && value !== "" && value !== null
      )
    );

    // Construct the query string
    const queryString = new URLSearchParams({
      page: pageParam.toString(),
      ...validFilters, // Merge the valid filters into the query string
    }).toString();

    // Make the API request using handleAPI
    const response = await handleAPI(
      `${endpoints.banners}${queryString ? `?${queryString}` : ""}`,
      "GET",
      null,
      token
    );
    return response;
  } catch (error) {
    console.error("Error fetching document list:", error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the queue list
const useBanner = (page: number, filters: Filters = {}, refreshKey: number) => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };

    fetchToken();
  }, [getToken]);

  return useQuery<FetchBannerListResponse, Error>({
    queryKey: ["bannerList", filters, page, token, refreshKey],
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchBannerList(filters, page, token);
    },

    staleTime: 60000,
  });
};

const CreateBanner = async (newBanner: BannerCreate, token: string) => {
  const formData = new FormData();

  // Duyệt qua các thuộc tính của `newBlog` và xử lý
  for (const key in newBanner) {
    if (Object.prototype.hasOwnProperty.call(newBanner, key)) {
      const value = newBanner[key as keyof BannerCreate];

      if (Array.isArray(value)) {
        // If the value is an array, append each element
        value.forEach((v) => formData.append(key, v));
      } else if (value instanceof File) {
        // If the value is a File, append to FormData
        formData.append(key, value);
      } else if (typeof value === "string") {
        // If the value is a string, append to FormData
        formData.append(key, value);
      }
    }
  }

  if (!token) throw new Error("No token available");

  try {
    // Gửi FormData tới backend
    const response = await handleAPI(
      `${endpoints.banners}`,
      "POST",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating blog:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to create blog");
  }
};

const useCreateBanner = () => {
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
    mutationFn: async (newBanner: BannerCreate) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateBanner(newBanner, token);
    },
    onSuccess: () => {
      message.success("Banner đã được thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["bannerList"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create blog.");
    },
  });
};

const DeleteBanner = async (bannerId: string, token: string) => {
  if (!token) throw new Error("No token available");

  try {
    if (!endpoints.banner) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.banner.replace(":id", bannerId)}`,
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

const useDeleteBanner = () => {
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
    mutationFn: async (bannerId: string) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return DeleteBanner(bannerId, token);
    },
    onSuccess: () => {
      message.success("Xóa Banner Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["bannerList"] });
    },
    onError: (error: any) => {
      console.error(error.message || "Failed to delete category.");
    },
  });
};

const EditBanner = async (
  editBanner: BannerEdit,
  bannerId: string,
  token: string
) => {
  const formData = new FormData();

  if (!token) throw new Error("No token available");

  for (const key in editBanner) {
    if (Object.prototype.hasOwnProperty.call(editBanner, key)) {
      const value = editBanner[key as keyof BannerEdit];

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
    if (!endpoints.banner) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.banner.replace(":id", bannerId)}`,
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

const useEditBanner = () => {
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
      editBanner,
      bannerId,
    }: {
      editBanner: BannerEdit;
      bannerId: string;
    }) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return EditBanner(editBanner, bannerId, token);
    },
    onSuccess: () => {
      message.success("Sửa Thể Loại Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["bannerList"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to edit category.");
    },
  });
};

export { useBanner, useDeleteBanner, useCreateBanner, useEditBanner };
