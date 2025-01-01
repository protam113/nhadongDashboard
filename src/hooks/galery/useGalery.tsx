"use client";

import { useQuery } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { FetchGaleryListResponse, Filters } from "@/types/types";

/*
        Hooks lấy danh sách tài liệu
    */

const fetchGaleryList = async (
  filters: Filters,
  pageParam: number = 1,
  token: string
): Promise<FetchGaleryListResponse> => {
  try {
    // Filter out undefined or empty values from filters
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([, value]) => value !== undefined && value !== "" && value !== null
      )
    );

    // Construct the query string
    const queryString = new URLSearchParams({
      page: pageParam.toString(),
      ...validFilters, // Merge the valid filters into the query string
    }).toString();

    // Make the API request using handleAPI
    const response = await handleAPI(
      `${endpoints.galery}${queryString ? `?${queryString}` : ""}`,
      "GET",
      null,
      token
    );
    return response;
  } catch (error) {
    console.error("Error fetching document list:", error);
    throw error; // Rethrow error for further handling
  }
};

// Custom hook for fetching the queue list
const useGaleryList = (
  page: number,
  filters: Filters = {},
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

  return useQuery<FetchGaleryListResponse, Error>({
    queryKey: ["galeryList", filters, page, token, refreshKey],
    queryFn: async () => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return fetchGaleryList(filters, page, token);
    },

    staleTime: 60000,
  });
};

export { useGaleryList };
