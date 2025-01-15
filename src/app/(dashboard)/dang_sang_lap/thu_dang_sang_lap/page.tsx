"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MdOutlineDelete } from "react-icons/md";
import { EyeOutlined } from "@ant-design/icons";
import PushButton from "@/components/Button/PushButton";
import { FaArrowLeft, FaArrowRight, FaSync, FaRegEdit } from "@/lib/iconLib";
import { MessageList } from "@/lib/messageList";
import MessageQueueList from "./MessageQueueList";
import MessageDetailsDrawer from "./messageDetailModal";
import { useDeleteMessage } from "@/hooks/message/useMessage";
import EditMessageModal from "./drawer/EditMessage";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import { useUser } from "@/context/userProvider";

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [selectedBlog, setSelectedBlog] = useState(null); // State for selected blog
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { mutate } = useDeleteMessage();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const { userInfo } = useUser() || {};
  const [loading, setLoading] = useState(false); // Thêm state loading

  // Pass model into CategoriesList
  const { queueData, next, isLoading, isError } = MessageList(
    currentPage,
    "",
    refreshKey
  );

  const totalPages = next ? currentPage + 1 : currentPage;

  const handleEdit = (blog: any) => {
    setSelectedDoc(blog); // Set blog to be edited
    setIsDrawerVisible(true); // Open the drawer
    setLoading(false); // Đảm bảo trạng thái loading không bật
  };
  const handleDelete = (postId: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bài viết này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        mutate(postId);
      },
    });
  };
  const columns: ColumnsType<any> = [
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
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (_: any, record: any, index: number) => index + 1, // This will display index + 1 as the ID
    },
    {
      title: "Tiêu Đề",
      dataIndex: "title",
      key: "title",
      width: 400,
      render: (text) => <span>{text}</span>,
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
          <Button type="primary" onClick={() => handleEdit(record)}>
            <FaRegEdit />
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <SpinLoading />;
  if (isError) return <Error />;

  const handleViewDetails = (blog: any) => {
    setSelectedBlog(blog);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedBlog(null);
    setIsDrawerVisible(false); // Close the drawer
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  return (
    <>
      <div className="p-4">
        <Heading name="Quản Lý thư đấng sáng lập" />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button onClick={handleRefresh}>
              <FaSync /> Làm mới
            </Button>
          </div>

          <PushButton
            href="/dang_sang_lap/thu_dang_sang_lap/create_message"
            label={"Tạo Thư Đấng Sáng Lập"}
          />
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
        {userInfo?.role.name === "admin" ? (
          <>
            <Heading name="Quản lý hàng đợi duyệt thư đấng sáng lập" />
            <MessageQueueList />
          </>
        ) : null}
      </div>
      <MessageDetailsDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        blog={selectedBlog}
      />
      <EditMessageModal
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        document={selectedDoc} // Pass selected blog to EditBlogModal
        loading={loading}
        setLoading={setLoading} // Truyền state và hàm setLoading
      />
    </>
  );
};

export default Page;
