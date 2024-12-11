// pages/User.tsx
"use client";

import React, {
  // , { useState, useEffect }
  useState,
} from "react";
import {
  Table,
  // , Typography, Button, Image
  Spin,
  Pagination,
  Button,
  Modal,
  message,
} from "antd";
// import type { ColumnsType } from 'antd/es/table';
// import { PlusOutlined } from '@ant-design/icons';
import { useBlockUser, useUserList } from "@/hooks/user/useUsers";
import { FaSync } from "react-icons/fa";
import UserDrawer from "@/components/drawer/userDrawer";
import { EyeOutlined } from "@ant-design/icons";
import Heading from "@/components/design/Heading";

// const { Title } = Typography;

// Define the structure for user data

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
      role: ["ab84fe7e-4810-44eb-9dc9-04ddffb5441b"],
      blocked: ["false"],
    },
    refreshKey
  ); // Truyền currentPage vào hook
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
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage} // Trang hiện tại
            pageSize={20}
            total={data?.count || 0} // Tổng số người dùng
            onChange={(page) => {
              setCurrentPage(page); // Cập nhật trang hiện tại
            }}
            showSizeChanger={false}
          />
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
