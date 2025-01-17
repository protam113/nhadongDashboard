"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Modal, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import { DocsList } from "@/lib/docslist";
import Link from "next/link";
import { CategoriesList } from "@/lib/categoriesList";
import BackButton from "@/components/Button/BackButton";
import { FaSync, MdOutlineDelete, FaRegEdit } from "@/lib/iconLib";
import { useDeleteDoc } from "@/hooks/document/useDocs";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import DocsDetailsModal from "../DocumentDetailModal";
import EditDocumentModal from "../modal/EditDocumentDrawer";
import Pagination from "@/components/Pagination";

const { Option } = Select;

const Page: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const { mutate } = useDeleteDoc();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [model, setModel] = useState<string>(""); // State to hold selected model
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm state loading

  // Pass model into CategoriesList
  const {
    queueData: document,
    next,
    isLoading: isDocumentLoad,
    isError: isDocumentError,
    count = 0,
  } = DocsList(currentPage, model, refreshKey);
  const {
    queueData: category,
    isLoading: isCategoryLoad,
    isError: isCategoryError,
  } = CategoriesList(currentPage, "document", refreshKey);

  const totalPages = next ? currentPage + 1 : currentPage;

  const handleEdit = (blog: any) => {
    setSelectedDoc(blog); // Set blog to be edited
    setIsDrawerVisible(true); // Open the drawer
    setLoading(false); // Đảm bảo trạng thái loading không bật
  };

  const handleDelete = (blogId: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tài liệuliệu này?",
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

  if (isDocumentLoad) return <SpinLoading />;
  if (isDocumentError) return <Error />;

  const handleViewDetails = (doc: any) => {
    setSelectedDoc(doc);
    setIsModalVisible(true);
  };

  // Function to handle closing the modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDoc(null);
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    setRefreshKey((prev) => prev + 1); // Refresh data when model changes
  };

  const handleDrawerClose = () => {
    setSelectedDoc(null);
    setIsDrawerVisible(false); // Close the drawer
  };

  const handleRefresh = () => {
    setModel(""); // Đặt lại giá trị của model
    setRefreshKey((prev) => prev + 1); // Làm mới dữ liệu
  };

  return (
    <>
      <div className="p-4">
        <BackButton />
        <Heading name="Quản Lý Thể Loại Tài Liệu (Document)" />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <Select
              value={model}
              onChange={handleModelChange}
              placeholder="Chọn thể loại"
              style={{ width: 200 }}
            >
              {isCategoryLoad ? (
                <Option value="" disabled>
                  Đang tải...
                </Option>
              ) : isCategoryError ? (
                <Option value="" disabled>
                  Lỗi tải thể loại
                </Option>
              ) : (
                category?.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))
              )}
            </Select>

            <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
              <FaSync /> Làm mới
            </Button>
          </div>
          <Link href="/document/create_document">
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
            dataSource={document}
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
        {count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
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
        loading={loading}
        setLoading={setLoading} // Truyền state và hàm setLoading
      />
    </>
  );
};

export default Page;
