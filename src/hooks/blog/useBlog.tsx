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
    title: string;
    description: string;
    content: string; // Mảng nội dung chi tiết
    link: string;
    category:string[]; // Mảng danh mục
    image: File[] | string; // Hình ảnh chính cho bài viết
}

const CreateBlog = async (newBlog: NewBlog, token: string) => {
    const formData = new FormData();

    // Duyệt qua các thuộc tính của `newBlog` và xử lý
    for (const key in newBlog) {
        const value = newBlog[key as keyof NewBlog];

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
        // Gửi FormData tới backend
        const response = await handleAPI(`${endpoints.blogs}`, 'POST', formData, token);
        return response.data;
    } catch (error: any) {
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
            return CreateBlog(newBlog, token);
        },
        onSuccess: () => {
            message.success("Bài Viết đã được thêm thành công");
            queryClient.invalidateQueries({ queryKey: ["blogList"] });
        },
        onError: (error) => {
            console.log(error.message || "Failed to create blog.");
        },
    });
};

/**
 Xóa Blog
 **/


const DeleteBlog = async (blogId: string, token: string) => {
    if (!token) throw new Error("No token available");


    try {
        const response = await handleAPI(`${endpoints.blog.replace(":id", blogId)}`, 'DELETE', null, token);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting category:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
};

const useDeleteBlog = () => {
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
            return DeleteBlog(blogId, token);
        },
        onSuccess: () => {
            message.success("Xóa Bài Viết Thành Công!");
            queryClient.invalidateQueries({ queryKey: ["blogList"] });
        },
        onError: (error: any) => {
            console.error(error.message || "Failed to delete category.");
        },
    });
};

/**
 Sửa Blog
 **/



const EditBlog = async (
    editBlog: NewBlog,
    blogId: string,
    token: string
) => {
    const formData = new FormData();

    if (!token) throw new Error("No token available");

    for (const key in editBlog) {
        const value = editBlog[key as keyof NewBlog];

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

    try {
        const response = await handleAPI(
            `${endpoints.blog.replace(":id", blogId)}`,
            "PATCH",
            formData, // Gửi formData trong body request
            token
        );
        return response.data;
    } catch (error: any) {
        console.error("Error editing blog:", error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to edit blog");
    }
};




const useEditBlog = () => {
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
                               editBlog,
                               blogId,
                           }: {
            editBlog: NewBlog;
            blogId: string;
        }) => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return EditBlog(editBlog, blogId, token);
        },
        onSuccess: () => {
            message.success("Sửa Bài Viết Thành Công!");
            queryClient.invalidateQueries({ queryKey: ["blogList"] });
        },
        onError: (error: any) => {
            message.error(error.message || "Failed to edit blog.");
        },
    });
};

export { useBlogList,useCreateBlog,useDeleteBlog,useEditBlog };