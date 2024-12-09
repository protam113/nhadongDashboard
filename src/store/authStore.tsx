import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { baseURL, endpoints } from "@/apis/api";

// Define the state shape with correct types
type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  checkAuth: () => void;
  refreshLogin: () => Promise<void>;
};

// Persist options for AuthState
type AuthPersist = PersistOptions<AuthState>;

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      token: null, // Thêm token vào trạng thái ban đầu
      loading: false,
      login: async (username: string, password: string): Promise<void> => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        try {
          const response = await fetch(`${baseURL}${endpoints.login}`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Login failed");
          }

          const data = await response.json();

          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.access);
            document.cookie = `refresh=${data.refresh}; path=/; max-age=604800`;
          }

          set({ isAuthenticated: true, token: data.access, loading: false }); // Thêm token khi đăng nhập thành công
        } catch (error) {
          console.error("Login error:", error);
          set({ isAuthenticated: false, token: null, loading: false }); // Đảm bảo token được xóa khi lỗi
          throw error;
        }
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user_info");
          document.cookie = "refresh=; path=/; max-age=0";
        }

        set({ isAuthenticated: false, token: null }); // Đặt lại token về null khi đăng xuất
        window.location.reload();
      },
      getToken: () => {
        return typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;
      },
      checkAuth: () => {
        const token = localStorage.getItem("token");
        if (token) {
          set({ isAuthenticated: true, token, loading: false }); // Cập nhật cả trạng thái isAuthenticated và loading
        } else {
          set({ isAuthenticated: false, token: null, loading: false });
        }
      },
      refreshLogin: async (): Promise<void> => {
        try {
          // Lấy refresh token từ cookie
          const refreshToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("refresh="))
            ?.split("=")[1];

          if (!refreshToken) {
            throw new Error("No refresh token found");
          }

          // Chuẩn bị FormData
          const formData = new FormData();
          formData.append("refresh", refreshToken);

          // Gửi yêu cầu làm mới token
          const response = await fetch(`${baseURL}${endpoints.refresh}`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }

          // Lấy dữ liệu phản hồi
          const data = await response.json();

          if (typeof window !== "undefined") {
            // Lưu access token mới vào localStorage
            localStorage.setItem("token", data.access);
          }

          // Cập nhật trạng thái trong store
          set({ token: data.access, isAuthenticated: true });
        } catch (error) {
          console.error("Refresh login error:", error);
          // Đặt lại trạng thái nếu làm mới thất bại
          set({ isAuthenticated: false, token: null });
          throw error;
        }
      },
    }),

    {
      name: "auth-storage",
      getStorage: () => localStorage,
    } as AuthPersist
  )
);
