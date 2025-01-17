"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Table, Button, Spin, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQueueManagement } from "@/logic/queueLogic";
import { ReloadOutlined } from "@ant-design/icons";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import Pagination from "@/components/Pagination";

const { Option } = Select;

const Queue: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [type, setType] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    queueData,
    next,
    isLoading,
    isError,
    handleBulkUpdate,
    count = 0,
  } = useQueueManagement(currentPage, type, refreshKey);
  const totalPages = next ? currentPage + 1 : currentPage;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prevKey) => prevKey + 1);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleBulkApprove = async () => {
    try {
      // Gọi hàm handleBulkUpdate với status 'approved' và chờ kết quả
      const response = await handleBulkUpdate(selectedKeys, "approve");
      console.log("Approve Response:", response); // Log giá trị trả về từ API
    } catch (error) {
      console.error("Error during approval:", error); // Log lỗi nếu có
    }
    console.log("Approve setSelectedKeys:", selectedKeys);
    setSelectedKeys([]); // Xóa các khóa đã chọn sau khi thực hiện
  };

  const handleBulkReject = async () => {
    try {
      // Gọi hàm handleBulkUpdate với status 'approved' và chờ kết quả
      const response = await handleBulkUpdate(selectedKeys, "reject");
      console.log("Approve Response:", response); // Log giá trị trả về từ API
    } catch (error) {
      console.error("Error during approval:", error); // Log lỗi nếu có
    }
    console.log("Approve setSelectedKeys:", selectedKeys);
    setSelectedKeys([]); // Xóa các khóa đã chọn sau khi thực hiện
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
      title: "Created Date",
      dataIndex: "created_date",
      key: "created_date",
      width: 120,
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Updated Date",
      dataIndex: "updated_date",
      key: "updated_date",
      width: 120,
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 150,
      render: (text) => {
        const maxLines = 4;

        const toggleExpanded = () => {
          setIsExpanded(!isExpanded);
        };

        return (
          <div>
            <span
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: isExpanded ? "none" : maxLines,
                overflow: "hidden",
              }}
            >
              {text}
            </span>
            {text.length > 100 && (
              <button
                onClick={toggleExpanded}
                className="text-blue-500 underline"
              >
                {isExpanded ? "See Less" : "See More"}
              </button>
            )}
          </div>
        );
      },
    },
    {
      title: "Hành Động",
      dataIndex: "action",
      key: "action",
      width: 120,
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

  const handleTypeChange = (value: string) => {
    setType(value);
    setRefreshKey((prev) => prev + 1); // Refresh data when model changes
  };

  return (
    <div className="p-4">
      <Heading name="quản lý hàng đợi  " />
      <Button
        type="primary"
        onClick={handleBulkApprove}
        style={{ marginBottom: "16px" }}
      >
        Approve Selected
      </Button>
      <Button
        className="text-albert-error"
        onClick={handleBulkReject}
        style={{ marginBottom: "16px", marginLeft: "8px" }}
      >
        Reject Selected
      </Button>
      <Select
        value={type}
        onChange={handleTypeChange}
        placeholder="Chọn model"
        style={{ width: 200 }}
      >
        <Option value="blog">Blog</Option>
        <Option value="category">Thể Loại</Option>
        <Option value="news">Tin Tức</Option>
        <Option value="document">Document</Option>
      </Select>
      <Button
        onClick={handleRefresh}
        style={{ marginBottom: "16px", marginLeft: "8px" }}
        icon={isRefreshing ? <Spin size="small" /> : <ReloadOutlined />} // Hiển thị icon làm mới hoặc spin
      >
        {isRefreshing ? "Đang làm mới..." : ""} {/* Thay đổi text */}
      </Button>
      <div className="overflow-auto" style={{ maxHeight: "800px" }}>
        <Table
          columns={columns}
          dataSource={queueData}
          rowKey="id" // Mỗi dòng sẽ sử dụng "id" làm khóa duy nhất
          pagination={false}
          scroll={{ y: 500 }}
          rowSelection={{
            selectedRowKeys: selectedKeys, // Những keys được chọn sẽ được lưu trong state `selectedKeys`
            onChange: (selectedRowKeys) =>
              setSelectedKeys(selectedRowKeys as number[]), // Cập nhật selectedKeys khi thay đổi
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
  );
};

export default Queue;
