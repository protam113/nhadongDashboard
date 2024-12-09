"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { message } from "antd";
import { ChangePassword, VerifyCode, ResetPassword } from "@/types/types";

const ChangePasswordAuth = async (
  changePassword: ChangePassword,
  token: string
) => {
  const formData = new FormData();

  // Duyệt qua các thuộc tính của `newBlog` và xử lý
  for (const key in changePassword) {
    const value = changePassword[key as keyof ChangePassword];

    if (value) {
      // Thêm các trường khác
      formData.append(key, value as string);
    }
  }

  if (!token) throw new Error("No token available");

  try {
    // Gửi FormData tới backend
    const response = await handleAPI(
      `${endpoints.changePassword}`,
      "PATCH",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating blog:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to create blog");
  }
};

const useChangePassword = () => {
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
    mutationFn: async (changePassword: ChangePassword) => {
      if (!token) {
        throw new Error("Token is not available");
      }
      return ChangePasswordAuth(changePassword, token);
    },
    onSuccess: () => {
      message.success("Mật Khẩu Đã Được Thay Đổi Thành Công");
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create blog.");
    },
  });
};

const GetVerifyCode = async (verifyCode: VerifyCode, token?: string) => {
  const formData = new FormData();

  // Duyệt qua các thuộc tính của `newBlog` và xử lý
  for (const key in verifyCode) {
    const value = verifyCode[key as keyof VerifyCode];

    if (value) {
      // Thêm các trường khác
      formData.append(key, value as string);
    }
  }

  try {
    // Gửi FormData tới backend
    const response = await handleAPI(
      `${endpoints.codePassword}`,
      "POST",
      formData,
      token || null
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating blog:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to create blog");
  }
};

const useGetVerifyCode = () => {
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
    mutationFn: async (verifyCode: VerifyCode) => {
      return GetVerifyCode(verifyCode, token || undefined);
    },
    onSuccess: () => {
      message.success("Code Đã Được Gửi Vui Lòng Kiểm Tra Email");
      queryClient.invalidateQueries({ queryKey: ["verifyCode"] });
    },
    onError: (error) => {
      console.log(error.message || "Failed to create blog.");
    },
  });
};

const ForgotPasswordAuth = async (
  updatePassword: ResetPassword,
  token?: string
) => {
  const formData = new FormData();

  // Duyệt qua các thuộc tính của `newBlog` và xử lý
  for (const key in updatePassword) {
    const value = updatePassword[key as keyof ResetPassword];

    if (value) {
      // Thêm các trường khác
      formData.append(key, value as string);
    }
  }

  try {
    // Gửi FormData tới backend
    const response = await handleAPI(
      `${endpoints.verifyCode}`,
      "POST",
      formData,
      token || null
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating blog:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to create blog");
  }
};

const useForgotPassword = () => {
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
    mutationFn: async (updatePassword: ResetPassword) => {
      return ForgotPasswordAuth(updatePassword, token || undefined);
    },
    onSuccess: () => {
      message.success("Mật Khẩu Đã Được Thay Đổi Thành Công");
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
    onError: (error) => {
      console.error(error.message || "Lôi Khi thay đôi mật khẩu.");
    },
  });
};

export { useChangePassword, useGetVerifyCode, useForgotPassword };
