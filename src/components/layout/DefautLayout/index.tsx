"use client";

import React, { useState, ReactNode } from 'react';
import { Layout, Breadcrumb } from 'antd';
import HeaderComponent from '../../header';  // Import HeaderComponent
import SidebarComponent from '../../sidebar';
import Footer from "@/components/footer"; // Import Footer

const { Content } = Layout;

interface DefaultLayoutProps {
    children: ReactNode; // Khai báo kiểu cho children
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false); // Trạng thái collapsed

    return (
        <Layout style={{ minHeight: '100vh' }}> {/* Đặt chiều cao tối thiểu cho Layout */}
            <SidebarComponent collapsed={collapsed}  /> {/* Truyền trạng thái collapsed vào đây */}
            <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
                <HeaderComponent collapsed={collapsed} toggleCollapse={() => setCollapsed(!collapsed)} />
                <Breadcrumb>
                    {/* Breadcrumb items can go here */}
                </Breadcrumb>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: 'white',
                        overflow: 'initial',
                        flex: 1, // Thêm flex: 1 để Content chiếm không gian còn lại
                    }}
                >
                    {children} {/* Render the children here */}
                </Content>
                <Footer/> {/* Giữ footer ở cuối */}
            </Layout>
        </Layout>
    );
};

export default DefaultLayout;
