"use client";

import React, {useState} from "react";
import {Table, Spin, Pagination, Button} from "antd";
import { useUserList } from "@/hooks/user/useUsers";
import { useRouter } from "next/navigation";
import {FaSync} from "react-icons/fa";

const ManageUsersPage: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const router = useRouter(); // Hook for navigation
    const [refreshKey, setRefreshKey] = useState(0);
    // Pass multiple roles as an array
    const { data, isLoading, isError, isFetching } = useUserList(currentPage, {
        role: ["5a09a8f0-cd62-4a52-aa83-e5655ba4ef1a", "56ac28ae-14e3-422d-acce-666dad4f8d15"],
    },
        refreshKey);

    if (isError) {
        return <div>Error fetching users</div>;
    }

    if (isLoading) {
        return <Spin size="large" />;
    }

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1); // Refresh data manually
    };

    const users = data?.results || [];
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


    const handleCreateManager = () => {
        router.push("/user/administrator/create_manager"); // Navigate to the create category page
    };
    const handleAddManager = () => {
        router.push("/user/administrator/them_manager_tu_list"); // Navigate to the create category page
    };
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                <h1 className="mt-4 text-20 font-bold">Quản Lý Quản Trị Viên</h1>
                <Button onClick={handleRefresh} style={{marginLeft: "8px"}}>
                    <FaSync/> Làm mới
                </Button>
                </div>
                <div className="flex space-x-4">
                    {/* Button with border and rounded corners */}
                    <Button
                        onClick={handleAddManager}
                        type="default" // dùng "default" cho nút viền, hoặc "primary" cho nút màu nền
                        className="border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-300 rounded-full flex items-center justify-center"
                        style={{ padding: '8px 16px', minWidth: 'auto' }} // Điều chỉnh padding để kích thước phù hợp
                    >
                        Thêm Quản Trị Viên từ danh sách
                    </Button>

                    {/* Button without border */}
                    <Button
                        type="primary"
                        onClick={handleCreateManager}
                        className="w-auto"
                    >
                        Tạo Quản Trị Viên
                    </Button>
                </div>


            </div>
            <Table dataSource={users} columns={columns} rowKey="id" pagination={false}/>
            <div className="flex justify-center mt-4">
                <Pagination
                    current={currentPage}
                    pageSize={20}
                    total={data?.count || 0}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                />
            </div>
            {isFetching && <Spin size="small"/>}
        </div>
    );
};

export default ManageUsersPage;
