"use client"; // Đảm bảo đây là client component

import React, { useState } from 'react';
import {Table, Button, Spin, Pagination} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'; // Icon từ Ant Design
import type { ColumnsType } from 'antd/es/table';
import {UserList} from "@/lib/userList";

const UserQueueList: React.FC = () => {
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [seeMore, setSeeMore] = useState(false);

    // Gọi hook `UserQueue` và thêm `refreshKey` làm dependency để làm mới dữ liệu
    const { queueData, isLoading, isError, handleActiveUser } = UserList(
        currentPage,
        "false"  // Truyền "false" cho is_active
    );


    const handleBulkApprove = () => {
        handleActiveUser(selectedKeys, 'approved');
        setSelectedKeys([]);
    };

    // const handleBulkReject = () => {
    //     handleActiveUser(selectedKeys, 'rejected');
    //     setSelectedKeys([]);
    // };

    const columns: ColumnsType<any> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (text) => <span>{text}</span>,
        },
        // {
        //     title: 'Ngày Tạo',
        //     dataIndex: 'created_date',
        //     key: 'created_date',
        //     width: 150,
        //     render: (text) => <span>{new Date(text).toLocaleString()}</span>,
        // },
        // {
        //     title: 'Ngày Cập Nhật',
        //     dataIndex: 'updated_date',
        //     key: 'updated_date',
        //     width: 150,
        //     render: (text) => <span>{new Date(text).toLocaleString()}</span>,
        // },
        {
            title: 'Nội Dung',
            dataIndex: 'data',
            key: 'data',
            width: 400,
            render: (text) => {
                let dataObject;
                try {
                    // Kiểm tra xem text có phải là chuỗi JSON không
                    if (typeof text === 'string') {
                        dataObject = JSON.parse(
                            text.replace(/'/g, '"').replace(/False/g, 'false').replace(/True/g, 'true')
                        );
                    } else {
                        dataObject = {};
                    }
                } catch (error) {
                    console.error('Invalid JSON:', error);
                    dataObject = {};
                }

                const content = [
                    `Username: ${dataObject.username || ''}`,
                    `Email: ${dataObject.email || ''}`,
                    `Phone Number: ${dataObject.phone_number || ''}`,
                    `First Name: ${dataObject.first_name || ''}`,
                    `Last Name: ${dataObject.last_name || ''}`,
                    `Is Active: ${dataObject.is_active ? 'Yes' : 'No'}`,
                    `Date Joined: ${dataObject.date_joined || ''}`,
                    `Profile Image: ${dataObject.profile_image || ''}`,
                ];

                return (
                    <div>
                        {content.slice(0, seeMore ? content.length : 4).map((item, index) => (
                            <p key={index}>{item}</p>
                        ))}
                        {content.length > 4 && (
                            <Button
                                type="link"
                                onClick={() => setSeeMore(!seeMore)}
                                className="mt-1"
                                icon={seeMore ? <MinusOutlined/> : <PlusOutlined/>}
                            />
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Hình Thức',
            dataIndex: 'description',
            key: 'description',
            width: 150,
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Hành Động',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            filters: [
                { text: 'Create', value: 'create' },
                { text: 'Edit', value: 'edit' },
                { text: 'Delete', value: 'delete' },
            ],
            onFilter: (value, record) => record.action.includes(value),
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Approve', value: 'approve' },
                { text: 'Reject', value: 'reject' },
                { text: 'Error', value: 'error' },
            ],
            onFilter: (value, record) => record.status.includes(value),
            render: (text) => {
                let bgColor;

                if (text === 'pending') {
                    bgColor = 'bg-albert-warning';
                } else if (text === 'approve') {
                    bgColor = 'bg-albert-success';
                } else if (text === 'reject') {
                    bgColor = 'bg-albert-error';
                } else if (text === 'error') {
                    bgColor = 'bg-red-600'; // Customize as needed for 'error'
                }

                return (
                    <span className={`${bgColor} text-white px-2 py-1 rounded`}>
                    {text}
                </span>
                );
            },
        },
    ];


    if (isLoading) return <Spin size="large" />;
    if (isError) return <div>Error loading queue data.</div>;

    return (
        <div className="p-4">
            <h1 className='text-16 font-bold mt-4'>Quản lý hàng đợi duyệt người dùng</h1>
            <div className="p-4">
            <Button type="primary" onClick={handleBulkApprove} style={{ marginBottom: '16px' }}>
                Chấp Thuận
            </Button>
            </div>
            <div className="overflow-auto" style={{ maxHeight: '800px' }}>
                <Table
                    columns={columns}
                    dataSource={queueData}
                    rowKey="id"
                    pagination={false}
                    scroll={{ y: 500 }}
                    rowSelection={{
                        selectedRowKeys: selectedKeys,
                        onChange: (selectedRowKeys) => setSelectedKeys(selectedRowKeys as number[]),
                    }}
                />
            </div>
            <div className="flex justify-center mt-4">
                <Pagination
                    current={currentPage} // Trang hiện tại
                    onChange={(page) => {
                        setCurrentPage(page); // Cập nhật trang hiện tại
                    }}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default UserQueueList;
