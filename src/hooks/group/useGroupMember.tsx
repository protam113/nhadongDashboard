"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { message } from "antd";
import { FetchGroupMemberListResponse, NewGroupMember } from "@/types/types";

const fetchGroupMember = async (
  pageParam: number = 1,
  groupId: string,
  token: string
): Promise<FetchGroupMemberListResponse> => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    // Construct the query string
    const queryString = new URLSearchParams({
      page: pageParam.toString(),
    }).toString();
    if (!endpoints.groupMember) {
      throw null;
    }
    // Make the API request using handleAPI
    const response = await handleAPI(
      `${endpoints.groupMember.replace(":id", groupId)}${
        queryString ? `?${queryString}` : ""
      }`,
      "GET",
      null,
      token
    );
    return response;
  } catch (error) {
    console.error("Error fetching group list:", error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the queue list
const useGroupMember = (page: number, refreshKey: number, groupId: string) => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
    };
    fetchToken();
  }, [getToken]);

  return useQuery<FetchGroupMemberListResponse, Error>({
    queryKey: ["groupMemberList", token, page, groupId, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchGroupMember(page, groupId, token);
    },
    enabled: !!token,
    staleTime: 60000,
  });
};

const CreateGroupMember = async (
  newGroupMember: NewGroupMember,
  groupId: string,
  token: string
) => {
  const formData = new FormData();

  // Sử dụng keyof NewGroup để đảm bảo các key là hợp lệ
  for (const key in newGroupMember) {
    const value = newGroupMember[key as keyof NewGroupMember];

    // Kiểm tra nếu value không phải là null hoặc undefined
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v)); // Nếu là mảng, thêm từng phần tử vào FormData
      } else {
        formData.append(key, value as string | Blob); // Nếu là string hoặc File, append trực tiếp
      }
    }
  }

  if (!token) throw new Error("No token available");

  try {
    if (!endpoints.groupMember) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.groupMember.replace(":id", groupId)}`,
      "POST",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    // Use 'any' type assertion
    console.error("Error creating group role:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to create role group"
    );
  }
};

const useCreateGroupMember = (groupId: string) => {
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
    mutationFn: async (newGroupMember: NewGroupMember) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateGroupMember(newGroupMember, groupId, token);
    },
    onSuccess: () => {
      message.success("Role đã được thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["groupMemberList"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to create roles group.");
    },
  });
};

export { useGroupMember, useCreateGroupMember };
