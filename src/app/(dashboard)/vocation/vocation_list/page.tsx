"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Spin, Select, message, Checkbox } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync, MdOutlineDelete } from "@/lib/iconLib";
import Heading from "@/components/design/Heading";
import { VocationList } from "@/lib/vocationList";
import {
  useDeleteVocation,
  useUpdateVocation,
} from "@/hooks/vocation/useVocation";
import Pagination from "@/components/Pagination";

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>(""); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]); // Đảm bảo selectedKeys là mảng string[]

  const { mutate } = useUpdateVocation();
  const { mutate: deleteVocation } = useDeleteVocation();

  // Pass model into CategoriesList
  const {
    queueData,
    next,
    isLoading,
    isError,
    count = 0,
  } = VocationList(currentPage, status, refreshKey);
  const totalPages = next ? currentPage + 1 : currentPage;

  const handleSubmit = async () => {
    // Lọc các dữ liệu đã chọn dựa trên keys
    const selectedData = queueData.filter(
      (item) => selectedKeys.includes(String(item.id)) // Kiểm tra nếu item.id tồn tại trong selectedKeys
    );

    // Kiểm tra nếu không có dữ liệu nào được chọn
    if (selectedData.length === 0) {
      message.warning("Không có id nào được chọn!");
      return;
    }

    try {
      // Phê duyệt các mục đã chọn
      await Promise.all(
        selectedData.map((item) =>
          mutate({
            id: [item.id.toString()], // Đảm bảo rằng item.id là chuỗi và bao bọc trong mảng
            status: "approve", // Trạng thái là approve
          })
        )
      );
      message.success("Phê duyệt thành công!");
    } catch (error) {
      console.error("Error approving selected registrations:", error);
      message.error("Có lỗi xảy ra khi phê duyệt!");
    }
  };

  const handleReject = async () => {
    // Lọc các dữ liệu đã chọn dựa trên keys
    const selectedData = queueData.filter(
      (item) => selectedKeys.includes(String(item.id)) // Kiểm tra nếu item.id tồn tại trong selectedKeys
    );

    // Kiểm tra nếu không có dữ liệu nào được chọn
    if (selectedData.length === 0) {
      message.warning("Không có id nào được chọn!");
      return;
    }

    try {
      // Từ chối các mục đã chọn
      await Promise.all(
        selectedData.map((item) =>
          mutate({
            id: [item.id.toString()], // Đảm bảo rằng item.id là chuỗi và bao bọc trong mảng
            status: "reject", // Trạng thái là reject
          })
        )
      );
      message.success("Từ chối thành công!");
    } catch (error) {
      console.error("Error rejecting selected registrations:", error);
      message.error("Có lỗi xảy ra khi từ chối!");
    }
  };

  const handleDelete = async () => {
    const selectedData = queueData.filter(
      (item) => selectedKeys.includes(String(item.id)) // Kiểm tra nếu item.id tồn tại trong selectedKeys
    );

    // Kiểm tra nếu không có dữ liệu nào được chọn
    if (selectedData.length === 0) {
      message.warning("Không có id nào được chọn!");
      return;
    }

    try {
      // Phê duyệt các mục đã chọn
      await Promise.all(
        selectedData.map((item) =>
          deleteVocation({
            id: [item.id.toString()], // Đảm bảo rằng item.id là chuỗi và bao bọc trong mảng
          })
        )
      );
    } catch (error) {
      console.error("Error approving selected registrations:", error);
      message.error("Có lỗi xảy ra khi phê duyệt!");
    }
  };

  const handleSelectChange = (checkedValues: string[]) => {
    setSelectedKeys(checkedValues);
  };

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 150,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Giáo xứ - Giáo Phận",
      dataIndex: "church",
      key: "church",
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
      title: "Chọn",
      dataIndex: "checkbox",
      key: "checkbox",
      width: 100,
      render: (_, record) => (
        <Checkbox
          value={String(record.id)}
          onChange={(e) =>
            handleSelectChange(
              e.target.checked
                ? [...selectedKeys, String(record.id)]
                : selectedKeys.filter((id) => id !== String(record.id))
            )
          }
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: () => (
        <>
          <Button danger onClick={handleDelete} style={{ marginRight: "8px" }}>
            <MdOutlineDelete className="text-albert-error" />
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) return <div>Error loading queue data.</div>;

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  return (
    <>
      <div className="p-4">
        <Heading name="Quản lý danh sách đăng ký ơn gọi  " />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <span>Lọc trạng thái:</span>
            <Select
              defaultValue=""
              style={{ width: 150 }}
              onChange={(value) => {
                setStatus(value); // Cập nhật trạng thái
                setCurrentPage(1); // Reset về trang đầu
              }}
              options={[
                { value: "", label: "Tất cả" },
                { value: "pending", label: "Chờ" },
                { value: "approve", label: "Chấp Thuận" },
                { value: "reject", label: "Từ Chối" },
              ]}
            />
          </div>
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
            <div className="flex space-x-4">
              <Button
                type="primary"
                danger
                onClick={handleDelete}
                style={{ marginBottom: "16px" }}
              >
                Xóa đã chọn
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
              <FaSync /> Làm mới
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
    </>
  );
};

export default Page;
