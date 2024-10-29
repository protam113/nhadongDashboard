'use client';

import React from 'react';
import { Table, Button, Space, Image } from 'antd';
import { FaTrashAlt } from "react-icons/fa";

const BlogImage: React.FC<{ src: string }> = ({ src }) => {
    return <Image src={src} width={100} alt="Blog Image" />;
};

const Blog_management: React.FC = () => {
    const blogs = [
        {
            id: 1,
            image: 'link-to-image1',
            title: 'Blog Title 1',
            create_by: 'Author 1',
            categories: 'Category 1',
            create_at: '2024-01-01',
            update_at: '2024-01-02',
            status: 'Pending',
        },
        {
            id: 2,
            image: 'link-to-image2',
            title: 'Blog Title 2',
            create_by: 'Author 2',
            categories: 'Category 2',
            create_at: '2024-01-03',
            update_at: '2024-01-04',
            status: 'Approve',
        },
        {
            id: 3,
            image: 'link-to-image3',
            title: 'Blog Title 3',
            create_by: 'Author 3',
            categories: 'Category 3',
            create_at: '2024-01-05',
            update_at: '2024-01-06',
            status: 'Reject',
        },
        // Thêm các blog khác tại đây
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return { backgroundColor: '#EDB95E', color: '#000' }; // Vàng
            case 'Approve':
                return { backgroundColor: '#82DD55', color: '#000' }; // Xanh
            case 'Reject':
                return { backgroundColor: '#E23636', color: '#000' }; // Đỏ
            default:
                return { backgroundColor: '#FFFFFF', color: '#000' }; // Màu mặc định
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text: string) => <BlogImage src={text} />, // Sử dụng component BlogImage
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Create By',
            dataIndex: 'create_by',
            key: 'create_by',
        },
        {
            title: 'Categories',
            dataIndex: 'categories',
            key: 'categories',
        },
        {
            title: 'Create At',
            dataIndex: 'create_at',
            key: 'create_at',
        },
        {
            title: 'Update At',
            dataIndex: 'update_at',
            key: 'update_at',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <span style={{ padding: '5px 10px', borderRadius: '4px', ...getStatusColor(status) }}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <Button type="primary">Edit</Button>
                    <FaTrashAlt className="text-albert-error"  />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Blog</h1>
                <Button type="primary">Tạo Blog</Button>
            </div>
            <Table dataSource={blogs} columns={columns} rowKey="id" />
        </div>
    );
};

export default Blog_management;
