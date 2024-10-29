// components/Prayer.tsx

'use client';

import React, { useState } from 'react';
import { Table ,Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface PrayerItem {
    key: number;
    title: string;
    desc: string;
    categories: string;
    date: string;
}

const Prayer: React.FC = () => {
    const [prayersData] = useState<PrayerItem[]>([
        { key: 1, title: 'Lời Nguyện 1', desc: 'Hãy cầu nguyện cho hòa bình trên thế giới.', categories: 'Hòa bình', date: '2024-10-28' },
        { key: 2, title: 'Lời Nguyện 2', desc: 'Xin Chúa ban phước cho những người cần giúp đỡ.', categories: 'Giúp đỡ', date: '2024-10-28' },
        { key: 3, title: 'Lời Nguyện 3', desc: 'Cầu nguyện cho sức khỏe của gia đình.', categories: 'Sức khỏe', date: '2024-10-28' },
    ]);

    // State to manage selected items

    // Columns definition for the table
    const columns: ColumnsType<PrayerItem> = [

        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: 'Category',
            dataIndex: 'categories',
            key: 'categories',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Lời Nguyện Hôm Nay</Title>

            <Table
                columns={columns}
                dataSource={prayersData}
                rowKey="key"
                pagination={false}
            />
        </div>
    );
};

export default Prayer;
