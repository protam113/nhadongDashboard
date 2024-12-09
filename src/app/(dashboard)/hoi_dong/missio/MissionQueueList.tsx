"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Table, Button, Spin, Pagination } from "antd";
import { ReloadOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons"; // Icon từ Ant Design
import type { ColumnsType } from "antd/es/table";
import { UserQueue } from "@/lib/userQueue";

const MissionQueueList: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // State để làm mới dữ liệu
  const [isRefreshing, setIsRefreshing] = useState(false); // State để kiểm tra trạng thái làm mới
  const [seeMore, setSeeMore] = useState(false);

  // Gọi hook `UserQueue` và thêm `refreshKey` làm dependency để làm mới dữ liệu
  const { queueData, isLoading, isError, handleBulkUpdate } = UserQueue(
    currentPage,
    "mission",
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
      dataIndex: "data",
      key: "data",
      width: 400,
      render: (text) => {
        if (typeof text !== "string") {
          console.error("Expected string but got:", typeof text);
          return <span>{JSON.stringify(text)}</span>; // Safely render the text or object as a string
        }

        const dataObject = JSON.parse(
          text
            .replace(/'/g, '"')
            .replace(/False/g, "false")
            .replace(/True/g, "true")
            .replace(/None/g, "null")
        );

        // Extract specific fields from the object to display
        const content = [
          `Tiêu Đề: ${dataObject.title}`,
          `Mô Tả: ${dataObject.description}`,
          `Link: ${dataObject.link}`,
          `Người Tạo: ${dataObject.user.username}`,
          `Tên: ${dataObject.user.first_name} ${dataObject.user.last_name}`,
          `New Data: ${
            dataObject.new_data ? JSON.stringify(dataObject.new_data) : "N/A"
          }`,
          `Old Data: ${
            dataObject.old_data ? JSON.stringify(dataObject.old_data) : "N/A"
          }`,
        ];

        return (
          <div>
            {content
              .slice(0, seeMore ? content.length : 4)
              .map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            {content.length > 4 && (
              <Button
                type="link"
                onClick={() => setSeeMore(!seeMore)}
                className="mt-1"
                icon={seeMore ? <MinusOutlined /> : <PlusOutlined />}
              >
                {seeMore ? "Ẩn bớt" : "Xem thêm"}
              </Button>
            )}
          </div>
        );
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

export default MissionQueueList;
