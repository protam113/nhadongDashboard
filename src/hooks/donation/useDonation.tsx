"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { message } from "antd";
import { FetchDonationListResponse, Filters, NewDonation } from "@/types/types";

const fetchDonationList = async (
  pageParam: number = 1,
  token: string,
  filters: Filters
): Promise<FetchDonationListResponse> => {
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
      `${endpoints.donations}${queryString ? `?${queryString}` : ""}`,
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
const useDonationList = (
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

  return useQuery<FetchDonationListResponse, Error>({
    queryKey: ["donateList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchDonationList(page, token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000,
  });
};

/**
 Tạo Tin Quyên Góp
 **/

const CreateDonation = async (newPost: NewDonation, token: string) => {
  const formData = new FormData();

  // Duyệt qua các thuộc tính của `newBlog` và xử lý
  for (const key in newPost) {
    const value = newPost[key as keyof NewDonation];

    if (key === "content") {
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
    // Gửi FormData tới backend
    const response = await handleAPI(
      `${endpoints.donations}`,
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

const useCreateDonation = () => {
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
    mutationFn: async (newPost: NewDonation) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateDonation(newPost, token);
    },
    onSuccess: () => {
      message.success("Bài Viết đã được thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["donateList"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create blog.");
    },
  });
};

/**
 Xóa Tin Quyên Góp
 **/

const DeleteDonation = async (blogId: string, token: string) => {
  if (!token) throw new Error("No token available");

  try {
    if (!endpoints.donation) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.donation.replace(":id", blogId)}`,
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

const useDeleteDonation = () => {
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
    mutationFn: async (blogId: string) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return DeleteDonation(blogId, token);
    },
    onSuccess: () => {
      message.success("Xóa Tin Quyên Góp Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["donateList"] });
    },
    onError: (error: any) => {
      console.error(error.message || "Failed to delete category.");
    },
  });
};

export { useDonationList, useCreateDonation, useDeleteDonation };
