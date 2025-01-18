"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import { MissionList } from "@/lib/missionList";
import PushButton from "@/components/Button/PushButton";
import { useDeleteMission } from "@/hooks/mission/useMission";
import { FaRegEdit, FaSync, MdOutlineDelete } from "@/lib/iconLib";
import EditMissionModal from "./drawer/EditMission";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import { useUser } from "@/context/userProvider";
import Pagination from "@/components/Pagination";
import DocumentQueueList from "../document/DocumentQueueTable";
import DocsDetailsModal from "../document/DocumentDetailModal";

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [selectedBlog, setSelectedBlog] = useState(null); // State for selected blog
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { mutate } = useDeleteMission();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const { userInfo } = useUser() || {}; // Provide a default empty object if useUser returns null
  const [loading, setLoading] = useState(false); // Thêm state loading

  // Pass model into CategoriesList
  const {
    queueData,
    next,
    isLoading,
    isError,
    count = 0,
  } = MissionList(currentPage, "", refreshKey);

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
      title: "Thể Loại",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category) => (
        <div
          style={{
            backgroundColor: category.color || "#142857", // Background color for category
            color: "#fff", // Text color
            padding: "5px 10px",
            borderRadius: "4px",
            marginBottom: "5px",
            marginRight: "5px",
          }}
        >
          {category.name} {/* Display category name */}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <>
          <Button
            danger
            onClick={() => handleDelete(record.id)}
            disabled={loading} // Disable button nếu đang loading
          >
            {loading ? (
              <Spin size="small" /> // Sử dụng Spin của Ant Design
            ) : (
              <MdOutlineDelete className="text-albert-error" />
            )}
          </Button>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            disabled={loading} // Disable button nếu đang loading
          >
            {loading ? (
              <Spin size="small" /> // Sử dụng Spin của Ant Design
            ) : (
              <FaRegEdit />
            )}
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <SpinLoading />;
  if (isError) return <Error />;

  const handleViewDetails = (blog: any) => {
    setSelectedBlog(blog);
    setIsModalVisible(true);
  };

  const handleDrawerClose = () => {
    setIsModalVisible(false);
    setSelectedBlog(null);
    setIsDrawerVisible(false); // Close the drawer
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  return (
    <>
      <div className="p-4">
        <Heading name="Quản Lý Sứ Vụ" />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
            <FaSync /> Làm mới
          </Button>
          <PushButton href="/missio/create_missio" label={"Tạo Sứ Vụ"} />
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
        {userInfo?.role.name === "admin" ? (
          <>
            <Heading name="Quản lý hàng đợi duyệt bài viết" />
            <DocumentQueueList model="mission" />
          </>
        ) : null}
      </div>
      <DocsDetailsModal
        visible={isModalVisible}
        onClose={handleDrawerClose}
        doc={selectedBlog}
      />
      <EditMissionModal
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
