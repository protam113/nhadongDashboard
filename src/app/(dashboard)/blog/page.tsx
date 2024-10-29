'use client';

import React from 'react';
import { Table, Button, Image } from 'antd';
import { useRouter } from 'next/navigation';

const BlogImage: React.FC<{ src: string }> = ({ src }) => {
    return <Image src={src} width={100} alt="Blog Image" />;
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending':
            return { backgroundColor: 'yellow', color: 'black' }; // Màu vàng cho trạng thái Pending
        case 'Approve':
            return { backgroundColor: 'lightgreen', color: 'black' }; // Màu xanh cho trạng thái Approve
        case 'Reject':
            return { backgroundColor: 'red', color: 'white' }; // Màu đỏ cho trạng thái Reject
        default:
            return {};
    }
};

const BlogOverview: React.FC = () => {
    const router = useRouter();

    const categories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
        { id: 4, name: 'Category 4' },
        { id: 5, name: 'Category 5' },
        { id: 6, name: 'Category 6' },
        { id: 7, name: 'Category 7' },
        { id: 8, name: 'Category 8' },
        { id: 9, name: 'Category 9' },
        { id: 10, name: 'Category 10' },
    ];

    const blogs = [
        {
            id: 1,
            image: 'link-to-image1',
            title: 'Blog Title 1',
            create_by: 'Author 1',
            categories: 'Category 1',
            create_at: '2024-01-01',
            status: 'Pending',
        },
        {
            id: 2,
            image: 'link-to-image2',
            title: 'Blog Title 2',
            create_by: 'Author 2',
            categories: 'Category 2',
            create_at: '2024-01-03',
            status: 'Approve',
        },
        {
            id: 3,
            image: 'link-to-image3',
            title: 'Blog Title 3',
            create_by: 'Author 3',
            categories: 'Category 3',
            create_at: '2024-01-05',
            status: 'Reject',
        },
        // Thêm các blog khác tại đây
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Blog Overview</h1>

            <h2 style={{ marginBottom: '12px' }}>Categories</h2>
            <Table
                dataSource={categories}
                rowKey="id"
                pagination={false}
                footer={() => (
                    <Button type="primary" onClick={() => router.push('/blog/blog_categories')}>
                        Xem Tất Cả Danh Mục
                    </Button>
                )}
            >
                <Table.Column title="ID" dataIndex="id" key="id" />
                <Table.Column title="Name" dataIndex="name" key="name" />
            </Table>

            <h2 style={{ marginTop: '24px', marginBottom: '12px' }}>Blogs</h2>
            <Table
                dataSource={blogs}
                rowKey="id"
                pagination={false}
                footer={() => (
                    <Button type="primary" onClick={() => router.push('/blog/blog_management')}>
                        Xem Tất Cả Bài Viết
                    </Button>
                )}
            >
                <Table.Column title="ID" dataIndex="id" key="id" />
                <Table.Column title="Image" dataIndex="image" key="image" render={(text: string) => <BlogImage src={text} />} />
                <Table.Column title="Title" dataIndex="title" key="title" />
                <Table.Column title="Create By" dataIndex="create_by" key="create_by" />
                <Table.Column title="Categories" dataIndex="categories" key="categories" />
                <Table.Column title="Create At" dataIndex="create_at" key="create_at" />
                <Table.Column
                    title="Status"
                    dataIndex="status"
                    key="status"
                    render={(status: string) => (
                        <span style={{ padding: '5px 10px', borderRadius: '4px', ...getStatusColor(status) }}>
                            {status}
                        </span>
                    )}
                />
            </Table>
        </div>
    );
};

export default BlogOverview;
