"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Table, Button, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { UserQueue } from "@/lib/userQueue";
import { FaArrowLeft, FaArrowRight } from "@/lib/iconLib";
import { SpinLoading, Error } from "@/components/design/index";

const CategoriesQueueTable: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { queueData, next, isLoading, isError, handleBulkUpdate } = UserQueue(
    currentPage,
    "category",
    refreshKey
  );

  const totalPages = next ? currentPage + 1 : currentPage;

  // Xử lý làm mới dữ liệu
  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prevKey) => prevKey + 1);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleBulkApprove = async () => {
    try {
      const response = await handleBulkUpdate(selectedKeys, "approve");
      console.error("Approve Response:", response);
    } catch (error) {
      console.error("Error during approval:", error);
    }
    setSelectedKeys([]);
  };

  const handleBulkReject = async () => {
    try {
      const response = await handleBulkUpdate(selectedKeys, "reject");
      console.error("Approve Response:", response);
    } catch (error) {
      console.error("Error during approval:", error);
    }
    setSelectedKeys([]);
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
      title: "Ngày Tạo",
      dataIndex: "created_date",
      key: "created_date",
      width: 150,
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updated_date",
      key: "updated_date",
      width: 150,
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Nội Dung",
      dataIndex: "data",
      key: "data",
      width: 350,
      render: (data) => {
        const newData = data?.new_data;
        const oldData = data?.old_data;

        if (newData && oldData) {
          return (
            <div>
              <p>
                <strong>Mới:</strong> {newData.name || JSON.stringify(newData)}
              </p>
              <p>
                <strong>Cũ:</strong> {oldData.name}
              </p>
            </div>
          );
        } else if (newData) {
          return (
            <div>
              <p>
                <strong>Dữ Liệu Cập Nhật:</strong>
                {newData.name || JSON.stringify(newData)}
              </p>
            </div>
          );
        } else if (oldData) {
          return (
            <div>
              <strong>Dữ Liệu:</strong>
              <p>Model: {oldData.model}</p>
              <p>Tên Thể Loại: {oldData.name}</p>
            </div>
          );
        } else {
          return <p>Không có dữ liệu</p>;
        }
      },
    },
    {
      title: "Hình Thức",
      dataIndex: "description",
      key: "description",
      width: 150,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Hành Động",
      dataIndex: "action",
      key: "action",
      width: 150,
      filters: [
        { text: "Create", value: "create" },
        { text: "Edit", value: "edit" },
        { text: "Delete", value: "delete" },
      ],
      onFilter: (value, record) => record.action.includes(value),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approve", value: "approve" },
        { text: "Reject", value: "reject" },
        { text: "Error", value: "error" },
      ],
      onFilter: (value, record) => record.status.includes(value),
      render: (text) => {
        let bgColor;

        if (text === "pending") {
          bgColor = "bg-albert-warning";
        } else if (text === "approve") {
          bgColor = "bg-albert-success";
        } else if (text === "reject") {
          bgColor = "bg-albert-error";
        } else if (text === "error") {
          bgColor = "bg-red-600"; // Customize as needed for 'error'
        }

        return (
          <span className={`${bgColor} text-white px-2 py-1 rounded`}>
            {text}
          </span>
        );
      },
    },
  ];

  if (isLoading) return <SpinLoading />;
  if (isError) return <Error />;

  return (
    <div className="p-4">
      <h1 className="text-16 font-bold mt-4">
        Quản lý hàng đợi duyệt thể loại (Category)
      </h1>
      <div className="p-4">
        <Button
          type="primary"
          onClick={handleBulkApprove}
          style={{ marginBottom: "16px" }}
        >
          Chấp Thuận
        </Button>
        <Button
          className="text-albert-error"
          onClick={handleBulkReject}
          style={{ marginBottom: "16px", marginLeft: "8px" }}
        >
          Từ chối
        </Button>
        <Button
          onClick={handleRefresh}
          style={{ marginBottom: "16px", marginLeft: "8px" }}
          icon={isRefreshing ? <Spin size="small" /> : <ReloadOutlined />} // Hiển thị icon làm mới hoặc spin
        >
          {isRefreshing ? "Đang làm mới..." : ""} {/* Thay đổi text */}
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
    </div>
  );
};

export default CategoriesQueueTable;
