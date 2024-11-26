"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Typography, Spin,Modal  } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa"; // Import refresh icon
import {useDeleteCategory} from "@/hooks/cateogry/useCategories";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { EyeOutlined } from "@ant-design/icons";
import {NewsList} from "@/lib/newsList";
import NewsQueueList from "@/app/(dashboard)/news/NewsQueueTable";
import NewsDetailsModal from "@/app/(dashboard)/news/NewsDetailsModal";

const { Title } = Typography;

const News: React.FC = () => {
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [model] = useState<string>(""); // State to hold selected model
    const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
    const { mutate: deleteCategory } = useDeleteCategory();
    const [selectedNews, setSelectedNews] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Pass model into CategoriesList
    const { queueData, isLoading, isError } = NewsList(currentPage, model, refreshKey);

    const handleDelete = (categoryId: string) => {
        // Show confirmation dialog before deletion
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa thể loại này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                deleteCategory(categoryId);
            },
        });
    };

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
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Tiêu Đề",
            dataIndex: "title",
            key: "title",
            width: 400,
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Thể Loại",
            dataIndex: "categories",
            key: "categories",
            width: 150,
            render: (categories) => (
                <span>
                        {categories.map((category: any) => (
                            <div
                                key={category.id}
                                style={{
                                    backgroundColor: category.color || '#142857', // Màu nền tùy chọn cho thể loại
                                    color: '#fff', // Màu chữ
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    marginBottom: '5px',
                                    marginRight: '5px',
                                }}
                            >
                                {category.name} {/* Hiển thị tên của thể loại */}
                            </div>
                        ))}
                    </span>
            ),
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: 100,
            render: (_, record) => (
                <>
                    <Button danger onClick={() => handleDelete(record.id)}>
                        <MdOutlineDelete className="text-albert-error" />
                    </Button>
                    <Button>
                        <FaRegEdit />
                    </Button>
                </>
            ),
        },
    ];


    if (isLoading) return <Spin size="large" />;
    if (isError) return <div>Error loading queue data.</div>;

    const handleViewDetails = (news: any) => {
        setSelectedNews(news);
        setIsModalVisible(true);
    };

    // Function to handle closing the modal
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedNews(null);
    };


    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1); // Refresh data manually
    };

    return (
        <>
            <div className="p-4">
                <Title level={2}>Quản Lý Tin Tức</Title>

                {/* Model selection */}
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={handleRefresh} style={{marginLeft: "8px"}}>
                        <FaSync/> Làm mới
                    </Button>
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
                    <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                        Previous
                    </Button>
                    <span style={{margin: "0 8px"}}>Page {currentPage}</span>
                    <Button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
                </div>
                <NewsQueueList/>
            </div>
            <NewsDetailsModal
                visible={isModalVisible}
                onClose={handleModalClose}
                news={selectedNews}
            />
        </>
    );
};

export default News;