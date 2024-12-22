"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Spin, Select, message } from "antd"; // Import thêm Select
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import Heading from "@/components/design/Heading";
import { Post } from "@/types/types";
import { useSubmitEventRegisterList } from "@/hooks/event/useEventRegistion";
import EventRegisterDetail from "../drawer/EventRegisterDetail";
import { FaArrowLeft, FaArrowRight, FaSync } from "@/lib/iconLib";
import RegisterList from "@/lib/registerList"; // Không cần dấu {}

const VocationRegisterTable: React.FC<Post> = ({ postId }) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { mutate } = useSubmitEventRegisterList(postId);
  const [status, setStatus] = useState<string>("pending"); // Thêm state cho status

  const { queueData, next, isLoading, isError } = RegisterList(
    currentPage, // Correctly pass currentPage
    postId, // Ensure postId is a valid UUID, not "pending"
    status, // status will be "pending"
    refreshKey // refreshKey for manual refresh
  );

  const totalPages = next ? currentPage + 1 : currentPage;

  const handleViewDetails = (member: any) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedMember(null);
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
      title: "Họ Và Tên",
      children: [
        {
          title: "Họ và Tên đệm",
          dataIndex: ["fields_data", "first_name", "value"], // Access nested fields
          key: "first_name",
          width: 150,
          render: (value) => <span>{value}</span>,
        },
        {
          title: "Tên",
          dataIndex: ["fields_data", "last_name", "value"], // Access nested fields
          key: "last_name",
          width: 150,
          render: (value) => <span>{value}</span>,
        },
      ],
    },
    {
      title: "Số Điện Thoại",
      dataIndex: ["fields_data", "phone_number", "value"], // Access nested fields
      key: "phone_number",
      width: 250,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: ["fields_data", "email", "value"], // Access nested fields
      key: "email",
      width: 150,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status", // No need for array, use just 'status' since it's a flat field
      key: "status",
      width: 150,
      render: (status: "approve" | "reject" | "pending") => {
        let statusClass = "";
        let textColor = "text-white"; // Default text color

        switch (status) {
          case "approve":
            statusClass = "bg-albert-success"; // Green for approved
            break;
          case "reject":
            statusClass = "bg-albert-error"; // Red for rejected
            textColor = "text-white"; // White text on red
            break;
          case "pending":
            statusClass = "bg-albert-warning"; // Yellow for pending
            textColor = "text-white"; // Black text on yellow
            break;
          default:
            statusClass = "";
        }

        return (
          <span
            className={`inline-block px-3 py-1 text-14 rounded-full ${statusClass} ${textColor}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Error loading queue data.</div>;

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  const handleSubmit = async () => {
    // Convert item.id to a number for comparison
    const selectedData = queueData.filter(
      (item) => selectedKeys.includes(String(item.id)) // Ensure both are numbers
    );

    // Ensure that we have selected data
    if (selectedData.length === 0) {
      message.warning("Không có id nào được chọn !");
      return;
    }

    // Submit each selected registration
    selectedData.forEach((item) => {
      mutate({
        registration_id: item.id,
        status: "approve", // Use the selected status
      });
    });
  };
  const handleReject = async () => {
    // Convert item.id to a number for comparison
    const selectedData = queueData.filter(
      (item) => selectedKeys.includes(String(item.id)) // Ensure both are numbers
    );

    // Ensure that we have selected data
    if (selectedData.length === 0) {
      message.warning("Không có id nào được chọn !.");
      return;
    }

    try {
      // Submit each selected registration
      await Promise.all(
        selectedData.map((item) =>
          mutate({
            registration_id: item.id,
            status: "reject",
          })
        )
      );
    } catch (error) {
      console.error("Error approving selected registrations:", error);
    }
  };

  return (
    <>
      <div className="p-4">
        <Heading name="Danh sách người tham gia ơn gọi " />

        {/* Thêm thẻ select cho status */}
        <div className="flex justify-between items-center mb-4 space-x-4">
          {/* Phần chọn trạng thái */}
          <div className="flex items-center space-x-2">
            <Select
              value={status}
              onChange={setStatus} // Cập nhật status khi người dùng chọn
              style={{ width: 150 }}
              options={[
                { value: "pending", label: "Đang chờ" },
                { value: "approve", label: "Phê duyệt" },
                { value: "reject", label: "Từ chối" },
              ]}
            />
            <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
              <FaSync /> Làm mới
            </Button>
          </div>

          {/* Phần các nút Phê Duyệt và Từ Chối */}
          <div className="flex space-x-4">
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ marginBottom: "16px" }}
            >
              Phê Duyệt
            </Button>
            <Button
              type="dashed"
              onClick={handleReject}
              style={{ marginBottom: "16px" }}
            >
              Từ Chối
            </Button>
          </div>
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
                setSelectedKeys(selectedRowKeys as string[]),
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

      <EventRegisterDetail
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        member={selectedMember}
      />
    </>
  );
};

export default VocationRegisterTable;
