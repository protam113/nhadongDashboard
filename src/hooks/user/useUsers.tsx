"use client";
import {
    useMutation,
    useQueryClient,
    useQuery,

} from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    profile_image: string;
    role: string;
}

interface FetchUserListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
}

interface Filters {
    role?: string[]; // Use an array for role filters
    [key: string]: string | number | string[] | undefined;
}

const fetchUserList = async (
    pageParam: number = 1,
    token: string,
    filters: Filters
): Promise<FetchUserListResponse> => {
    if (!token) {
        throw new Error("No token provided");
    }

    try {
        const params = new URLSearchParams();
        params.append("page", pageParam.toString());

        // Handle multiple roles
        if (filters.role) {
            filters.role.forEach((role) => params.append("role", role));
        }

        // Add other filters if necessary
        Object.entries(filters).forEach(([key, value]) => {
            if (key !== "role" && value !== undefined) {
                params.append(key, value.toString());
            }
        });

        // Make the API request
        const response = await handleAPI(
            `${endpoints.users}?${params.toString()}`,
            "GET",
            null,
            token
        );
        return response;
    } catch (error) {
        console.error("Error fetching user list:", error);
        throw error;
    }
};

// Custom hook for user list
const useUserList = (page: number, filters: Filters = {}) => {
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

    return useQuery<FetchUserListResponse, Error>({
        queryKey: ["userList", token, page, filters],
        queryFn: async () => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return fetchUserList(page, token, filters);
        },
        enabled: isReady && !!token,
        staleTime: 60000,
    });
};
// hook
interface NewManager {
    [key: string]: any; // Hoặc bạn có thể định nghĩa các trường cụ thể mà bạn cần
}

const CreateManager = async (newManager: NewManager, token: string) => {
    const formData = new FormData();

    for (const key in newManager) {
        const value = newManager[key];
        if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
        } else {
            formData.append(key, value);
        }
    }

    if (!token) throw new Error("No token available");

    try {
        const response = await handleAPI(`${endpoints.users}`, 'POST', formData, token);
        return response.data;
    } catch (error: any) { // Use 'any' type assertion
        console.error('Error creating manager:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to create manager');
    }
};


const useCreateManager = () => {
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
        mutationFn: async (newManager: NewManager) => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return CreateManager(newManager, token);
        },
        onSuccess: () => {
            console.log("Người quản lý đã được thêm thành công");
            queryClient.invalidateQueries({ queryKey: ["userList"] });
        },
        onError: (error) => {
            console.log(error.message || "Failed to add manager.");
        },
    });
};

interface AddManager {
    [key: string]: any; // Hoặc bạn có thể định nghĩa các trường cụ thể mà bạn cần
}

const AddManager = async (addManager: AddManager, token: string) => {
    const formData = new FormData();

    // Duyệt qua các trường trong browseManager
    for (const key in addManager) {
        const value = addManager[key];
        if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
        } else {
            formData.append(key, value);
        }
    }

    if (!token) throw new Error("No token available");

    try {
        const response = await handleAPI(`${endpoints.roleAddUserToManager}`, 'POST', formData, token);
        return response.data;
    } catch (error: any) { // Use 'any' type assertion
        console.error('Error creating manager:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to create manager');
    }
};


const useAddManager = () => {
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
        mutationFn: async (addManager: AddManager) => {
            if (!token) {
                throw new Error("Token is not available");
            }
            return AddManager(addManager, token);
        },
        onSuccess: () => {
            console.log("Người quản lý đã được thêm thành công");
            queryClient.invalidateQueries({ queryKey: ["userList"] });
        },
        onError: (error) => {
            console.log(error.message || "Failed to add manager.");
        },
    });
};


export { useUserList,useCreateManager,useAddManager };