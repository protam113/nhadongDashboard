"use client";

import { useQuery } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { EventRegisterListResponse } from "@/types/types";

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

export { useEventRegisterList };
