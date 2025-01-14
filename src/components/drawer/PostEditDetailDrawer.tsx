"use client";

import React from "react";
import { Drawer, Button, Image } from "antd";

interface BlogDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  blog: any | null; // Accept blog data type as any
}

const PostEditDetailDrawer: React.FC<BlogDetailsDrawerProps> = ({
  open,
  onClose,
  blog,
}) => {
  if (!blog) return null;

  const details = blog.new_data || blog;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Thông Tin Chi Tiết Bài Viết"
      width={1200}
      bodyStyle={{ padding: "24px" }}
    >
      <div className="flex flex-col gap-4">
        {/* Tiêu đề */}
        <h1 className="text-24 font-semibold text-center">
          {details.title || "Chưa có tiêu đề"}
        </h1>

        {/* Danh mục */}
        <div className="flex items-center justify-center text-gray-500 text-sm space-x-6">
          {details.categories &&
          Array.isArray(details.categories) &&
          details.categories.length > 0 ? (
            details.categories.map((category: any) => (
              <span
                key={category.id}
                className="bg-indigo-500 text-white py-1 px-3 rounded-full text-sm"
              >
                {category.name}
              </span>
            ))
          ) : (
            <span className="text-gray-400 italic">Chưa có danh mục</span>
          )}
        </div>

        {/* Mô tả */}
        <div className="text-center mt-2 text-16">
          <p>{details.description || "Chưa có mô tả"}</p>
        </div>

        {/* Hình ảnh chính */}
        {details.image ? (
          <div className="mt-8 w-full max-w-3xl mx-auto">
            <Image
              src={details.image}
              alt="Blog Image"
              className="w-full h-auto rounded-xl shadow-lg"
              width={800}
              height={450}
            />
          </div>
        ) : (
          <p className="text-gray-400 italic text-center">Chưa có hình ảnh</p>
        )}

        {/* Nội dung */}
        <div className="flex flex-col gap-8 mt-12">
          <div
            className="content text-lg text-justify"
            dangerouslySetInnerHTML={{
              __html: details.content
                ? details.content.replace(/\"/g, "")
                : "<p>Chưa có nội dung</p>",
            }}
          />
        </div>

        {/* Nguồn */}
        <div className="mt-6 mb-6">
          <p className="text-gray-500 font-semibold">Nguồn:</p>
          <p className="text-blue-800">{details.link || "Chưa có nguồn"}</p>
        </div>

        {/* Hình ảnh bổ sung */}
        <strong>Hình Ảnh Bổ Sung:</strong>
        <div className="mb-2">
          {details.media && details.media.length > 0 ? (
            details.media.map((media: any) => (
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
            ))
          ) : (
            <p className="text-gray-400 italic">Chưa có hình ảnh bổ sung</p>
          )}
        </div>

        {/* Nút đóng */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={onClose}
            className="bg-gray-500 text-white hover:bg-gray-600"
          >
            Đóng
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default PostEditDetailDrawer;
