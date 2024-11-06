'use client';

import React, { useState } from 'react';
import { Table, Spin, Pagination, message, Button, Modal } from 'antd';
import { useUserList, useAddManager } from "@/hooks/user/useUsers";

const UserAddToManagerPage: React.FC = () => {
    const { mutate: addManagerMutation } = useAddManager();
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // Selected user ID
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Show confirmation modal
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, isError, isFetching } = useUserList(currentPage, { role: ["3"] });

    if (isError) {
        return <div>Error fetching users</div>;
    }

    if (isLoading) {
        return <Spin size="large" />;
    }

    // Handle adding user as manager
    const handleAddUser = async () => {
        if (!selectedUserId) {
            message.error('Vui lòng chọn người dùng!');
            return;
        }

        console.log('Selected User ID:', selectedUserId);  // Debugging line

        setLoading(true);
        const newUser = {
            user: selectedUserId.toString(), // Ensure ID is passed as string
            role: 'manager'
        };

        try {
            await addManagerMutation(newUser);
            message.success('Thêm người dùng thành công!');
            setShowConfirmModal(false);
        } catch (error: any) {
            console.error(error);
            message.error('Có lỗi xảy ra khi thêm người dùng.');
        } finally {
            setLoading(false);
        }
    };


    // Columns for Ant Design Table
    const users = data?.results || [];

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "First Name", dataIndex: "first_name", key: "first_name" },
        { title: "Last Name", dataIndex: "last_name", key: "last_name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone Number", dataIndex: "phone_number", key: "phone_number" },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: { id: number }) => (
                <Button
                    type="primary"
                    onClick={() => {
                        console.log('Selected User ID:', record.id);  // Debugging line
                        setSelectedUserId(record.id);
                        setShowConfirmModal(true); // Show confirmation modal
                    }}
                >
                    Thêm vào quản trị viên
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h1 className='mt-4 text-16 font-bold'>Quản Lý Người Dùng</h1>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                pagination={false}
            />

            <div className="flex justify-center mt-4">
                <Pagination
                    current={currentPage}
                    pageSize={20}
                    total={data?.count || 0}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                />
            </div>

            {isFetching && <Spin size="small" />}

            {/* Confirmation Modal */}
            <Modal
                title="Xác nhận"
                visible={showConfirmModal}
                onOk={handleAddUser}
                onCancel={() => setShowConfirmModal(false)}
                okText="Đồng ý"
                cancelText="Hủy"
                confirmLoading={loading}
            >
                <p>Bạn có chắc muốn thêm người dùng này vào quản trị viên?</p>
            </Modal>
        </div>
    );
};

export default UserAddToManagerPage;
