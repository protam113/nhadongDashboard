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
import {NewEvent,
    FetchEventListResponse,
    Filters
} from "@/types/types"

const fetchEventList = async (
    pageParam: number = 1,
    token: string,
    filters: Filters
): Promise<FetchEventListResponse> => {
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
            `${endpoints.events}${queryString ? `?${queryString}` : ""}`,
            "GET",
            null,
            token
        );
        return response;
    } catch (error) {
        console.error("Error fetching event list:", error);
        throw error; // Rethrow error for further handling
    }
};



// Custom hook for fetching the queue list
const useEventList = (page: number, filters: Filters = {}, refreshKey: number) => {
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

    return useQuery<FetchEventListResponse, Error>({
        queryKey: ["eventList", token, page, filters, refreshKey], // Thêm refreshKey vào queryKey
        queryFn: async () => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return fetchEventList(page, token, filters);
        },
        enabled: isReady && !!token,
        staleTime: 60000,
    });
};


const CreateEvent = async (newDoc: NewEvent, token: string) => {
    const formData = new FormData();

    for (const key in newDoc) {
        const value = newDoc[key as keyof NewEvent];

        if (key === 'description') {
            // Xử lý content nếu là object hoặc JSON string
            formData.append(key, JSON.stringify(value));
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
        const response = await handleAPI(`${endpoints.events}`, 'POST', formData, token);
        return response.data;
    } catch (error: any) { // Use 'any' type assertion
        console.error('Error creating docs:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to create event');
    }
};


const useCreateEvent = () => {
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
        mutationFn: async (newDoc: NewEvent) => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return CreateEvent(newDoc, token);
        },
        onSuccess: () => {
            message.success("Sự kiện đã được thêm thành công");
            queryClient.invalidateQueries({ queryKey: ["eventList"] });
        },
        onError: (error) => {
            console.log(error.message || "Failed to create event.");
        },
    });
};

export {useEventList,useCreateEvent}