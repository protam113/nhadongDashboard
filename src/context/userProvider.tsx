import { useAuthStore } from "@/store/authStore";

export const useUser = () => {
  const userInfo = useAuthStore((state) => state.userInfo);

  return { userInfo };
};
