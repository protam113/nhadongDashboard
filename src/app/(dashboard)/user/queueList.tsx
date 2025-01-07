"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Table, Button, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserList } from "@/lib/userList";
import Heading from "@/components/design/Heading";
import { FaArrowLeft, FaArrowRight, FaSync } from "@/lib/iconLib";

const UserQueueList: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [is_active] = useState<string>("false");
  const [blocked] = useState<string>("false");
  // Gọi hook `UserQueue` và thêm `refreshKey` làm dependency để làm mới dữ liệu
  const { queueData, next, isLoading, isError, handleActiveUser } = UserList(
    currentPage,
    is_active,
    blocked,
    refreshKey // Truyền "false" cho is_active
  );

  const totalPages = next ? currentPage + 1 : currentPage;

  const handleBulkApprove = () => {
    handleActiveUser(selectedKeys, "approved");
    setSelectedKeys([]);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  const handleBulkReject = () => {
    handleActiveUser(selectedKeys, "rejected");
    setSelectedKeys([]);
  };

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (_: any, record: any, index: number) => index + 1, // Hiển thị chỉ số + 1
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Kích Hoạt",
      dataIndex: "is_active",
      key: "is_active",
      width: 150,
      render: (isActive) => (isActive ? "Yes" : "No"),
    },
  ];

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Error loading queue data.</div>;

  return (
    <div className="p-4">
      <Heading name="Quản lý hàng đợi duyệt người dùng" />
      <div className="mb-4 flex justify-between">
        <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
          <FaSync /> Làm mới
        </Button>
        <Button
          type="primary"
          onClick={handleBulkApprove}
          style={{ marginBottom: "16px" }}
        >
          Chấp Thuận
        </Button>
        <Button
          type="default"
          danger
          onClick={handleBulkReject}
          style={{ marginBottom: "16px" }}
        >
          Từ Chối
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

export default UserQueueList;
