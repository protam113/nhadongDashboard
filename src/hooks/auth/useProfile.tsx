"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleAPI } from "@/apis/axiosClient";
import { endpoints } from "@/apis/api";
import { useAuth } from "@/context/authContext";
import { message } from "antd";
import { UpdateProfile } from "@/types/types";

// Hàm tạo FormData từ dữ liệu cập nhật người dùng
const createFormData = (data: UpdateProfile) => {
  const formData = new FormData();
  for (const key in data) {
    const value = data[key as keyof UpdateProfile];
    if (key === "profile_image" && typeof value === "string") {
      // Nếu là URL hình ảnh
      formData.append(key, value);
    } else if (key === "profile_image" && Array.isArray(value)) {
      // Nếu là mảng hình ảnh tải lên
      value.forEach((file) => {
        formData.append("profile_image", file);
      });
    } else if (value) {
      // Thêm các trường khác
      formData.append(key, value as string);
    }
  }
  return formData;
};

// Hàm gọi API để cập nhật thông tin người dùng
const updateProfileAPI = async (profileData: UpdateProfile, token: string) => {
  if (!token) throw new Error("Token is not available");

  const formData = createFormData(profileData);

  try {
    const response = await handleAPI(
      `${endpoints.updateProfile}`,
      "PATCH",
      formData,
      token
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating profile:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (profileData: UpdateProfile) => {
      const token = await getToken();
      if (!token) throw new Error("Bạn chưa đăng nhập.");
      return await updateProfileAPI(profileData, token);
    },
    onSuccess: (data) => {
      message.success("Thông tin người dùng đã được cập nhật!");
      localStorage.setItem("user_info", JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
    onError: (error: any) => {
      const errorMsg =
        error.message || "Không thể cập nhật thông tin người dùng.";
      message.error(errorMsg);
    },
  });
};

export { useUpdateProfile };
