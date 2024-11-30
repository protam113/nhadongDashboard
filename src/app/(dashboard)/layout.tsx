// src/layout/DashboardLayout.tsx
'use client';

import DefaultLayout from "@/components/layout/DefautLayout";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Loading from "@/components/design/Loading";

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login'); // Điều hướng tới trang đăng nhập nếu chưa đăng nhập
        } else {
            setIsLoading(false); // Khi xác thực xong thì ẩn loading
        }
    }, [isAuthenticated, loading, router]);

    if (loading || isLoading) {
        return <Loading />; // Hiển thị Loading trong khi đang xác thực
    }

    return (
        <DefaultLayout>
            {children}
        </DefaultLayout>
    );
}
