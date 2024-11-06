// src/layout.tsx
"use client";

import "../styles/globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AuthProvider } from '@/context/authContext';
import ReactQueryProvider from "@/app/ReactQueryProvider";
import {UserProvider} from "@/context/userProvider";


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <UserProvider>
                <ReactQueryProvider >
                    <html lang="en">
                        <body>
                            <AntdRegistry>
                                {children}
                            </AntdRegistry>
                        </body>
                    </html>
                </ReactQueryProvider>
            </UserProvider>
        </AuthProvider>
    );
}
