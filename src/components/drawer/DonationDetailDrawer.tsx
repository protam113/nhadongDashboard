"use client";

import React from "react";
import { Drawer, Typography, Divider, Button, Image } from "antd";

const { Title, Paragraph } = Typography;

interface BlogDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  blog: any | null; // Accept blog data type as any
}

const DonationDetailDrawer: React.FC<BlogDetailsDrawerProps> = ({
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
      <Divider />
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

export default DonationDetailDrawer;
