// pages/User.tsx
'use client';

import React
    // , { useState, useEffect }
    , {useState} from 'react';
import {
    Table
    // , Typography, Button, Image
    , Spin, Pagination, Button
} from 'antd';
// import type { ColumnsType } from 'antd/es/table';
// import { PlusOutlined } from '@ant-design/icons';
import {useUserList} from "@/hooks/user/useUsers";
import {FaSync} from "react-icons/fa";

// const { Title } = Typography;

// Define the structure for user data

const UserPage: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
     const [refreshKey, setRefreshKey] = useState(0);
    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useUserList(currentPage, {
        role: ["dd8ef7c3-9b02-49f5-bfe9-962ecbe14f77"]
    },refreshKey); // Truyền currentPage vào hook
    // Xử lý lỗi
    if (isError) {
        return <div>Error fetching users</div>;
    }

    // Hiển thị loading khi đang tải dữ liệu
    if (isLoading) {
        return <Spin size="large" />;
    }


    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1); // Refresh data manually
    };
    // Columns for the Ant Design Table
    const users = data?.results || []; // Dùng results trực tiếp từ dữ liệu

    // Cột hiển thị cho Table
    const columns = [
        {
            title: "ID",
            key: "id",
            render: (_: any, record: any, index: number) => index + 1, // This will display index + 1 as the ID
        },
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "First Name", dataIndex: "first_name", key: "first_name" },
        { title: "Last Name", dataIndex: "last_name", key: "last_name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone Number", dataIndex: "phone_number", key: "phone_number" },
    ];

    return (
        <div>
            <h1 className='mt-4 text-16 font-bold'>Quản Lý Người Dùng</h1>
            <Button onClick={handleRefresh} style={{marginLeft: "8px"}}>
                <FaSync/> Làm mới
            </Button>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
            <div className="flex justify-center mt-4">
                <Pagination
                    current={currentPage} // Trang hiện tại
                    pageSize={20}
                    total={data?.count || 0} // Tổng số người dùng
                    onChange={(page) => {
                        setCurrentPage(page); // Cập nhật trang hiện tại
                    }}
                    showSizeChanger={false}
                />
            </div>
                {isFetching && <Spin size="small"/>} {/* Hiển thị loading khi đang tải dữ liệu */}
        </div>
            );
            };

            export default UserPage;
