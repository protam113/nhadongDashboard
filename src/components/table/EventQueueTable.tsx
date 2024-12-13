"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Table, Button, Spin, Pagination } from "antd";
import { ReloadOutlined } from "@ant-design/icons"; // Icon từ Ant Design
import type { ColumnsType } from "antd/es/table";
import { UserQueue } from "@/lib/userQueue";

const EventQueueTable = ({ PostModel }: { PostModel: string }) => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // State để làm mới dữ liệu
  const [isRefreshing, setIsRefreshing] = useState(false); // State để kiểm tra trạng thái làm mới
  const model = PostModel;
  const { queueData, isLoading, isError, handleBulkUpdate } = UserQueue(
    currentPage,
    model,
    refreshKey
  );

  // Xử lý làm mới dữ liệu
  const handleRefresh = () => {
    setIsRefreshing(true); // Bắt đầu làm mới
    setRefreshKey((prevKey) => prevKey + 1); // Cập nhật `refreshKey` để làm mới dữ liệu
    setTimeout(() => setIsRefreshing(false), 1000); // Đặt lại trạng thái sau 1 giây (có thể điều chỉnh thời gian)
  };

  const handleBulkApprove = () => {
    handleBulkUpdate(selectedKeys, "approved");
    setSelectedKeys([]);
  };

  const handleBulkReject = () => {
    handleBulkUpdate(selectedKeys, "rejected");
    setSelectedKeys([]);
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
      dataIndex: ["data", "old_data", "name"],
      key: "data",
      width: 250,
      render: (text) => <span>{text}</span>,
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

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Error loading queue data.</div>;

  return (
    <div className="p-4">
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
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage} // Trang hiện tại
          onChange={(page) => {
            setCurrentPage(page); // Cập nhật trang hiện tại
          }}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default EventQueueTable;
