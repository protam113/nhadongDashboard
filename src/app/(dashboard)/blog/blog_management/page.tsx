"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Modal, Tag, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BlogList } from "@/lib/blogList";
import BlogDetailsModal from "@/app/(dashboard)/blog/BlogDetailsModal";
import { EyeOutlined } from "@ant-design/icons";
import EditBlogModal from "@/app/(dashboard)/blog/blog_management/modal/EditBlogModal";
import { useDeleteBlog } from "@/hooks/blog/useBlog";
import PushButton from "@/components/Button/PushButton";
import { FaSync, FaRegEdit, MdOutlineDelete } from "@/lib/iconLib";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import Pagination from "@/components/Pagination";

const BlogManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category] = useState<string>(""); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const { mutate: deleteBlog } = useDeleteBlog();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm state loading

  const handleEdit = (blog: any) => {
    setSelectedBlog(blog); // Set blog to be edited
    setIsDrawerVisible(true); // Open the drawer
    setLoading(false); // Đảm bảo trạng thái loading không bật
  };

  // Pass model into CategoriesList
  const {
    queueData,
    next,
    isLoading,
    isError,
    count = 0,
  } = BlogList(currentPage, category, refreshKey);
  const totalPages = next ? currentPage + 1 : currentPage;

  const handleDelete = (categoryId: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bài viết này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteBlog(categoryId);
      },
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: "Chi Tiết",
      dataIndex: "full",
      key: "full",
      width: 100,
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
        <Heading name="Quản Lý Bài Viết (Blog)" />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
            <FaSync /> Làm mới
          </Button>
          <PushButton
            href="/blog/blog_management/create_blog"
            label={"Tạo Bài Viêt"}
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
        {count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      <BlogDetailsModal
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        blog={selectedBlog}
      />
      <EditBlogModal
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        blog={selectedBlog} // Pass selected blog to EditBlogModal
        loading={loading}
        setLoading={setLoading} // Truyền state và hàm setLoading
      />
    </>
  );
};

export default BlogManagement;
