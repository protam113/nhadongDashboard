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

interface News {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    profile_image: string;
}

interface NewsList {
    id: number;
    title: string;
    description: string;
    content: string; // Có thể cần điều chỉnh nếu cấu trúc khác
    link: string;
    image: string | null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
    categories: Category[];
    user: News; // Sử dụng interface User đã khai báo ở trên
}

// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
interface FetchNewsListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: NewsList[];
}

// Bộ Lọc
interface Filters {
    [key: string]: string | number | string[] | undefined;
}

const fetchNewslist = async (
    pageParam: number = 1,
    token: string,
    filters: Filters
): Promise<FetchNewsListResponse> => {
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
            `${endpoints.news}${queryString ? `?${queryString}` : ""}`,
            "GET",
            null,
            token
        );
        return response;
    } catch (error) {
        console.error("Error fetching news list:", error);
        throw error; // Rethrow error for further handling
    }
};



// Custom hook for fetching the queue list
const useNewsList = (page: number, filters: Filters = {}, refreshKey: number) => {
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

    return useQuery<FetchNewsListResponse, Error>({
        queryKey: ["newsList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
        queryFn: async () => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return fetchNewslist(page, token, filters);
        },
        enabled: isReady && !!token,
        staleTime: 60000,
    });
};


/**
 Tạo Tin Tức
 **/

interface NewNews {
    title: string;
    description: string;
    content: string; // Mảng nội dung chi tiết
    link: string;
    category:string[]; // Mảng danh mục
    image: File[] | string; // Hình ảnh chính cho bài viết// Hoặc bạn có thể định nghĩa các trường cụ thể mà bạn cần
}

const CreateNews = async (newNews: NewNews, token: string) => {
    const formData = new FormData();

    for (const key in newNews) {
        const value = newNews[key as keyof NewNews];

        if (key === 'content') {
            // Xử lý content nếu là object hoặc JSON string
            formData.append(key, JSON.stringify(value));
        } else if (key === 'category' && Array.isArray(value)) {
            value.forEach((id) => formData.append('category', id)); // Gửi từng ID
        }
        else if (key === 'image' && typeof value === 'string') {
            // Nếu là URL hình ảnh
            formData.append(key, value);
        } else if (key === 'image' && Array.isArray(value)) {
            // Nếu là mảng hình ảnh tải lên
            value.forEach((file) => {
                formData.append('image', file);
            });
        } else if (value) {
            // Thêm các trường khác
            formData.append(key, value as string);
        }
    }

    if (!token) throw new Error("No token available");

    try {
        const response = await handleAPI(`${endpoints.news}`, 'POST', formData, token);
        return response.data;
    } catch (error: any) { // Use 'any' type assertion
        console.error('Error creating news:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to create news');
    }
};


const useCreateNews = () => {
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
        mutationFn: async (newNews: NewNews) => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return CreateNews(newNews, token);
        },
        onSuccess: () => {
            message.success("Tin Tức đã được thêm thành công");
            queryClient.invalidateQueries({ queryKey: ["newsList"] });
        },
        onError: (error) => {
            console.log(error.message || "Failed to create news.");
        },
    });
};

/**
 Xóa Tin Tức
 **/


const DeleteNews = async (newsId: string, token: string) => {
    if (!token) throw new Error("No token available");


    try {
        const response = await handleAPI(`${endpoints.new.replace(":id", newsId)}`, 'DELETE', null, token);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting news:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to delete news');
    }
};

const useDeleteNews = () => {
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
        mutationFn: async (newsId: string) => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return DeleteNews(newsId, token);
        },
        onSuccess: () => {
            message.success("Xóa tin tức Thành Công!");
            queryClient.invalidateQueries({ queryKey: ["newsList"] });
        },
        onError: (error: any) => {
            console.error(error.message || "Failed to delete news.");
        },
    });
};

export { useNewsList,useCreateNews,useDeleteNews };