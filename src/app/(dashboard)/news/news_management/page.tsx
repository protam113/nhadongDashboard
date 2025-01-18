"use client"; // Ensures this is a client component

import React, { useMemo, useState } from "react";
import { Table, Button, Modal, Tag, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import { EyeOutlined } from "@ant-design/icons";
import { NewsList } from "@/lib/newsList";
import { useDeleteNews } from "@/hooks/new/useNews";
import EditNewsModal from "@/app/(dashboard)/news/news_management/modal/EditNewsModal";
import { FaRegEdit, MdOutlineDelete, FaSync } from "@/lib/iconLib";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import Pagination from "@/components/Pagination";
import BlogDetailsDrawer from "../../blog/BlogDetailsModal";

const NewsManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [model] = useState<string>(""); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const router = useRouter(); // Hook for navigation
  const { mutate: deleteNews } = useDeleteNews();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(false); // Thêm state loading

  // Pass model into CategoriesList
  const {
    queueData,
    next,
    isLoading,
    isError,
    count = 0,
  } = NewsList(currentPage, model, refreshKey);

  const totalPages = next ? currentPage + 1 : currentPage;

  const handleEdit = (blog: any) => {
    setSelectedBlog(blog); // Set blog to be edited
    setIsDrawerVisible(true); // Open the drawer
    setLoading(false); // Đảm bảo trạng thái loading không bật
  };

  const handleDelete = (newsId: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tin tức này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteNews(newsId);
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
      title: "STT",
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
  const dataSource = useMemo(() => queueData, [queueData]);

  if (isLoading) return <SpinLoading />;
  if (isError) return <Error />;

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedBlog(null);
    setIsDrawerVisible(false); // Close the drawer
  };

  const handleViewDetails = (news: any) => {
    setSelectedBlog(news);
    setIsDrawerOpen(true);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  const handleCreateBLog = () => {
    router.push("/news/news_management/create_news"); // Navigate to the create category page
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
          <Button type="primary" onClick={handleCreateBLog}>
            Tạo Tin Tức
          </Button>
        </div>

        <div className="overflow-auto" style={{ maxHeight: "800px" }}>
          <Table
            columns={columns}
            dataSource={dataSource}
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
      </div>
      <BlogDetailsDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        blog={selectedBlog}
      />
      <EditNewsModal
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        blog={selectedBlog}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};

export default NewsManagement;
