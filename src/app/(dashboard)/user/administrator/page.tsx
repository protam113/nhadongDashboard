'use client';

import React, { useState } from 'react';
import { Table, Button, Input, Popconfirm, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // Sử dụng next/navigation cho Next.js 13

const dataSource = [
    {
        key: '1',
        username: 'admin1',
        fullName: 'Nguyen Van A',
        phone_number: '0123456789',
        mail: 'admin1@example.com',
        role: 'Admin',
    },
    {
        key: '2',
        username: 'manager1',
        fullName: 'Tran Thi B',
        phone_number: '0987654321',
        mail: 'manager1@example.com',
        role: 'Manager',
    },
    // Thêm dữ liệu mẫu khác ở đây
];

const ManageUsersPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const router = useRouter(); // Khai báo useRouter tại đây

    const handleDelete = (key: string) => {
        // Logic để xóa người dùng
        message.success(`Đã xóa người dùng với ID: ${key}`);
    };

    const filteredData = dataSource.filter(user =>
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Họ và Tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Email',
            dataIndex: 'mail',
            key: 'mail',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_ : any, record: any) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa người dùng này?"
                    onConfirm={() => handleDelete(record.key)}
                >
                    <Button type="link" danger>Xóa</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Quản lý người dùng</h1>
            <Button type="primary" onClick={() => router.push('/user/administrator/create_manager')} style={{ marginBottom: '20px' }}>
                Thêm Quản Trị Viên
            </Button>
            <Input
                placeholder="Tìm kiếm người dùng..."
                prefix={<SearchOutlined />}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 300, marginBottom: 20 }}
            />
            <Table
                dataSource={filteredData}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey="key"
            />
        </div>
    );
};

export default ManageUsersPage;
