"use client";

import React, { useState } from "react";
import { Table, Button, Spin, Modal, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa";
import { CategoriesList } from "@/lib/categoriesList";
import { useDeleteCategory } from "@/hooks/cateogry/useCategories";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import CreateBlogCategory from "./CreateBlogCategory";
import EditBlogCategory from "@/app/(dashboard)/blog/blog_categories/EditBlogCategory";
import BlogCategoryModal from "@/app/(dashboard)/blog/blog_categories/BlogCategoryModal";
import Heading from "@/components/design/Heading";
import { FaArrowLeft, FaArrowRight } from "@/lib/iconLib";

const BlogCategories: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // For creating category
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // For editing category
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

  const { mutate: deleteCategory } = useDeleteCategory();

  const { queueData, next, isLoading, isError } = CategoriesList(
    currentPage,
    "blog",
    refreshKey
  );
  const totalPages = next ? currentPage + 1 : currentPage;

  const handleDelete = (categoryId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thể loại này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteCategory(categoryId);
      },
    });
  };

  // Handle loading change
  const handleLoadingChange = (isLoading: boolean) => {
    setIsCreateLoading(isLoading);
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
      width: 80,
      render: (_, __, index) => <span>{index + 1}</span>, // index + 1
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
          <Button
            danger
            onClick={() => handleDelete(record.id)}
            className="mr-2"
          >
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
        <Heading name="quản lý thể loại bài viết  " />

        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh}>
            <FaSync /> Làm mới
          </Button>
          <Button
            type="primary"
            onClick={handleCreateCategory}
            loading={isCreateLoading}
          >
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
              onChange: (selectedRowKeys) =>
                setSelectedKeys(selectedRowKeys as number[]),
            }}
          />
        </div>
        <div className="flex justify-center mt-8 items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-6 h-6 text-10 bg-gray-200 rounded-full hover:bg-gray-300 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaArrowLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-6 h-6 text-10 rounded-full hover:bg-gray-300 ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!next}
            className={`flex items-center justify-center w-6 h-6 text-10 bg-gray-200 rounded-full hover:bg-gray-300 ${
              !next ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaArrowRight />
          </button>
        </div>
        <BlogCategoryModal />
      </div>

      {/* Modal tạo thể loại */}
      <Modal
        title="Tạo Thể Loại"
        visible={isCreateModalVisible}
        onCancel={handleCancelCreateModal}
        footer={null}
        width={600}
      >
        <CreateBlogCategory onLoadingChange={handleLoadingChange} />
      </Modal>

      {/* Modal sửa thể loại */}
      <Modal
        title="Sửa Thể Loại"
        visible={isEditModalVisible}
        onCancel={handleCancelEditModal}
        footer={null}
        width={600}
      >
        <EditBlogCategory category={editingCategory} />{" "}
        {/* Hiển thị thông tin thể loại */}
      </Modal>
    </>
  );
};

export default BlogCategories;
