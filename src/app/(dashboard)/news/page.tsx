"use client";

import React, { useState } from "react";
import { Table, Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import { NewsList } from "@/lib/newsList";
import { FaSync } from "@/lib/iconLib";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import { useUser } from "@/context/userProvider";
import Pagination from "@/components/Pagination";
import TableQueueList from "../blog/BlogQueueTable";
import BlogDetailsDrawer from "../blog/BlogDetailsModal";

const News: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [model] = useState<string>(""); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [selectedNews, setSelectedNews] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { userInfo } = useUser() || {};

  // Pass model into CategoriesList
  const {
    queueData,
    next,
    isLoading,
    isError,
    count = 0,
  } = NewsList(currentPage, model, refreshKey);

  const totalPages = next ? currentPage + 1 : currentPage;

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
      render: (text, record, index) => <span>{index + 1}</span>,
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
      dataIndex: "categories",
      key: "categories",
      width: 150,
      render: (categories) => (
        <span>
          {categories.map((category: any, index: number) => {
            // Danh sách màu sắc để luân phiên
            const colors = ["geekblue", "green", "volcano", "orange", "cyan"];
            const color = colors[index % colors.length]; // Chọn màu theo index
            return (
              <Tag
                color={color}
                key={category.id}
                style={{ marginBottom: "5px" }}
              >
                {category.name} {/* Hiển thị tên của thể loại */}
              </Tag>
            );
          })}
        </span>
      ),
    },
  ];

  if (isLoading) return <SpinLoading />;
  if (isError) return <Error />;

  const handleViewDetails = (news: any) => {
    setSelectedNews(news);
    setIsDrawerOpen(true);
  };

  // Function to handle closing the modal
  const handleModalClose = () => {
    setIsDrawerOpen(false);
    setSelectedNews(null);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  return (
    <>
      <div className="p-4">
        <Heading name="Quản Lý tin tức" />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
            <FaSync /> Làm mới
          </Button>
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
            <TableQueueList model="news" />
          </>
        ) : null}
      </div>
      <BlogDetailsDrawer
        open={isDrawerOpen}
        onClose={handleModalClose}
        blog={selectedNews}
      />
    </>
  );
};

export default News;
