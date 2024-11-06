// src/layout/DashboardLayout.tsx
'use client';

import DefaultLayout from "@/components/layout/DefautLayout";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login'); // Điều hướng tới trang đăng nhập nếu chưa đăng nhập
        }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) return null; // Đợi xác thực xong trước khi hiển thị


    return (
        <DefaultLayout>
            {children}
        </DefaultLayout>
    );
}
