"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Typography, Spin, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa"; // Import refresh icon
import { useRouter } from "next/navigation";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { EyeOutlined } from "@ant-design/icons";
import { NewsList } from "@/lib/newsList";
import { useDeleteNews } from "@/hooks/new/useNews";
import EditNewsModal from "@/app/(dashboard)/news/news_management/modal/EditNewsModal";
import NewsDetailsModal from "@/app/(dashboard)/news/NewsDetailsModal";
import { FaArrowLeft, FaArrowRight } from "@/lib/iconLib";

const { Title } = Typography;

const NewsManagement: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [model] = useState<string>(""); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const router = useRouter(); // Hook for navigation
  const { mutate: deleteNews } = useDeleteNews();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Pass model into CategoriesList
  const { queueData,next, isLoading, isError } = NewsList(
    currentPage,
    model,
    refreshKey
  );

  const totalPages = next ? currentPage + 1 : currentPage;

  const handleEdit = (blog: any) => {
    setSelectedBlog(blog); // Set blog to be edited
    setIsDrawerVisible(true); // Open the drawer
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
          {categories.map((category: any) => (
            <div
              key={category.id}
              style={{
                backgroundColor: category.color || "#142857", // Màu nền tùy chọn cho thể loại
                color: "#fff", // Màu chữ
                padding: "5px 10px",
                borderRadius: "4px",
                marginBottom: "5px",
                marginRight: "5px",
              }}
            >
              {category.name} {/* Hiển thị tên của thể loại */}
            </div>
          ))}
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

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Error loading queue data.</div>;

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
        <Title level={2}>Quản Lý Tin Tức</Title>

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{marginLeft: "8px"}}>
            <FaSync/> Làm mới
          </Button>
          <Button type="primary" onClick={handleCreateBLog}>
            Tạo Tin Tức
          </Button>
        </div>

        <div className="overflow-auto" style={{maxHeight: "800px"}}>
          <Table
              columns={columns}
              dataSource={queueData}
              rowKey="id"
              pagination={false}
              scroll={{y: 500}}
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
            <FaArrowLeft/>
          </button>
          {Array.from({length: totalPages}, (_, i) => (
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
            <FaArrowRight/>
          </button>
        </div>
      </div>
      <NewsDetailsModal
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          blog={selectedBlog}
      />
      <EditNewsModal
          open={isDrawerVisible}
          onClose={handleDrawerClose}
          news={selectedBlog} // Pass selected blog to EditBlogModal
      />
    </>
  );
};

export default NewsManagement;
