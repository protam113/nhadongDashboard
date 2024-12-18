"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { FetchChatListResponse, NewChat} from "@/types/types";

const fetchChatlist = async (
    token: string,
): Promise<FetchChatListResponse> => {
    if (!token) {
        throw new Error("No token provided");
    }
    try {
        // Make the API request using handleAPI
        const response = await handleAPI(
            `${endpoints.chatHistory}`,
            "GET",
            null,
            token
        );
        return response;
    } catch (error) {
        console.error("Error fetching news list:", error);
        throw error;
    }
};

// Custom hook for fetching the queue list
const useChatList = (
    refreshKey: number
) => {
    const { getToken } = useAuth();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };

        fetchToken();
    }, [getToken]);

    return useQuery<FetchChatListResponse, Error>({
        queryKey: ["chatList", token, refreshKey], // Thêm refreshKey vào queryKey
        queryFn: async () => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return fetchChatlist( token);
        },
        enabled: !!token,
        staleTime: 60000,
    });
};

/**
 Tạo Chat
 **/

const Chat = async (newChat: NewChat, token: string) => {
    if (!token) throw new Error("No token available");

    try {
        const response = await handleAPI(
            `${endpoints.chat}`,
            "POST",
            newChat,
            token
        );

        return response.data; // Trả về dữ liệu từ API
    } catch (error: any) {
        console.error("Error creating chat:", error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to create chat");
    }
};

const useChat = () => {
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
        mutationFn: async (newChat: NewChat) => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return Chat(newChat, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chatList"] });
        },
        onError: (error) => {
            console.log(error.message || "Failed to create news.");
        },
    });
};


export {useChatList,useChat}