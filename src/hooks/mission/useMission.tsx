"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { message } from "antd";
import { FetchDocsListResponse, Filters, NewDocs } from "@/types/types";

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
      console.log(error.message || "Failed to create docs.");
    },
  });
};

/**
 Xóa Sứ vụ
 **/

const DeleteMission = async (postId: string, token: string) => {
  if (!token) throw new Error("No token available");

  try {
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

// /**
//  Sửa Blog
//  **/

// const EditBlog = async (editBlog: NewBlog, blogId: string, token: string) => {
//   const formData = new FormData();

//   if (!token) throw new Error("No token available");

//   for (const key in editBlog) {
//     const value = editBlog[key as keyof NewBlog];

//     if (key === "content") {
//       // Xử lý content nếu là object hoặc JSON string
//       formData.append(key, JSON.stringify(value));
//     } else if (key === "category" && Array.isArray(value)) {
//       value.forEach((id) => formData.append("category", id)); // Gửi từng ID
//     } else if (key === "image" && typeof value === "string") {
//       // Nếu là URL hình ảnh
//       formData.append(key, value);
//     } else if (key === "image" && Array.isArray(value)) {
//       // Nếu là mảng hình ảnh tải lên
//       value.forEach((file) => {
//         formData.append("image", file);
//       });
//     } else if (value) {
//       // Thêm các trường khác
//       formData.append(key, value as string);
//     }
//   }

//   try {
//     const response = await handleAPI(
//       `${endpoints.blog.replace(":id", blogId)}`,
//       "PATCH",
//       formData, // Gửi formData trong body request
//       token
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error("Error editing blog:", error.response?.data);
//     throw new Error(error.response?.data?.message || "Failed to edit blog");
//   }
// };

// const useEditBlog = () => {
//   const queryClient = useQueryClient();
//   const { getToken } = useAuth();
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchToken = async () => {
//       const userToken = await getToken();
//       setToken(userToken);
//     };
//     fetchToken();
//   }, [getToken]);

//   return useMutation({
//     mutationFn: async ({
//       editBlog,
//       blogId,
//     }: {
//       editBlog: NewBlog;
//       blogId: string;
//     }) => {
//       if (!token) {
//         throw new Error("Token is not available");
//       }
//       return EditBlog(editBlog, blogId, token);
//     },
//     onSuccess: () => {
//       message.success("Sửa Bài Viết Thành Công!");
//       queryClient.invalidateQueries({ queryKey: ["blogList"] });
//     },
//     onError: (error: any) => {
//       message.error(error.message || "Failed to edit blog.");
//     },
//   });
// };

export { useMissionList, useCreateMission, useDeleteMission };
