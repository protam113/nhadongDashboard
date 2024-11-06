"use client";
import { useQuery } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";

interface Role {
    id: number;
    name: string;
    description: string;
}

interface FetchRoleListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Role[];
}

const fetchRoleList = async (pageParam: number = 1, token: string): Promise<FetchRoleListResponse> => {
    if (!token) {
        throw new Error("No token provided");
    }

    try {
        // Make the API request using handleAPI
        const response = await handleAPI(`${endpoints.roles}?page=${pageParam}`, 'GET', null, token);
        return response;
    } catch (error) {
        console.error("Error fetching role list:", error);
        throw error; // Rethrow error for further handling
    }
};
// Custom hook for user list
const useRoleList = (page: number) => {
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


    return useQuery<FetchRoleListResponse, Error>({
        queryKey: ["role", token, page],
        queryFn: async () => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return fetchRoleList(page, token);
        },
        enabled: isReady && !!token,
        staleTime: 60000,
        // cacheTime: 30 * 60 * 1000,
        // keepPreviousData: true, // Giữ dữ liệu trước đó trong khi đang tải dữ liệu mới
    });
};

export { useRoleList };