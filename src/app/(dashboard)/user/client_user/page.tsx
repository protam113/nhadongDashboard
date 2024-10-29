// pages/User.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Define the structure for user data
interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    created_at: string;
    created_by: string;
    image: string;
}

const UserPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    // Fetching user data (replace with your API call)
    useEffect(() => {
        // Sample data for demonstration
        setUsers([
            {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '123456789',
                created_at: '2023-01-01',
                created_by: 'Admin',
                image: '/images/john-doe.png',
            },
            {
                id: 2,
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane.smith@example.com',
                phone: '987654321',
                created_at: '2023-02-01',
                created_by: 'Admin',
                image: '/images/jane-smith.png',
            },
        ]);
    }, []);

    // Columns for the Ant Design Table
    const columns: ColumnsType<User> = [
        {
            title: 'Name',
            dataIndex: 'first_name',
            key: 'name',
            render: (_, record) => `${record.first_name} ${record.last_name}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Created By',
            dataIndex: 'created_by',
            key: 'created_by',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button icon={<PlusOutlined />} onClick={() => console.log('Expand user', record.id)} />
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>User List</Title>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                expandable={{
                    expandedRowRender: (record) => (
                        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '10px', borderTop: '1px solid #f0f0f0' }}>
                            <Image
                                width={100}
                                src={record.image}
                                alt={`${record.first_name} ${record.last_name}`}
                                style={{ borderRadius: '8px', marginRight: '16px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0 }}>
                                    <strong>Full Name:</strong> {record.first_name} {record.last_name}
                                </p>
                                <p style={{ margin: '4px 0' }}>
                                    <strong>Email:</strong> {record.email}
                                </p>
                                <p style={{ margin: '4px 0' }}>
                                    <strong>Phone:</strong> {record.phone}
                                </p>
                                <p style={{ margin: '4px 0' }}>
                                    <strong>Created At:</strong> {record.created_at}
                                </p>
                                <p style={{ margin: '4px 0' }}>
                                    <strong>Created By:</strong> {record.created_by}
                                </p>
                            </div>
                        </div>
                    ),
                    rowExpandable: (record) => record.email !== 'Not Expandable',
                }}
            />
        </div>
    );
};

export default UserPage;
