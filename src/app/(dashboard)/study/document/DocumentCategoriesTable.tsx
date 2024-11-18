"use client";


import React, { useState } from "react";
import { Table, Button, Typography, Spin, Modal, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa";
import { CategoriesList } from "@/lib/categoriesList";
import { useDeleteCategory } from "@/hooks/cateogry/useCategories";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import CreateDocsCategoryModal from "@/app/(dashboard)/study/document/modal/CreateDocsCategoryModal";
import EditBlogCategory from "@/app/(dashboard)/blog/blog_categories/EditBlogCategory";

const { Title } = Typography;


const DocumentCategoriesTable: React.FC = () => {
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // For creating category
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // For editing category
    const [editingCategory, setEditingCategory] = useState(null);

    const { mutate: deleteCategory } = useDeleteCategory();

    const { queueData, isLoading, isError } = CategoriesList(currentPage, "document", refreshKey);

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

    const handleEdit = (editCategory: any) => {
        if (!editCategory.id) {
            console.error("ID thể loại không hợp lệ!");
            return;
        }
        setEditingCategory(editCategory);
        setIsEditModalVisible(true); // Mở modal chỉnh sửa
    };


    const columns: ColumnsType<any> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 200,
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Tên Thể Loại",
            dataIndex: "name",
            key: "name",
            width: 400,
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Hình Ảnh",
            dataIndex: "image",
            key: "image",
            width: 200,
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
            title: "Thao Tác",
            dataIndex: "action",
            key: "action",
            width: 100,
            render: (_, record) => (
                <>
                    <Button danger onClick={() => handleDelete(record.id)} className="mr-2">
                        <MdOutlineDelete className="text-albert-error" />
                    </Button>
                    <Button onClick={() => handleEdit(record)}>
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
        setIsCreateModalVisible(true); // Show the modal when "Create Category" is clicked
    };

    const handleCancelCreateModal = () => {
        setIsCreateModalVisible(false); // Hide the create category modal
    };

    const handleCancelEditModal = () => {
        setIsEditModalVisible(false); // Hide the edit category modal
        setEditingCategory(null); // Reset editing category
    };

    return (
        <>
            <div className="p-4">
                <Title level={2}>Quản Lý Thể Loại Tài Liệu</Title>

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

            {/* Modal tạo thể loại */}
            <Modal
                title="Tạo Thể Loại"
                visible={isCreateModalVisible}
                onCancel={handleCancelCreateModal}
                footer={null}
                width={600}
            >
                <CreateDocsCategoryModal /> {/* Render CreateBlogCategory form */}
            </Modal>

            {/* Modal sửa thể loại */}

            <Modal
                title="Sửa Thể Loại"
                visible={isEditModalVisible}
                onCancel={handleCancelEditModal}
                footer={null}
                width={600}
            >
                <EditBlogCategory category={editingCategory}/> {/* Render CreateBlogCategory form */}
            </Modal>
        </>
    );
};

export default DocumentCategoriesTable;
