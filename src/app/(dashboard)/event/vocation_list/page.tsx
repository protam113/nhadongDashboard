"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Typography, Spin  } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa"; // Import refresh icon
import { EyeOutlined } from "@ant-design/icons";
import NewsQueueList from "@/app/(dashboard)/news/NewsQueueTable";
import NewsDetailsModal from "@/app/(dashboard)/news/NewsDetailsModal";
import {EventList} from "@/lib/eventList";
import Heading from "@/components/design/Heading";
import PushButton from "@/components/Button/PushButton";

const { Title } = Typography;

const Page: React.FC = () => {
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [category] = useState<string>("vocation"); // State to hold selected model
    const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
    const [selectedNews, setSelectedNews] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Pass model into CategoriesList
    const { queueData, isLoading, isError } = EventList(currentPage, category, refreshKey);



    const columns: ColumnsType<any> = [
        {
            title: "Chi Tiết",
            dataIndex: "full",
            key: "full",
            width: 150,
            render: (_, record) => (
                <Button onClick={() => handleViewDetails(record)}>
                    <EyeOutlined /> Xem Chi Tiết
                </Button>
            ),
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
            render: (text, record, index) => <span>{index + 1}</span>,
        },
        {
            title: "Tiêu Đề",
            dataIndex: "title",
            key: "title",
            width: 400,
            render: (text) => <span>{text}</span>,
        },
        // {
        //     title: "Thể Loại",
        //     dataIndex: "categories",
        //     key: "categories",
        //     width: 150,
        //     render: (categories) => (
        //         <span>
        //                 {categories.map((category: any) => (
        //                     <div
        //                         key={category.id}
        //                         style={{
        //                             backgroundColor: category.color || '#142857', // Màu nền tùy chọn cho thể loại
        //                             color: '#fff', // Màu chữ
        //                             padding: '5px 10px',
        //                             borderRadius: '4px',
        //                             marginBottom: '5px',
        //                             marginRight: '5px',
        //                         }}
        //                     >
        //                         {category.name} {/* Hiển thị tên của thể loại */}
        //                     </div>
        //                 ))}
        //             </span>
        //     ),
        // },
    ];


    if (isLoading) return <Spin size="large" />;
    if (isError) return <div>Error loading queue data.</div>;

    const handleViewDetails = (news: any) => {
        setSelectedNews(news);
        setIsDrawerOpen(true);
    };

    // // Function to handle closing the modal
    // const handleModalClose = () => {
    //     setIsDrawerOpen(false);
    //     setSelectedNews(null);
    // };


    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1); // Refresh data manually
    };

    return (
        <>
            <div className="p-4">
                <Heading name="Quản lý danh sách Ơn Gọi  "/>

                {/* Model selection */}
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={handleRefresh} style={{marginLeft: "8px"}}>
                        <FaSync/> Làm mới
                    </Button>
                    <PushButton href="/event/vocation_list/create_vocation" label={"Tạo Ơn Gọi"}/>
                </div>

                <div className="overflow-auto" style={{maxHeight: "800px"}}>
                    <Table
                        columns={columns}
                        dataSource={queueData}
                        rowKey="id"
                        pagination={false}
                        scroll={{y: 500}}
                        rowSelection={{
                            selectedRowKeys: selectedKeys,
                            onChange: (selectedRowKeys) => setSelectedKeys(selectedRowKeys as number[]),
                        }}
                    />
                </div>
                <div style={{marginTop: "16px", textAlign: "center"}}>
                    <Button disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                        Previous
                    </Button>
                    <span style={{margin: "0 8px"}}>Page {currentPage}</span>
                    <Button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
                </div>
                {/*<NewsQueueList/>*/}
            </div>
            {/*<NewsDetailsModal*/}
            {/*    open={isDrawerOpen}*/}
            {/*    onClose={handleModalClose}*/}
            {/*    news={selectedNews}*/}
            {/*/>*/}
        </>
    );
};

export default Page;
