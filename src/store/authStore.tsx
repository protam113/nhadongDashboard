import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { baseURL, endpoints } from "@/apis/api";
import { encrypt, decrypt } from "@/utils/crypto"; // Import hàm mã hóa/giải mã

// Định nghĩa kiểu dữ liệu của state
type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  userInfo?: any | null; // Thêm trường userInfo để lưu thông tin người dùng
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  checkAuth: () => void;
  refreshLogin: () => Promise<void>;
  scheduleTokenCheck: () => void;
};

// Tùy chọn cho middleware `persist`
type AuthPersist = PersistOptions<AuthState>;

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
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
            localStorage.setItem("token", encrypt(data.access));
            document.cookie = `refresh=${encrypt(
              data.refresh
            )}; path=/; max-age=86400`;
            localStorage.setItem("expires", encrypt(data.expires.toString()));
          }

          // Lấy thông tin người dùng sau khi đăng nhập thành công
          const userResponse = await fetch(
            `${baseURL}${endpoints.currentUser}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${data.access}`,
              },
            }
          );

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user info");
          }

          const userData = await userResponse.json();

          // Lưu thông tin người dùng vào store
          set({
            isAuthenticated: true,
            token: data.access,
            loading: false,
            userInfo: userData, // Lưu thông tin người dùng vào state
          });
        } catch (error) {
          console.error("Login error:", error);
          set({ isAuthenticated: false, token: null, loading: false });
          throw error;
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("expires");
          document.cookie = "refresh=; path=/; max-age=0";
          document.cookie = "user_info=; path=/; max-age=0";
        }

        set({ isAuthenticated: false, token: null, userInfo: null }); // Xóa thông tin người dùng khi đăng xuất
        window.location.reload();
      },
      getToken: () => {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        return token ? decrypt(token) : null;
      },
      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (token) {
          set({ isAuthenticated: true, token: decrypt(token), loading: false });

          try {
            // Lấy thông tin người dùng nếu token hợp lệ
            const userResponse = await fetch(
              `${baseURL}${endpoints.currentUser}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${decrypt(token)}`,
                },
              }
            );

            if (userResponse.ok) {
              const userData = await userResponse.json();

              // Kiểm tra nếu role.name là 'user' thì đăng xuất và chuyển hướng về trang login
              if (userData.role && userData.role.name === "user") {
                get().logout(); // Thực hiện đăng xuất
                window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
                return;
              }
              set({ userInfo: userData });
            }
          } catch (error) {
            console.error("Failed to fetch user info:", error);
          }
        } else {
          set({
            isAuthenticated: false,
            token: null,
            loading: false,
            userInfo: null,
          });
        }
      },

      refreshLogin: async (): Promise<void> => {
        try {
          const refreshToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("refresh="))
            ?.split("=")[1];

          if (!refreshToken) {
            throw new Error("No refresh token found");
          }

          // Giải mã refresh token
          const decryptedRefreshToken = decrypt(refreshToken);

          if (typeof decryptedRefreshToken !== "string") {
            throw new Error("Decrypted refresh token is not a string");
          }

          const formData = new FormData();
          formData.append("refresh", decryptedRefreshToken); // Đảm bảo giá trị là chuỗi

          const response = await fetch(`${baseURL}${endpoints.refresh}`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }

          const data = await response.json();

          if (typeof window !== "undefined") {
            localStorage.setItem("token", encrypt(data.access));
          }

          set({ token: data.access, isAuthenticated: true });
          get().scheduleTokenCheck();
        } catch (error) {
          console.error("Refresh login error:", error);
          set({ isAuthenticated: false, token: null });
          get().logout();
        }
      },

      scheduleTokenCheck: () => {
        const encryptedExpires = localStorage.getItem("expires");
        const expires = encryptedExpires
          ? Number(decrypt(encryptedExpires))
          : 0;
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = expires - currentTime;

        if (remainingTime > 0) {
          const refreshTime = remainingTime * 0.75 * 1000;

          setTimeout(async () => {
            try {
              await get().refreshLogin();
            } catch {
              get().logout();
            }
          }, refreshTime);

          setTimeout(() => {
            get().logout();
          }, remainingTime * 1000);
        }
      },
    }),

    {
      name: "auth-storage",
      getStorage: () => localStorage,
    } as AuthPersist
  )
);
