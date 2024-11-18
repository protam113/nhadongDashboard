"use client"; // Ensures this is a client component

import React, { useState } from "react";
import {Table, Button, Typography, Spin, Modal, Image} from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa"; // Import refresh icon
import {useDeleteCategory} from "@/hooks/cateogry/useCategories";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
// import NewsDetailsModal from "@/app/(dashboard)/news/NewsDetailsModal";
// import DocumentCategoriesTable from "@/app/(dashboard)/study/document/DocumentCategoriesTable";
// import DocumentQueueList from "@/app/(dashboard)/study/document/DocumentQueueTable";
import {GroupList} from "@/lib/groupList";

const { Title } = Typography;

const Groups: React.FC = () => {
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [model] = useState<string>(""); // State to hold selected model
    const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
    const { mutate: deleteCategory } = useDeleteCategory();

    // Pass model into CategoriesList
    const { queueData, isLoading, isError } = GroupList(currentPage, model, refreshKey);

    const handleDelete = (categoryId: string) => {
        // Show confirmation dialog before deletiona
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
            width: 150,
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Hình Ảnh",
            dataIndex: "image",
            key: "image",
            width: 150,
            render: (fileUrl: string) => (
                <Image
                    width={100}
                    src={fileUrl}
                    preview={{
                        destroyOnClose: true,
                    }}
                    alt="Category Image"
                />
            ),
        },
        {
            title: "Tên Cộng Đoàn",
            dataIndex: "name",
            key: "name",
            width: 400,
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Ngày Thành Lập",
            dataIndex: "founding_date",
            key: "founding_date",
            width: 150,
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Ngày Tạo",
            dataIndex: "created_date",
            key: "created_date",
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
        setRefreshKey((prev) => prev + 1); // Refresh data manually
    };

    return (
        <>
            <div className="p-4">
                <Title level={2}>Quản Lý Tài Liệu</Title>

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
                {/*<DocumentCategoriesTable/>*/}
                {/*<DocumentQueueList/>*/}
            </div>
            {/*<NewsDetailsModal*/}
            {/*    visible={isModalVisible}*/}
            {/*    onClose={handleModalClose}*/}
            {/*    news={selectedNews}*/}
            {/*/>*/}

        </>
    );
};

export default Groups;
