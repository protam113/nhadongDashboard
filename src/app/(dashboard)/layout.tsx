"use client";

import DefaultLayout from "@/components/layout/DefautLayout";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Loading from "@/components/design/Loading";
import { UserProvider } from "@/context/userProvider";
import ScrollToTopButton from "@/components/Button/ScrollButton";

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
    // console.log('Checking loading and authentication...');
    // console.log('Loading:', loading);
    // console.log('Authenticated:', isAuthenticated);
    // console.log('Token:', localStorage.getItem('token'));

    // Chỉ thực hiện chuyển hướng khi trạng thái loading đã hoàn tất và chưa xác thực
    if (tokenChecked) {
      if (isAuthenticated) {
        // Không chuyển hướng nếu đã xác thực
        console.log("User is authenticated");
      } else {
        // Nếu chưa xác thực, chuyển hướng về login
        console.log("User not authenticated");
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
