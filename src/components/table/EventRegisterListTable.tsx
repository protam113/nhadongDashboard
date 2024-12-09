"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa"; // Import refresh icon
// import { EyeOutlined } from "@ant-design/icons";
import Heading from "@/components/design/Heading";
import { Post } from "@/types/types";
import {
  useEventRegisterList,
  useSubmitEventRegisterList,
} from "@/hooks/event/useEventRegistion";
import * as XLSX from "xlsx";

const EventRegisterListTable: React.FC<Post> = ({ postId }) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const { mutate } = useSubmitEventRegisterList(postId);
  const { data, isLoading, isError } = useEventRegisterList(
    postId,
    currentPage,
    refreshKey
  );
  const queueData = data?.results || []; // Danh sách người tham gia
  const handleExportExcel = () => {
    if (!queueData.length) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    // Chuẩn bị dữ liệu Excel
    const excelData = queueData.map((item, index) => ({
      STT: index + 1,
      "Họ và Tên đệm": item.fields_data.first_name?.value || "N/A",
      Tên: item.fields_data.last_name?.value || "N/A",
      "Số Điện Thoại": item.fields_data.phone_number?.value || "N/A",
      Email: item.fields_data.email?.value || "N/A",
    }));

    // Tạo một sheet mới với tiêu đề ở trên
    const worksheet = XLSX.utils.json_to_sheet(excelData, {
      header: ["STT", "Họ và Tên đệm", "Tên", "Số Điện Thoại", "Email"],
    });

    // Thêm tiêu đề "Danh sách đăng ký tham gia sự kiện" ở đầu file Excel
    const titleRow = [
      { value: "Danh sách đăng ký tham gia sự kiện", colspan: 5 },
    ];
    const titleWorksheet = XLSX.utils.aoa_to_sheet([titleRow]);

    // Tạo workbook và thêm cả tiêu đề và dữ liệu
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, titleWorksheet, "Title");
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách");

    // Tải xuống file Excel
    const filename = `DanhSachSuKien_${postId}.xlsx`;
    XLSX.writeFile(workbook, filename);
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: () => (
        // _: any, record: any
        <>
          <p> delete</p>
        </>
      ),
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
      alert("No participants selected.");
      return;
    }

    // Submit each selected registration
    selectedData.forEach((item) => {
      mutate({
        registration_id: item.id,
        status: "approve",
      });
    });
  };

  return (
    <>
      <div className="p-4">
        <Heading name="Danh sách người tham gia sự kiện " />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
              <FaSync /> Làm mới
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ marginBottom: "16px" }}
            >
              Approve Selected
            </Button>
          </div>
          <button
            onClick={handleExportExcel}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Tải xuống Excel
          </button>
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
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span style={{ margin: "0 8px" }}>Page {currentPage}</span>
          <Button onClick={() => setCurrentPage((prev) => prev + 1)}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default EventRegisterListTable;
