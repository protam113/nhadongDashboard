"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { useAuth } from "@/context/authContext";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";

// Define Role interface
interface Role {
  id: number;
  name: string;
  description: string;
}

// Define UserInfo interface
interface UserInfo {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  profile_image: string;
  role: Role;
}

// Define UserContextType interface
interface UserContextType {
  userInfo: UserInfo | null;
  userRoleId: number | null; // Store the role id here
  loading: boolean;
  error: string | null;
  refreshUserInfo: () => void;
}

// Initialize UserContext with the defined type
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userRoleId, setUserRoleId] = useState<number | null>(null); // Store the role ID
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { getToken, logout } = useAuth();
  const userInfoFetchedRef = useRef(false);

  // Cache user info in localStorage
  const cacheUserInfo = (data: UserInfo) => {
    try {
      localStorage.setItem("user_info", JSON.stringify(data));
    } catch (error) {
      console.error("Error caching user info:", error);
    }
  };

  // Retrieve cached user info from localStorage
  const getCachedUserInfo = (): UserInfo | null => {
    const cachedData = localStorage.getItem("user_info");
    if (cachedData) {
      try {
        return JSON.parse(cachedData) as UserInfo;
      } catch (error) {
        console.error("Error parsing cached user info:", error);
        localStorage.removeItem("user_info");
        return null;
      }
    }
    return null;
  };

  // Fetch user info from API
  const fetchUserInfo = useCallback(async () => {
    if (userInfoFetchedRef.current) return;

    setLoading(true);

    const cachedData = getCachedUserInfo();
    if (cachedData) {
      setUserInfo(cachedData);
      setUserRoleId(cachedData.role ? cachedData.role.id : null); // Set role ID directly
      userInfoFetchedRef.current = true;
      setLoading(false);
      console.log("User info from cache:", cachedData);
      return;
    }

    const token = await getToken();

    if (!token) {
      setUserInfo(null);
      setUserRoleId(null); // Reset role ID
      setLoading(false);
      return;
    }

    try {
      const response = await handleAPI(
        endpoints.currentUser,
        "GET",
        null,
        token
      );

      // Access the user data directly
      const userData: UserInfo = response; // Change if your API structure is different

      setUserInfo(userData); // Update userInfo state
      setUserRoleId(userData.role ? userData.role.id : null); // Store role ID directly
      cacheUserInfo(userData); // Cache user data
    } catch (err: any) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  useEffect(() => {
    if (userInfo?.role?.name === "user") {
      console.log("User role is 'user', logging out...");
      logout(); // Thực hiện logout
    }
  }, [userInfo, logout]);

  // User context value with userRoleId instead of userRoles
  const value: UserContextType = {
    userInfo,
    userRoleId, // Provide the role ID directly
    loading,
    error,
    refreshUserInfo: fetchUserInfo,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to access user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
