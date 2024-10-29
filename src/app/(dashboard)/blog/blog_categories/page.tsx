'use client';

import React from 'react';
import { Table, Button, Space, Image } from 'antd';
import {FaTrashAlt} from "react-icons/fa";

const CategoryImage: React.FC<{ src: string }> = ({ src }) => {
    return <Image src={src} width={100} alt="Category Image" />;
};

const BlogCategories: React.FC = () => {
    const categories = [
        {
            id: 1,
            name: 'Category 1',
            image: 'link-to-category-image1',
            create_by: 1,
            create_at: '2024-01-01',
            update_at: '2024-01-02',
        },
        {
            id: 2,
            name: 'Category 2',
            image: 'link-to-category-image2',
            create_by: 1,
            create_at: '2024-01-03',
            update_at: '2024-01-04',
        },
        // Thêm các danh mục khác tại đây
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text: string) => <CategoryImage src={text} />, // Sử dụng component CategoryImage
        },
        {
            title: 'Create By',
            dataIndex: 'create_by',
            key: 'create_by',
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
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Blog Categories</h1>
                <Button type="primary">Tạo Danh Mục</Button>
            </div>
            <Table dataSource={categories} columns={columns} rowKey="id" />
        </div>
    );
};

export default BlogCategories;
