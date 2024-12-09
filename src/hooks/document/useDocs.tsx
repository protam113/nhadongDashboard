"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { message } from "antd";
import { FetchDocsListResponse, Filters, NewDocs } from "@/types/types";

const fetchDocslist = async (
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
      `${endpoints.documents}${queryString ? `?${queryString}` : ""}`,
      "GET",
      null,
      token
    );
    return response;
  } catch (error) {
    console.error("Error fetching docs list:", error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the queue list
const useDocsList = (
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
    queryKey: ["docsList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchDocslist(page, token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000,
  });
};

const CreateDocs = async (newDoc: NewDocs, token: string) => {
  const formData = new FormData();

  for (const key in newDoc) {
    const value = newDoc[key as keyof NewDocs];

    if (key === "content") {
      // Xử lý content nếu là object hoặc JSON string
      formData.append(key, JSON.stringify(value));
    } else if (key === "category") {
      // Gửi category là một chuỗi đơn, không cần phải là mảng
      formData.append("category", value as string);
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
      `${endpoints.documents}`,
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

const useCreateDoc = () => {
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
      return CreateDocs(newDoc, token);
    },
    onSuccess: () => {
      message.success("Tài Liệu đã được thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["docsList"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create docs.");
    },
  });
};

export { useDocsList, useCreateDoc };
