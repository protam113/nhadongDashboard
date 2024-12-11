"use client";

import DefaultLayout from "@/components/layout/DefautLayout";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Loading from "@/components/design/Loading";
import { UserProvider } from "@/context/userProvider";
import ScrollToTopButton from "@/components/Button/ScrollButton";
import { message } from "antd";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [tokenChecked, setTokenChecked] = useState(false); // Trạng thái kiểm tra token

  // Kiểm tra trạng thái xác thực khi mount
  useEffect(() => {
    checkAuth(); // Kiểm tra xác thực khi mount trang
  }, []); // Chỉ chạy 1 lần khi trang load lại

  // Cập nhật tokenChecked sau khi kiểm tra xong
  useEffect(() => {
    if (!loading) {
      setTokenChecked(true); // Token đã được kiểm tra
    }
  }, [loading]);

  useEffect(() => {
    if (tokenChecked) {
      if (isAuthenticated) {
        // Không chuyển hướng nếu đã xác thực
        console.error("User is authenticated");
      } else {
        // Nếu chưa xác thực, chuyển hướng về login
        message.error("Bạn Không Có Quyền Truy Cập Vào Trang !!");
        router.replace("/login");
      }
    }
  }, [isAuthenticated, loading, router, tokenChecked]);

  // Nếu đang loading, hiển thị Loading spinner
  if (loading || !tokenChecked) {
    return <Loading />;
  }

  return (
    <UserProvider>
      <DefaultLayout>
        {children}
        <ScrollToTopButton />
      </DefaultLayout>
    </UserProvider>
  );
}
