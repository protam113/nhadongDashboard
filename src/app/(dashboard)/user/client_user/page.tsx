// pages/User.tsx
"use client";

import React, { useState } from "react";
import { Table, Spin, Button, Modal, message } from "antd";
import { useBlockUser, useUserList } from "@/hooks/user/useUsers";
import { FaSync } from "react-icons/fa";
import UserDrawer from "@/components/drawer/userDrawer";
import { EyeOutlined } from "@ant-design/icons";
import Heading from "@/components/design/Heading";
import { FaArrowLeft, FaArrowRight } from "@/lib/iconLib";

const UserPage: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { mutate } = useBlockUser();

  const { data, isLoading, isError, isFetching } = useUserList(
    currentPage,
    {
      role: ["4e721bdf-1c3a-405f-b25e-8ce7887f317c"],
      blocked: ["false"],
    },
    refreshKey
  ); // Truyền currentPage vào hook
  const next = data?.next;
  const totalPages = next ? currentPage + 1 : currentPage;

  // Xử lý lỗi
  if (isError) {
    return <div>Error fetching users</div>;
  }

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return <Spin size="large" />;
  }

  const handleBlock = (id: string) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn  chặn người dùng này?",
      onOk: () => {
        mutate({ id: [id], status: "block" });
      },
    });
  };

  // Gỡ chặn danh sách người dùng
  const handleBlockMultiple = () => {
    if (selectedKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một người dùng để chặn.");
      return;
    }
    Modal.confirm({
      title: "Bạn có chắc chắn muốn  chặn các người dùng đã chọn?",
      onOk: () => {
        mutate({ id: selectedKeys, status: "block" });
      },
    });
  };

  const openDrawer = (user: any) => {
    setSelectedUser(user); // Lưu thông tin người dùng
    setDrawerOpen(true); // Mở Drawer
  };

  const closeDrawer = () => {
    setDrawerOpen(false); // Đóng Drawer
    setSelectedUser(null); // Reset thông tin người dùng
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };
  // Columns for the Ant Design Table
  const users = data?.results || []; // Dùng results trực tiếp từ dữ liệu

  // Cột hiển thị cho Table
  const columns = [
    {
      title: "ID",
      key: "id",
      width: 80,
      render: (_: any, record: any, index: number) => index + 1, // This will display index + 1 as the ID
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Name",
      children: [
        {
          title: "First Name",
          dataIndex: "first_name",
          key: "first_name",
          width: 150,
        },
        {
          title: "Last Name",
          dataIndex: "last_name",
          key: "last_name",
          width: 150,
        },
      ],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 300,
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 200,
    },
    {
      title: "Thao Tác",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (_: any, record: any) => (
        <>
          <Button onClick={() => openDrawer(record)}>
            <EyeOutlined /> Xem Chi Tiết
          </Button>
          <Button type="primary" danger onClick={() => handleBlock(record.id)}>
            Chặn
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div>
        <Heading name="Quản lý danh sách Người dùng " />
        <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
          <FaSync /> Làm mới
        </Button>
        <div className="mb-4 flex justify-between">
          <Button
            type="primary"
            danger
            disabled={selectedKeys.length === 0}
            onClick={handleBlockMultiple}
          >
            Chặn Danh Sách
          </Button>
        </div>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={false}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: (selectedRowKeys) =>
              setSelectedKeys(selectedRowKeys as string[]),
          }}
        />
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
        {isFetching && <Spin size="small" />}{" "}
        {/* Hiển thị loading khi đang tải dữ liệu */}
      </div>
      <UserDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        userInfo={selectedUser}
      />
    </>
  );
};

export default UserPage;
