'use client';

import { useCookie } from '@/hooks/useCookie';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { baseURL, endpoints } from '@/apis/api';
import {AuthContextType} from "@/types/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setCookie, removeCookie } = useCookie();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Kiểm tra token trong localStorage khi khởi động
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false); // Kết thúc tải sau khi kiểm tra token
    }, []);

    const login = async (username: string, password: string) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch(`${baseURL}${endpoints.login}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', data.access);
            }

            setCookie('refresh', data.refresh, 7);
            setIsAuthenticated(true);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            // Xóa thông tin từ localStorage và cookie
            localStorage.removeItem('token');
            removeCookie('refresh');
            localStorage.removeItem('user_info');
        }

        // Cập nhật trạng thái xác thực
        setIsAuthenticated(false);

        // Tải lại toàn bộ thông tin trên trang
        // Hoặc điều hướng người dùng về trang đăng nhập
        window.location.reload(); // Cách 1: Reload toàn bộ trang
        // window.location.href = '/login'; // Cách 2: Chuyển hướng đến trang login
    };


    const getToken = () => {
        return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
