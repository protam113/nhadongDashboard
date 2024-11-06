"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Typography, Spin, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa"; // Import refresh icon
import { CategoriesList } from "@/lib/categoriesList";
import { useDeleteCategory } from "@/hooks/cateogry/useCategories";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import CreateBlogCategory from "./CreateBlogCategory";

const { Title } = Typography;

const BlogCategories: React.FC = () => {
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
    const { mutate: deleteCategory } = useDeleteCategory();

    const { queueData, isLoading, isError } = CategoriesList(currentPage, "blog", refreshKey);

    const handleDelete = (categoryId: string) => {
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
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 100,
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 400,
            render: (text) => <span>{text}</span>,
        },
        {
            title: "File",
            dataIndex: "file",
            key: "file",
            width: 150,
            render: (text) => <span>{text}</span>,
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

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleCreateCategory = () => {
        setIsModalVisible(true); // Show the modal when "Create Category" is clicked
    };

    const handleCancelModal = () => {
        setIsModalVisible(false); // Hide the modal when cancelled
    };

    return (
        <>
            <div className="p-4">
                <Title level={2}>Quản Lý Thể Loại Bài Viết</Title>

                <div className="flex justify-between items-center mb-4">
                    <Button onClick={handleRefresh}>
                        <FaSync /> Làm mới
                    </Button>
                    <Button type="primary" onClick={handleCreateCategory}>
                        Tạo Thể Loại
                    </Button>
                </div>

                <div className="overflow-auto" style={{ maxHeight: "800px" }}>
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
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Previous
                    </Button>
                    <span style={{ margin: "0 8px" }}>Page {currentPage}</span>
                    <Button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
                </div>
            </div>

            {/* Modal to Create Blog Category */}
            <Modal
                title="Tạo Thể Loại"
                visible={isModalVisible}
                onCancel={handleCancelModal}
                footer={null}
                width={600}
            >
                <CreateBlogCategory /> {/* Render the CreateBlogCategory form inside the modal */}
            </Modal>
        </>
    );
};

export default BlogCategories;
