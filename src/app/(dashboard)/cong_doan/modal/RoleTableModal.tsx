"use client";

import React, { useState } from "react";
import { Table, Spin, Alert, Button, Modal } from "antd";
import { useDeleteRole, useGroupRoleList } from "@/hooks/group/useGroup";
import CreateRoleGroup from "@/app/(dashboard)/cong_doan/modal/createRoleGroupModal";
import { Group } from "@/types/types";
import { FaArrowLeft, FaArrowRight, MdOutlineDelete } from "@/lib/iconLib";

const RoleTableModal: React.FC<Group> = ({ groupId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // State để làm mới dữ liệu
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { mutate } = useDeleteRole();
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Thay đổi `refreshKey` để gọi lại API
  };

  // Gọi custom hook để lấy dữ liệu role
  const { data, isLoading, isError } = useGroupRoleList(
    currentPage,
    refreshKey,
    groupId
  );
  const handleDelete = (roleId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa vai trò này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        mutate({ groupId, roleId });
      },
    });
  };

  const next = data?.next;
  const totalPages = next ? currentPage + 1 : currentPage;

  // Cột của bảng
  const columns = [
    {
      title: "Tên Vai Trò",
      dataIndex: "name", // Dữ liệu API trả về có trường name
      key: "name",
    },
    {
      title: "Thao Tác",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (_: any, record: any) => (
        <Button danger onClick={() => handleDelete(record.id)} className="mr-2">
          <MdOutlineDelete className="text-albert-error" />
        </Button>
      ),
    },
  ];

  // Hiển thị giao diện
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spin tip="Đang tải vai trò..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-4">
        <Alert
          message="Lỗi"
          description="Không thể tải danh sách vai trò. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      <Table
        dataSource={data?.results || []} // Sử dụng `results` từ API trả về
        columns={columns}
        rowKey={(record) => record.id}
        pagination={false}
      />
      <Button
        type="primary"
        className="mt-4"
        onClick={() => setIsCreateModalOpen(true)}
      >
        Create Role Group
      </Button>

      <Modal
        title="Create Role Group"
        visible={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
      >
        <CreateRoleGroup
          groupId={groupId} // Truyền groupId vào
          onLoadingChange={(isLoading, progress) => {
            if (!isLoading && progress === 100) {
              handleRefresh(); // Refresh danh sách role sau khi tạo xong
              setIsCreateModalOpen(false); // Đóng modal
            }
          }}
        />
      </Modal>

      {/* Phân trang */}
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
  );
};

export default RoleTableModal;
