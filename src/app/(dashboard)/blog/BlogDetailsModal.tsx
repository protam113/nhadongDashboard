"use client";

import React from "react";
import { Drawer, Typography, Divider, Button, Image, Avatar } from "antd";

const { Title, Paragraph } = Typography;

interface BlogDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  blog: any | null; // Accept blog data type as any
}

const BlogDetailsDrawer: React.FC<BlogDetailsDrawerProps> = ({
  open,
  onClose,
  blog,
}) => {
  if (!blog) return null;
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Thông Tin Chi Tiết Bài Viết"
      width={900}
      bodyStyle={{ padding: "24px" }}
    >
      <Title level={3} className="text-3xl font-semibold text-gray-900 mb-4">
        {blog.title}
      </Title>

      <Paragraph className="text-gray-800 mb-4">
        <strong>Mô tả:</strong> {blog.description}
      </Paragraph>

      <div className="mb-4">
        <div className="flex flex-col md:flex-row gap-12 justify-between">
          <div className="lg:text-lg flex flex-col gap-6 text-justify">
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: blog.content.replace(/\"/g, ""), // Xóa tất cả dấu "
              }}
            />
          </div>
        </div>
      </div>

      <Paragraph className="text-gray-800 mb-4">
        <strong>Link:</strong>
        <a
          href={blog.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {blog.link}
        </a>
      </Paragraph>

      {blog.image && (
        <div className="mb-4">
          <Image
            src={blog.image}
            alt="Blog Image"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      )}

      <Paragraph className="text-gray-800 mb-4">
        <strong>Thể loại:</strong>
      </Paragraph>
      <div className="flex flex-wrap gap-2 mb-4">
        {blog.categories.map((category: any) => (
          <span
            key={category.id}
            className="bg-indigo-500 text-white py-1 px-3 rounded-full text-sm"
          >
            {category.name}
          </span>
        ))}
      </div>

      <Divider />
      <div className="flex items-center mt-4">
        {blog.user.profile_image && (
          <Avatar
            src={blog.user.profile_image}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
        )}
        <div>
          <Paragraph className="text-gray-800 mb-1">
            <strong>Tác giả:</strong>{" "}
            {`${blog.user.first_name} ${blog.user.last_name} (${blog.user.username})`}
          </Paragraph>
          <Paragraph className="text-gray-600 mb-1">
            <strong>Email:</strong> {blog.user.email}
          </Paragraph>
          {blog.user.phone_number && (
            <Paragraph className="text-gray-600 mb-1">
              <strong>Số điện thoại:</strong> {blog.user.phone_number}
            </Paragraph>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          onClick={onClose}
          className="bg-gray-500 text-white hover:bg-gray-600"
        >
          Đóng
        </Button>
      </div>
    </Drawer>
  );
};

export default BlogDetailsDrawer;
