"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Input, Upload, Button, message, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCreateCategory } from "@/hooks/cateogry/useCategories"; // Ensure Tailwind CSS is imported
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userProvider";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { RcFile } from "antd/lib/upload";

const CreateNewsCategoryModal: React.FC = () => {
  const { userRoleId } = useUser() || {};
  const { mutate: createCategory } = useCreateCategory();
  const [name, setName] = useState<string>(""); // State for category name
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const router = useRouter(); // Initialize useRouter

  const handleSubmit = () => {
    if (!name) {
      message.error("Please fill all fields!");
      return;
    }

    // Create category with model set to "blog"
    createCategory({
      name,
      model: "news",
      image: imageList[0]?.originFileObj ?? null,
    });

    // Check user role and show appropriate message
    if (userRoleId === 1) {
      // Admin
      message.success("Tạo Thể Loại Blog Thành Công!");
    } else if (userRoleId === 2) {
      // Manager
      message.warning(
        "Tạo Thể Loại Blog Thành Công! Vui lòng đợi admin duyệt."
      );
    } else {
      message.warning("Tạo Thể Loại Blog Thành Công! Chờ admin duyệt.");
    }

    router.push("/blog/blog_categories"); // Redirect after submission
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setImageList(fileList);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file.originFileObj as RcFile);
    } else {
      setPreviewImage(file.url || file.preview || "");
    }
    setPreviewOpen(true);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-18 font-bold mb-4">Tạo Thể Loại</h2>

      {/* Name Input */}
      <label className="block mb-2 font-medium text-gray-700">Name</label>
      <Input
        placeholder="Tên Thể Loại"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />

      {/* File Upload */}
      <label className="block mb-2 font-medium text-gray-700">Ảnh</label>
      <Upload
        listType="picture-card"
        fileList={imageList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false} // Ngăn tự động tải lên
      >
        {imageList.length >= 1 ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          alt="Xem Ảnh Trước"
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
        />
      )}

      {/* Submit Button */}
      <Button type="primary" onClick={handleSubmit} className="w-full mt-4">
        Create Category
      </Button>
    </div>
  );
};

export default CreateNewsCategoryModal;
