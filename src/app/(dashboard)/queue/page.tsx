'use client';

import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Typography, Checkbox } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface QueueItem {
    key: number;
    name: string;
    status: string;
}

const Queue: React.FC = () => {
    const [queueData, setQueueData] = useState<QueueItem[]>([
        { key: 1, name: 'Item 1', status: 'pending' },
        { key: 2, name: 'Item 2', status: 'pending' },
        { key: 3, name: 'Item 3', status: 'pending' },
    ]);

    // State to manage selected items
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

    // Handler to change the status of a single item
    const handleStatusChange = (key: number, status: string) => {
        const newQueueData = queueData.map(item => {
            if (item.key === key) {
                return { ...item, status };
            }
            return item;
        });
        setQueueData(newQueueData);
    };

    // Handler for bulk approval
    const handleBulkApprove = () => {
        const newQueueData = queueData.map(item => {
            if (selectedKeys.includes(item.key)) {
                return { ...item, status: 'approved' };
            }
            return item;
        });
        setQueueData(newQueueData);
        setSelectedKeys([]); // Clear selected keys after approval
    };

    // Function to determine the status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return '#82DD55'; // Green for approved
            case 'pending':
                return '#EDB95E'; // Yellow for pending
            case 'rejected':
                return '#E23636'; // Red for rejected
            default:
                return '#000'; // Default color
        }
    };

    // Columns definition for the table
    const columns: ColumnsType<QueueItem> = [
        {
            title: 'Select',
            dataIndex: 'select',
            render: (text, record) => (
                <Checkbox
                    checked={selectedKeys.includes(record.key)}
                    onChange={() => {
                        if (selectedKeys.includes(record.key)) {
                            setSelectedKeys(selectedKeys.filter(key => key !== record.key));
                        } else {
                            setSelectedKeys([...selectedKeys, record.key]);
                        }
                    }}
                />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="pending">
                                <a onClick={() => handleStatusChange(record.key, 'pending')}>Pending</a>
                            </Menu.Item>
                            <Menu.Item key="approved">
                                <a onClick={() => handleStatusChange(record.key, 'approved')}>Approved</a>
                            </Menu.Item>
                            <Menu.Item key="rejected">
                                <a onClick={() => handleStatusChange(record.key, 'rejected')}>Rejected</a>
                            </Menu.Item>
                        </Menu>
                    }
                >
                    <Button style={{ backgroundColor: getStatusColor(status), color: '#fff' }}>
                        {status} <DownOutlined />
                    </Button>
                </Dropdown>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Queue Management</Title>
            <Button type="primary" onClick={handleBulkApprove} style={{ marginBottom: '16px' }}>
                Approve Selected
            </Button>
            <Table
                columns={columns}
                dataSource={queueData}
                rowKey="key"
                pagination={false}
            />
        </div>
    );
};

export default Queue;
