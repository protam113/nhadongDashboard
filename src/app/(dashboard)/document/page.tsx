"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import { DocsList } from "@/lib/docslist";
import Link from "next/link";
import BackButton from "@/components/Button/BackButton";
import { useDeleteDoc } from "@/hooks/document/useDocs";
import {
  FaArrowLeft,
  FaArrowRight,
  MdOutlineDelete,
  FaSync,
  FaRegEdit,
} from "@/lib/iconLib";
import EditDocumentModal from "./modal/EditDocumentDrawer";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import DocsDetailsModal from "./DocumentDetailModal";
import DocumentCategoriesTable from "./DocumentCategoriesTable";
import DocumentQueueList from "./DocumentQueueTable";

const Documents: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [model] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const { mutate } = useDeleteDoc();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // Pass model into CategoriesList
  const { queueData, next, isLoading, isError } = DocsList(
    currentPage,
    model,
    refreshKey
  );

  const totalPages = next ? currentPage + 1 : currentPage;

  const handleEdit = (blog: any) => {
    setSelectedDoc(blog); // Set blog to be edited
    setIsDrawerVisible(true); // Open the drawer
  };

  const handleDelete = (blogId: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tài liệu này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        mutate(blogId);
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
      render: (_, __, index) => <span>{index + 1}</span>, // Dynamically assign the ID based on index
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
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category) => (
        <div
          style={{
            backgroundColor: category.color || "#142857", // Background color for category
            color: "#fff", // Text color
            padding: "5px 10px",
            borderRadius: "4px",
            marginBottom: "5px",
            marginRight: "5px",
          }}
        >
          {category.name} {/* Display category name */}
        </div>
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
          <Button type="primary" onClick={() => handleEdit(record)}>
            <FaRegEdit />
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <SpinLoading />;
  if (isError) return <Error />;

  const handleViewDetails = (doc: any) => {
    setSelectedDoc(doc);
    setIsModalVisible(true);
  };

  // Function to handle closing the modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDoc(null);
  };

  const handleDrawerClose = () => {
    setSelectedDoc(null);
    setIsDrawerVisible(false); // Close the drawer
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  return (
    <>
      <div className="p-4">
        <BackButton />
        <Heading name="Quản Lý Tài Liệu (Document)" />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
            <FaSync /> Làm mới
          </Button>
          <Link href="/study/document/create_document">
            {" "}
            {/* Change the URL as needed */}
            <Button
              style={{
                marginLeft: "8px",
                backgroundColor: "#4CAF50",
                color: "white",
              }}
            >
              Tạo Mới
            </Button>
          </Link>
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
        <DocumentCategoriesTable />
        <DocumentQueueList />
      </div>
      <DocsDetailsModal
        visible={isModalVisible}
        onClose={handleModalClose}
        doc={selectedDoc}
      />
      <EditDocumentModal
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        document={selectedDoc} // Pass selected blog to EditBlogModal
      />
    </>
  );
};

export default Documents;
