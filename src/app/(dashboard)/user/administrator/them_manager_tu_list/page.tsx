"use client";

import React, { useState } from "react";
import { Table, Spin, message, Button, Modal } from "antd";
import { useUserList, useAddManager } from "@/hooks/user/useUsers";
import Heading from "@/components/design/Heading";
import { FaArrowLeft, FaArrowRight } from "@/lib/iconLib";

const UserAddToManagerPage: React.FC = () => {
  const { mutate: addManagerMutation } = useAddManager();
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Show confirmation modal
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey] = useState(0);
  const { data, isLoading, isError, isFetching } = useUserList(
    currentPage,
    {
      role: ["4e721bdf-1c3a-405f-b25e-8ce7887f317c"],
      blocked: ["false"],
    },
    refreshKey
  );

  const next = data?.next;
  const totalPages = next ? currentPage + 1 : currentPage;

  if (isError) {
    return <div>Error fetching users</div>;
  }

  if (isLoading) {
    return <Spin size="large" />;
  }

  // Handle adding user as manager
  const handleAddUser = async () => {
    if (!selectedUserId) {
      message.error("Vui lòng chọn người dùng!");
      return;
    }

    console.log("Selected User ID:", selectedUserId); // Debugging line

    setLoading(true);
    const newUser = {
      user: selectedUserId, // Chuyển trực tiếp selectedUserId vào
      role: "manager",
    };

    try {
      await addManagerMutation(newUser);
      message.success("Thêm người dùng thành công!");
      setShowConfirmModal(false);
    } catch (error: any) {
      console.error(error);
      message.error("Có lỗi xảy ra khi thêm người dùng.");
    } finally {
      setLoading(false);
    }
  };

  // Columns for Ant Design Table
  const users = data?.results || [];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (text: any, record: any, index: any) => <span>{index + 1}</span>,
    },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phone_number", key: "phone_number" },
    {
      title: "Action",
      key: "action",
      render: (
        _: any,
        record: { id: string } // id là string
      ) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedUserId(record.id); // Giữ nguyên id là string
            setShowConfirmModal(true); // Show confirmation modal
          }}
        >
          Thêm vào quản trị viên
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Heading name="Danh sách người dùng  " />

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

      {/* Confirmation Modal */}
      <Modal
        title="Xác nhận"
        visible={showConfirmModal}
        onOk={handleAddUser}
        onCancel={() => setShowConfirmModal(false)}
        okText="Đồng ý"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <p>Bạn có chắc muốn thêm người dùng này vào quản trị viên?</p>
      </Modal>
    </div>
  );
};

export default UserAddToManagerPage;
