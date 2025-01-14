"use client";

import React, { useState } from "react";
import { Table, Spin, Button, message, Modal, Select, Alert } from "antd";
import { useAddManager, useUserList } from "@/hooks/user/useUsers";
import { useRouter } from "next/navigation";
import { FaSync } from "react-icons/fa";
import Heading from "@/components/design/Heading";
import UserDrawer from "@/components/drawer/userDrawer";
import { EyeOutlined } from "@ant-design/icons";
import { RoleList } from "@/lib/roleLib";
import { FaArrowLeft, FaArrowRight } from "@/lib/iconLib";

const ManageUsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { mutate: addManagerMutation } = useAddManager();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null); // State for selected role

  // Fetch roles
  const {
    roles,
    isLoading: roleLoading,
    isError: roleError,
  } = RoleList(currentPage);

  // Fetch users with selected role (default to admin and manager roles)
  const { data, isLoading, isError, isFetching } = useUserList(
    currentPage,
    {
      role: selectedRole
        ? [selectedRole]
        : [
            "ceed47f0-ffaa-4ecc-b6a5-509c5acace46",
            "2a28bdeb-84d8-4a72-98c3-fdefd5bc6cbb",
          ], // Default roles if no selection
    },
    refreshKey
  );

  const next = data?.next;
  const totalPages = next ? currentPage + 1 : currentPage;

  if (isError || roleError) {
    return <div>Error fetching users</div>;
  }

  if (isLoading || roleLoading) {
    return <Spin size="large" />;
  }

  const openDrawer = (user: any) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  const handleAddUser = async () => {
    if (!selectedUserId) {
      message.error("Vui lòng chọn người dùng!");
      return;
    }

    console.log("Selected User ID:", selectedUserId); // Debugging line

    setLoading(true);
    const newUser = {
      user: selectedUserId,
      role: "user",
    };

    try {
      await addManagerMutation(newUser);
      message.success("Chuyển người dùng về user thành công!");
      setShowConfirmModal(false);
    } catch (error: any) {
      console.error(error);
      message.error("Có lỗi xảy ra khi thêm người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const users = data?.results || [];
  const columns = [
    {
      title: "ID",
      key: "id",
      render: (_: any, record: any, index: number) => index + 1,
    },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phone_number", key: "phone_number" },
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
          <Button
            type="primary"
            onClick={() => {
              setSelectedUserId(record.id);
              setShowConfirmModal(true);
            }}
          >
            Chuyển Về User
          </Button>
        </>
      ),
    },
  ];

  const handleCreateManager = () => {
    router.push("/user/administrator/create_manager");
  };
  const handleAddManager = () => {
    router.push("/user/administrator/them_manager_tu_list");
  };

  // Handle role change
  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId); // Update selected role
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <Heading name="Quản lý danh sách quản trị viên " />
            <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
              <FaSync /> Làm mới
            </Button>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={handleAddManager}
              type="default"
              className="border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-300 rounded-full flex items-center justify-center"
              style={{ padding: "8px 16px", minWidth: "auto" }}
            >
              Thêm Quản Trị Viên từ danh sách
            </Button>
            <Button
              type="primary"
              onClick={handleCreateManager}
              className="w-auto"
            >
              Tạo Quản Trị Viên
            </Button>
          </div>
        </div>

        {/* Role Filter Dropdown */}
        <div className="mb-4">
          <Select
            placeholder="Lọc theo vai trò"
            onChange={handleRoleChange}
            style={{ width: 200 }}
          >
            {roles?.map((role) => (
              <Select.Option key={role.id} value={role.id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="mb-4 mt-4">
          <Alert
            message="Lưu ý chỉ có thể chuyển từ Manager xuống User, không thể chuyển Admin !!"
            type="warning"
            showIcon
          />
        </div>

        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={false}
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
        {isFetching && <Spin size="small" />}
      </div>

      <UserDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        userInfo={selectedUser}
      />
      <Modal
        title="Xác nhận"
        visible={showConfirmModal}
        onOk={handleAddUser}
        onCancel={() => setShowConfirmModal(false)}
        okText="Đồng ý"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <p>Bạn có chắc muốn xóa người dùng này quản trị viên?</p>
      </Modal>
    </>
  );
};

export default ManageUsersPage;
