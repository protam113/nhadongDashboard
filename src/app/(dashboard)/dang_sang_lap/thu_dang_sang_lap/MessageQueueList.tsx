"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Table, Button, Spin } from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons"; // Icon từ Ant Design
import type { ColumnsType } from "antd/es/table";
import { UserQueue } from "@/lib/userQueue";
import { FaArrowLeft, FaArrowRight } from "@/lib/iconLib";
import SpinLoading from "@/components/design/Spin";
import Error from "@/components/design/Error";
import MessageEditDetailDrawer from "@/components/drawer/MessageEditDetailDrawer";
import MessageDetailDrawer from "@/components/drawer/MessageDetailDrawer";

const MessageQueueList: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // State để làm mới dữ liệu
  const [isRefreshing, setIsRefreshing] = useState(false); // State để kiểm tra trạng thái làm mới
  const [selectedPost, setSelectedPost] = useState(null); // State for selected blog
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false); // State mới
  const [selectedEditPost, setSelectedEditPost] = useState(null); // State for selected blog

  // Gọi hook `UserQueue` và thêm `refreshKey` làm dependency để làm mới dữ liệu
  const { queueData, next, isLoading, isError, handleBulkUpdate } = UserQueue(
    currentPage,
    " messageformfounder",
    refreshKey
  );

  const totalPages = next ? currentPage + 1 : currentPage;

  // Xử lý làm mới dữ liệu
  const handleRefresh = () => {
    setIsRefreshing(true); // Bắt đầu làm mới
    setRefreshKey((prevKey) => prevKey + 1); // Cập nhật `refreshKey` để làm mới dữ liệu
    setTimeout(() => setIsRefreshing(false), 1000); // Đặt lại trạng thái sau 1 giây (có thể điều chỉnh thời gian)
  };

  const handleBulkApprove = () => {
    handleBulkUpdate(selectedKeys, "approve");
    setSelectedKeys([]);
  };

  const handleBulkReject = () => {
    handleBulkUpdate(selectedKeys, "reject");
    setSelectedKeys([]);
  };

  const handleViewDetails = (blog: any) => {
    setSelectedPost(blog.data?.old_data || blog); // Kiểm tra nếu dữ liệu nằm trong old_data
    setIsDrawerOpen(true);
  };

  const handleViewEditDetails = (blog: any) => {
    setSelectedEditPost(blog.data?.new_data || blog); // Kiểm tra nếu dữ liệu nằm trong old_data
    setIsEditDrawerOpen(true); // Mở Drawer chỉnh sửa
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsEditDrawerOpen(false); // Đóng cả hai Drawer
    setSelectedPost(null);
  };
  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
      render: (_, __, index) => <span>{index + 1}</span>, // Display index + 1 as ID
    },
    {
      title: "Ngày Tạo",
      dataIndex: "created_date",
      key: "created_date",
      width: 110,
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Người Tạo",
      dataIndex: ["request_user", "username"],
      key: "request_user",
      width: 200,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Nội Dung",
      dataIndex: ["data", "old_data"],
      key: "data",
      width: 150,
      render: (_, record) => {
        const { action, status } = record; // Lấy giá trị action và status của bản ghi
        if (status === "reject" || action !== "create") return null; // Nếu trạng thái là reject, không hiển thị nút

        return (
          <div className="flex justify-between">
            <Button onClick={() => handleViewDetails(record)}>
              <EyeOutlined /> Xem Chi Tiết
            </Button>
          </div>
        );
      },
    },
    {
      title: "Nội Dung Sửa",
      dataIndex: ["data", "new_data"],
      key: "data",
      width: 150,
      render: (_, record) => {
        const { action, status } = record; // Lấy giá trị action và status của bản ghi
        if (status === "reject" || action !== "edit") return null; // Nếu trạng thái là reject, không hiển thị nút

        return (
          <div className="flex justify-between">
            <Button onClick={() => handleViewEditDetails(record)}>
              <EyeOutlined /> Xem Chi Tiết
            </Button>
          </div>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 150,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Hành Động",
      dataIndex: "action",
      key: "action",
      width: 100,
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
    <>
      <div className="p-4">
        <div>
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
      <MessageDetailDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        blog={selectedPost}
      />
      <MessageEditDetailDrawer
        open={isEditDrawerOpen}
        onClose={handleDrawerClose}
        blog={selectedEditPost}
      />
    </>
  );
};

export default MessageQueueList;
