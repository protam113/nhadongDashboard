"use client";

import React, { useState } from "react";
import { Table, Spin, Pagination, message, Button, Modal } from "antd";
import { useUserList, useAddManager } from "@/hooks/user/useUsers";
import Heading from "@/components/design/Heading";

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
      role: ["ab84fe7e-4810-44eb-9dc9-04ddffb5441b"],
      blocked: ["false"],
    },
    refreshKey
  );

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

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={20}
          total={data?.count || 0}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
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
