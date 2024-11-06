"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { message } from "antd";

interface Category {
    id: number;
    name: string;
    file: string;
}

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    profile_image: string;
}

interface BLogs {
    id: number;
    title: string;
    description: string;
    content: string; // Có thể cần điều chỉnh nếu cấu trúc khác
    link: string;
    image: string | null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
    categories: Category[];
    user: User; // Sử dụng interface User đã khai báo ở trên
}

// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
interface FetchBLogsListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: BLogs[];
}

// Bộ Lọc
interface Filters {
    [key: string]: string | number | string[] | undefined;
}

const fetchBloglist = async (
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
            `${endpoints.blogs}${queryString ? `?${queryString}` : ""}`,
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
const useBlogList = (page: number, filters: Filters = {}, refreshKey: number) => {
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
        queryKey: ["blogList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
        queryFn: async () => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return fetchBloglist(page, token, filters);
        },
        enabled: isReady && !!token,
        staleTime: 60000,
    });
};


interface NewBlog {
    [key: string]: any; // Hoặc bạn có thể định nghĩa các trường cụ thể mà bạn cần
}

const CreateManager = async (newBlog: NewBlog, token: string) => {
    const formData = new FormData();

    for (const key in newBlog) {
        const value = newBlog[key];
        if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
        } else {
            formData.append(key, value);
        }
    }

    if (!token) throw new Error("No token available");

    try {
        const response = await handleAPI(`${endpoints.blogs}`, 'POST', formData, token);
        return response.data;
    } catch (error: any) { // Use 'any' type assertion
        console.error('Error creating blog:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to create blog');
    }
};


const useCreateBlog = () => {
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
        mutationFn: async (newBlog: NewBlog) => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return CreateManager(newBlog, token);
        },
        onSuccess: () => {
            console.log("Bài Viết đã được thêm thành công");
            queryClient.invalidateQueries({ queryKey: ["userList"] });
        },
        onError: (error) => {
            console.log(error.message || "Failed to create blog.");
        },
    });
};

export { useBlogList,useCreateBlog };