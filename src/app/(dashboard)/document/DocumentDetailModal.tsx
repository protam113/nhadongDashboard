"use client";

import React from "react";
import { Modal, Typography, Divider, Button, Avatar, Image } from "antd";

const { Title, Paragraph } = Typography;

interface NewsDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  doc: any | null;
}

const DocsDetailsModal: React.FC<NewsDetailsModalProps> = ({
  visible,
  onClose,
  doc,
}) => {
  if (!doc) return null;

  // Helper function to clean and parse the content field

  // Parse the content data
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      title="Thông Tin Chi Tiết Bài Viết"
      width={1200}
      bodyStyle={{ padding: "24px" }}
      className="bg-white"
    >
      {/* Title of the blog post */}
      <Title level={3} className="text-3xl font-semibold text-gray-900 mb-4">
        {doc.title}
      </Title>

      {/* Description of the blog post */}
      <Paragraph className="text-gray-800 mb-4">
        <strong>Mô tả:</strong> {doc.description}
      </Paragraph>

      {/* Content of the blog post */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row gap-12 justify-between">
          <div className="lg:text-lg flex flex-col gap-6 text-justify">
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: doc.content.replace(/\"/g, ""), // Xóa tất cả dấu "
              }}
            />
          </div>
        </div>
      </div>

      {doc.image && (
        <div className="mb-4">
          <Image
            src={doc.image}
            alt="Blog Image"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      )}

      {/* Link to the blog post */}
      <Paragraph className="text-gray-800 mb-4">
        <strong>Link:</strong>
        <a
          href={doc.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {doc.link}
        </a>
      </Paragraph>

      {/* Categories of the blog post */}
      <Paragraph className="text-gray-800 mb-4">
        <strong>Thể loại:</strong>
      </Paragraph>
      <div className="flex flex-wrap gap-2 mb-4">
        {doc.category ? (
          <span
            key={doc.category.id}
            className="bg-indigo-500 text-white py-1 px-3 rounded-full text-sm"
          >
            {doc.category.name}
          </span>
        ) : (
          <span>No category available</span>
        )}
      </div>

      <Paragraph className="text-gray-800 mb-2">
        <strong>Hình Ảnh Bổ Sung:</strong>
      </Paragraph>
      <div className="mb-2">
        {doc.media.map((media: any) => (
          <div key={media.id} className="mb-2">
            <span className="bg-indigo-500 text-white py-1 px-2 rounded-full text-sm">
              {media.file_type}
            </span>
            <div className="mt-2">
              {media.file_type === "PDF" ? (
                <div className="relative overflow-hidden w-full h-[600px]">
                  <iframe
                    src={media.file}
                    title="PDF Preview"
                    className="w-full h-full"
                    style={{
                      border: "none",
                    }}
                  />
                </div>
              ) : media.file_type === "IMAGE" ? (
                <div className="relative overflow-hidden w-full h-[200px]">
                  <Image
                    src={media.file}
                    alt="Blog Image"
                    className="rounded-lg shadow-md"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              ) : (
                <p className="text-red-500">Không hỗ trợ loại tệp này</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Author information */}
      <Divider />
      <div className="flex items-center mt-4">
        {doc.user.profile_image && (
          <Avatar
            src={doc.user.profile_image}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
        )}
        <div>
          <Paragraph className="text-gray-800 mb-1">
            <strong>Tác giả:</strong>{" "}
            {`${doc.user.first_name} ${doc.user.last_name} (${doc.user.username})`}
          </Paragraph>
          <Paragraph className="text-gray-600 mb-1">
            <strong>Email:</strong> {doc.user.email}
          </Paragraph>
          {doc.user.phone_number && (
            <Paragraph className="text-gray-600 mb-1">
              <strong>Số điện thoại:</strong> {doc.user.phone_number}
            </Paragraph>
          )}
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={onClose}
          className="bg-gray-500 text-white hover:bg-gray-600"
        >
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

export default DocsDetailsModal;
