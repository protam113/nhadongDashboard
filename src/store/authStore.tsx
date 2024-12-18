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

// Hàm tiện ích để xử lý API
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const { getToken, logout } = useAuthStore.getState(); // Truy cập store Zustand
  const token = getToken();

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      console.warn("Unauthorized! Logging out...");
      logout(); // Tự động đăng xuất
      return null;
    }

    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

// Zustand store
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

              const userResponse = await fetchWithAuth(
                  `${baseURL}${endpoints.currentUser}`,
                  { method: "GET" }
              );

              if (!userResponse) return;

              const userData = await userResponse.json();

              set({
                isAuthenticated: true,
                token: data.access,
                loading: false,
                userInfo: userData,
              });
            } catch (error) {
              console.error("Login error:", error);
              set({ isAuthenticated: false, token: null, loading: false });
              throw error;
            }
          },

          logout: () => {
            if (typeof window !== "undefined") {
              localStorage.clear();
              document.cookie = "refresh=; path=/; max-age=0";
              document.cookie = "user_info=; path=/; max-age=0";
            }
            set({
              isAuthenticated: false,
              token: null,
              userInfo: null,
            });
            window.location.href = "/login";
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
                const response = await fetchWithAuth(
                    `${baseURL}${endpoints.currentUser}`,
                    { method: "GET" }
                );

                if (!response) return;

                const userData = await response.json();

                if (userData.role?.name === "user") {
                  get().logout();
                  window.location.href = "/login";
                  return;
                }

                set({ userInfo: userData });
              } catch (error) {
                console.error("checkAuth error:", error);
                get().logout();
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

              const decryptedRefreshToken = decrypt(refreshToken);
              const formData = new FormData();
              formData.append("refresh", decryptedRefreshToken);

              const response = await fetchWithAuth(`${baseURL}${endpoints.refresh}`, {
                method: "POST",
                body: formData,
              });

              if (!response) return;

              const data = await response.json();
              localStorage.setItem("token", encrypt(data.access));
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
