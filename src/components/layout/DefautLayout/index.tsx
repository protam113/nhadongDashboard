"use client";

import React, { useState, ReactNode } from 'react';
import { Layout ,Breadcrumb} from 'antd';
import HeaderComponent from '../../header';  // Import HeaderComponent
import SidebarComponent from '../../sidebar';
import Footer from "@/components/footer"; // Import SidebarComponent

const { Content } = Layout;



interface DefaultLayoutProps {
    children: ReactNode; // Khai báo kiểu cho children
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {

    const [collapsed, setCollapsed] = useState(false); // Trạng thái collapsed

    return (
        <Layout>
            <SidebarComponent collapsed={collapsed}  /> {/* Truyền trạng thái collapsed vào đây */}
            <Layout style={{ marginLeft: collapsed ? 80 : 200 }}> {/* Căn chỉnh layout margin dựa trên trạng thái sidebar */}
                <HeaderComponent collapsed={collapsed} toggleCollapse={() => setCollapsed(!collapsed)} />
                <Breadcrumb>

                </Breadcrumb>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: 'white',
                        overflow: 'initial',
                    }}
                >
                    {children} {/* Render the children here */}
                </Content>
                <Footer />
            </Layout>
        </Layout>
    );
};

export default DefaultLayout;
