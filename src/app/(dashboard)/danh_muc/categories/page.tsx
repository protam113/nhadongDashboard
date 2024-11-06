"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Typography, Spin, Select,Modal  } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa"; // Import refresh icon
import { CategoriesList } from "@/lib/categoriesList";
import { useRouter } from "next/navigation";
import {useDeleteCategory} from "@/hooks/cateogry/useCategories";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import CategoriesQueueTable from "@/app/(dashboard)/danh_muc/categories/CategoriesQueueTable";

const { Title } = Typography;
const { Option } = Select;

const Categories: React.FC = () => {
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [model, setModel] = useState<string>(""); // State to hold selected model
    const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
    const router = useRouter(); // Hook for navigation
    const { mutate: deleteCategory } = useDeleteCategory();

    // Pass model into CategoriesList
    const { queueData, isLoading, isError } = CategoriesList(currentPage, model, refreshKey);

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
                        <FaRegEdit/>
                    </Button>
                </>
            ),
        },
    ];

    if (isLoading) return <Spin size="large" />;
    if (isError) return <div>Error loading queue data.</div>;

    const handleModelChange = (value: string) => {
        setModel(value);
        setRefreshKey((prev) => prev + 1); // Refresh data when model changes
    };

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1); // Refresh data manually
    };

    const handleCreateCategory = () => {
        router.push("/danh_muc/categories/create_category"); // Navigate to the create category page
    };



    return (
        <div className="p-4">
            <Title level={2}>Quản Lý Thể Loại</Title>

            {/* Model selection */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <Select
                        value={model}
                        onChange={handleModelChange}
                        placeholder="Chọn model"
                        style={{width: 200}}
                    >
                        <Option value="blog">Blog</Option>
                        <Option value="news">News</Option>
                        <Option value="document">Document</Option>
                    </Select>
                    <Button onClick={handleRefresh} style={{marginLeft: "8px"}}>
                        <FaSync/> Làm mới
                    </Button>
                </div>
                <Button type="primary" onClick={handleCreateCategory}>
                    Tạo Thể Loại
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
            <CategoriesQueueTable/>
        </div>
    );
};

export default Categories;