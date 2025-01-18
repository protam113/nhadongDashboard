"use client";

import React, { useState } from "react";
import { Table, Button, Modal, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CategoriesList } from "@/lib/categoriesList";
import { useDeleteCategory } from "@/hooks/cateogry/useCategories";
import EditBlogCategory from "@/app/(dashboard)/blog/blog_categories/EditBlogCategory";
import { FaRegEdit, MdOutlineDelete, FaSync } from "@/lib/iconLib";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import Pagination from "../Pagination";
import CreateBlogCategory from "@/app/(dashboard)/blog/blog_categories/CreateBlogCategory";

const CategoryListTable = ({
  model,
  title,
}: {
  model: string;
  title: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // For creating category
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // For editing category
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

  const { mutate: deleteCategory } = useDeleteCategory();

  const {
    queueData,
    next,
    isLoading,
    isError,
    count = 0,
  } = CategoriesList(currentPage, model, refreshKey);
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

  if (isLoading) return <SpinLoading />;
  if (isError) return <Error />;

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleCreateCategory = () => {
    setIsCreateModalVisible(true);
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
        <Heading name={`quản lý thể loại ${title}`} />

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
          />
        </div>
        {count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Modal tạo thể loại */}
      <Modal
        title="Tạo Thể Loại"
        visible={isCreateModalVisible}
        onCancel={handleCancelCreateModal}
        footer={null}
        width={600}
      >
        <CreateBlogCategory
          onLoadingChange={handleLoadingChange}
          model={model}
        />
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

export default CategoryListTable;
