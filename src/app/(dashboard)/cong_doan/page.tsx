"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Modal, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GroupList } from "@/lib/groupList";
import CreateGroup from "@/app/(dashboard)/cong_doan/modal/CreateGroupModal";
import dayjs from "dayjs";
import { useDeleteGroup } from "@/hooks/group/useGroup";
import EditGroup from "@/app/(dashboard)/cong_doan/modal/EditGroupModal";
import { EyeOutlined } from "@ant-design/icons";
import GroupDetailModal from "@/app/(dashboard)/cong_doan/modal/GroupDetailModal";
import BackButton from "@/components/Button/BackButton";
import {
  FaArrowLeft,
  FaArrowRight,
  MdOutlineDelete,
  FaRegEdit,
  FaSync,
} from "@/lib/iconLib";
import { SpinLoading, Error, Heading } from "@/components/design/index";

const Groups: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  // Pass model into CategoriesList
  const { queueData, next, isLoading, isError } = GroupList(
    currentPage,
    refreshKey
  );

  const totalPages = next ? currentPage + 1 : currentPage;

  const { mutate: deleteGroup } = useDeleteGroup();
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDelete = (groupId: string) => {
    // Show confirmation dialog before deletiona
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thể loại này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteGroup(groupId);
      },
    });
  };

  const handleEdit = (editGroup: any) => {
    if (!editGroup.id) {
      console.error("ID thể loại không hợp lệ!");
      return;
    }
    setEditingGroup(editGroup);
    setIsEditModalVisible(true); // Mở modal chỉnh sửa
  };

  const handleLoadingChange = (isLoading: boolean) => {
    setIsCreateLoading(isLoading);
  };

  const handleViewDetails = (group: any) => {
    setSelectedGroup(group);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedGroup(null);
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
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      width: 150,
      render: (fileUrl: string) => (
        <Image
          width={100}
          src={fileUrl}
          preview={{
            destroyOnClose: true,
          }}
          alt="Group Image"
        />
      ),
    },
    {
      title: "Tên Cộng Đoàn",
      dataIndex: "name",
      key: "name",
      width: 300,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Ngày Thành Lập",
      dataIndex: "founding_date",
      key: "founding_date",
      width: 150,
      render: (text) => (
        <span>{text ? dayjs(text).format("DD/MM/YYYY") : ""}</span>
      ), // Format date to "DD/MM/YYYY"
    },
    {
      title: "Ngày Tạo",
      dataIndex: "created_date",
      key: "created_date",
      width: 150,
      render: (text) => (
        <span>{text ? dayjs(text).format("DD/MM/YYYY") : ""}</span>
      ), // Format date to "DD/MM/YYYY"
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <>
          <Button danger onClick={() => handleDelete(record.id)}>
            <MdOutlineDelete className="text-albert-error" />
          </Button>
          <Button onClick={() => handleEdit(record)}>
            <FaRegEdit />
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <SpinLoading />;
  if (isError) return <Error />;
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  const handleCreateGroup = () => {
    setIsCreateModalVisible(true); // Show the modal when "Create Category" is clicked
  };

  const handleCancelCreateModal = () => {
    setIsCreateModalVisible(false); // Hide the create category modal
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false); // Hide the edit category modal
    setEditingGroup(null); // Reset editing category
  };

  return (
    <>
      <div className="p-4">
        <BackButton />
        <Heading name="quản lý cộng đoàn  " />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
            <FaSync /> Làm mới
          </Button>

          {/* Nút Tạo cộng đoàn */}
          <Button
            onClick={handleCreateGroup}
            loading={isCreateLoading}
            className="ml-4"
          >
            Tạo cộng đoàn
          </Button>
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
                setSelectedKeys(selectedRowKeys as number[]),
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
        {/*<DocumentCategoriesTable/>*/}
        {/*<DocumentQueueList/>*/}
      </div>

      <Modal
        title="Tạo Group"
        visible={isCreateModalVisible}
        onCancel={handleCancelCreateModal}
        footer={null}
        width={600}
      >
        <CreateGroup onLoadingChange={handleLoadingChange} />
      </Modal>

      <Modal
        title="Sửa Group"
        visible={isEditModalVisible}
        onCancel={handleCancelEditModal}
        footer={null}
        width={600}
      >
        <EditGroup group={editingGroup} /> {/* Hiển thị thông tin thể loại */}
      </Modal>

      <GroupDetailModal
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        group={selectedGroup}
      />
    </>
  );
};

export default Groups;
