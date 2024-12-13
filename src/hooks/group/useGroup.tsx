"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { message } from "antd";
import {
  FetchGroupListResponse,
  Filters,
  NewGroup,
  NewGroupRole,
} from "@/types/types";

const fetchGrouplist = async (
  pageParam: number = 1,
  token: string,
  filters: Filters
): Promise<FetchGroupListResponse> => {
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
      `${endpoints.groups}${queryString ? `?${queryString}` : ""}`,
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
const useGroupList = (
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

  return useQuery<FetchGroupListResponse, Error>({
    queryKey: ["groupList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchGrouplist(page, token, filters);
    },
    enabled: isReady && !!token,
    staleTime: 60000,
  });
};

/**
 Tạo Cộng Đoàn
 **/

const CreateGroup = async (newGroup: NewGroup, token: string) => {
  const formData = new FormData();

  // Sử dụng keyof NewGroup để đảm bảo các key là hợp lệ
  for (const key in newGroup) {
    const value = newGroup[key as keyof NewGroup];

    // Kiểm tra nếu value không phải là null hoặc undefined
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v)); // Nếu là mảng, thêm từng phần tử vào FormData
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString()); // Nếu là Date, chuyển thành chuỗi ISO
      } else {
        formData.append(key, value as string | Blob); // Nếu là string hoặc File, append trực tiếp
      }
    }
  }

  if (!token) throw new Error("No token available");

  try {
    const response = await handleAPI(
      `${endpoints.groups}`,
      "POST",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    // Use 'any' type assertion
    console.error("Error creating group:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to create news");
  }
};

const useCreateGroup = () => {
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
    mutationFn: async (newGroup: NewGroup) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateGroup(newGroup, token);
    },
    onSuccess: () => {
      message.success("Tin Tức đã được thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to create groups.");
    },
  });
};

/**
 Hooks Xóa Group
 **/

const DeleteGroup = async (groupId: string, token: string) => {
  if (!token) throw new Error("No token available");

  try {
    if (!endpoints.group) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.group.replace(":id", groupId)}`,
      "DELETE",
      null,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error deleting group:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to delete group");
  }
};

const useDeleteGroup = () => {
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
    mutationFn: async (groupId: string) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return DeleteGroup(groupId, token);
    },
    onSuccess: () => {
      message.success("Xóa Groups Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
    },
    onError: (error: any) => {
      console.error(error.message || "Failed to delete group.");
    },
  });
};

/**
 Sửa Group
 **/

const EditGroup = async (
  editGroup: NewGroup,
  groupId: string,
  token: string
) => {
  const formData = new FormData();

  if (!token) throw new Error("No token available");

  for (const key in editGroup) {
    if (Object.prototype.hasOwnProperty.call(editGroup, key)) {
      const value = editGroup[key as keyof NewGroup];

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
    if (!endpoints.group) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.group.replace(":id", groupId)}`,
      "PATCH",
      formData, // Gửi formData trong body request
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error editing group:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to edit group");
  }
};

const useEditGroup = () => {
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
      editGroup,
      groupId,
    }: {
      editGroup: NewGroup;
      groupId: string;
    }) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return EditGroup(editGroup, groupId, token);
    },
    onSuccess: () => {
      message.success("Sửa Group Thành Công!");
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to edit group.");
    },
  });
};

/**
 Lấy Role  Group
 **/

const fetchGroupRolelist = async (
  groupId: string,
  pageParam: number = 1,
  token: string
): Promise<FetchGroupListResponse> => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    if (!endpoints.groupRole) {
      throw null;
    }
    // Construct the query string
    const queryString = new URLSearchParams({
      page: pageParam.toString(),
    }).toString();

    // Build the API endpoint
    const url = `${endpoints.groupRole.replace(":id", groupId)}${
      queryString ? `?${queryString}` : ""
    }`;

    // Make the API request using handleAPI
    const response = await handleAPI(url, "GET", null, token);
    return response;
  } catch (error) {
    console.error("Error fetching group role list:", error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the group role list
const useGroupRoleList = (
  page: number,
  refreshKey: number,
  groupId: string
) => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Fetch token once when the component mounts or `getToken` changes
  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      setToken(userToken);
      setIsReady(true);
    };

    fetchToken();
  }, [getToken]);

  return useQuery<FetchGroupListResponse, Error>({
    queryKey: ["groupRoleList", token, page, refreshKey, groupId],
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchGroupRolelist(groupId, page, token); // Call the corrected function
    },
    enabled: isReady && !!token,
    staleTime: 60000, // Keep data fresh for 1 minute
  });
};

/**
    Thêm Role Vào Group
 **/

const CreateGroupRole = async (
  newGroupRole: NewGroupRole,
  groupId: string,
  token: string
) => {
  const formData = new FormData();

  // Sử dụng keyof NewGroup để đảm bảo các key là hợp lệ
  for (const key in newGroupRole) {
    const value = newGroupRole[key as keyof NewGroupRole];

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
    if (!endpoints.groupRole) {
      throw null;
    }
    const response = await handleAPI(
      `${endpoints.groupRole.replace(":id", groupId)}`,
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

const useCreateGroupRole = (groupId: string) => {
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
    mutationFn: async (newGroupRole: NewGroupRole) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return CreateGroupRole(newGroupRole, groupId, token);
    },
    onSuccess: () => {
      message.success("Role đã được thêm thành công");
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to create roles group.");
    },
  });
};

export {
  useGroupList,
  useCreateGroup,
  useDeleteGroup,
  useEditGroup,
  useGroupRoleList,
  useCreateGroupRole,
};
