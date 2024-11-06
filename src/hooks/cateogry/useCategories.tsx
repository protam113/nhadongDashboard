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

// Khai Báo Các Biến Có trong Category
interface Category {
    id: number;
    name: string;
    model: string;
    file: string;
}

// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
interface FetchCategoriesListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Category[];
}

// Bộ Lọc
interface Filters {
    [key: string]: string | number | string[] | undefined;
}

const fetchCategorieslist = async (
    pageParam: number = 1,
    token: string,
    filters: Filters
): Promise<FetchCategoriesListResponse> => {
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
            `${endpoints.categories}${queryString ? `?${queryString}` : ""}`,
            "GET",
            null,
            token
        );
        return response;
    } catch (error) {
        console.error("Error fetching categories list:", error);
        throw error; // Rethrow error for further handling
    }
};



// Custom hook for fetching the queue list
const useCateogiesList = (page: number, filters: Filters = {}, refreshKey: number) => {
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

    return useQuery<FetchCategoriesListResponse, Error>({
        queryKey: ["categoriesList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
        queryFn: async () => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return fetchCategorieslist(page, token, filters);
        },
        enabled: isReady && !!token,
        staleTime: 60000,
    });
};

interface CreateCatoryItem {
    name: string;
    model: string;
    file: File | string | null; // Use File type for file, or string if necessary
}

const CreateCategory = async (browseManager: CreateCatoryItem, token: string) => {
    const formData = new FormData();

    for (const key in browseManager) {
        if (Object.prototype.hasOwnProperty.call(browseManager, key)) {
            const value = browseManager[key as keyof CreateCatoryItem];

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
        const response = await handleAPI(`${endpoints.categories}`, 'POST', formData, token);
        return response.data;
    } catch (error: any) {
        console.error('Error creating category:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to create category');
    }
};

const useCreateCategory = () => {
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
        mutationFn: async (createCategory: CreateCatoryItem) => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return CreateCategory(createCategory, token);
        },
        onSuccess: () => {
            console.error("Category created successfully!");
            queryClient.invalidateQueries({ queryKey: ["categoriesList"] });
        },
        onError: (error: any) => {
            console.error(error.message || "Failed to create category.");
        },
    });
};

const DeleteCategory = async (categoryId: string, token: string) => {
    if (!token) throw new Error("No token available");

    try {
        const response = await handleAPI(`${endpoints.category.replace(":id", categoryId)}`, 'DELETE', null, token);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting category:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
};

const useDeleteCategory = () => {
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
        mutationFn: async (categoryId: string) => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return DeleteCategory(categoryId, token);
        },
        onSuccess: () => {
            message.success("Xóa Thể Loại Thành Công!");
            queryClient.invalidateQueries({ queryKey: ["categoriesList"] });
        },
        onError: (error: any) => {
            console.error(error.message || "Failed to delete category.");
        },
    });
};


export { useCateogiesList,useCreateCategory,useDeleteCategory };