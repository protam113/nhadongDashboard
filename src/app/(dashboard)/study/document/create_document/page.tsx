"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Select,
  message,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import { CategoriesList } from "@/lib/categoriesList";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import BackButton from "@/components/Button/BackButton";
import Heading from "@/components/design/Heading";
import ContentSection from "@/components/main/blog/ContentSection";
import { useCreateDoc } from "@/hooks/document/useDocs";

const { TextArea } = Input;

const Page: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: [] as RcFile[], // Đổi từ `null` thành mảng `File[]`
    content: "",
    category: "",
    link: "",
  });
  const [currentPage] = useState(1);
  const [refreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const { mutate } = useCreateDoc();
  const [form] = Form.useForm();
  const { queueData, isLoading, isError } = CategoriesList(
    currentPage,
    "document",
    refreshKey
  );

  const handleCategoryChange = (value: string) => {
    setBlogData({ ...blogData, category: value });
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
    setBlogData({
      ...blogData,
      image: fileList.map((file) => file.originFileObj as RcFile),
    }); // Lưu mảng file
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

  const handleSaveBlog = async () => {
    setLoading(true);
    try {
      if (blogData.image.length === 0) {
        message.error("Vui lòng tải lên một hình ảnh!");
        setLoading(false);
        return;
      }

      // Use the HTML content stored in the state
      const blogDataToSend = {
        ...blogData,
        content, // Send the HTML content
        image: blogData.image,
      };

      mutate(blogDataToSend); // Call mutation to create blog
      form.resetFields();
      setBlogData({
        title: "",
        description: "",
        image: [],
        content: "",
        category: "",
        link: "",
      });
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi thêm bài viết.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <BackButton />

      <Heading name="tạo sứ vụ mới  " />

      <Card bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleSaveBlog}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input
              value={blogData.title}
              onChange={(e) =>
                setBlogData({ ...blogData, title: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea
              value={blogData.description}
              onChange={(e) =>
                setBlogData({ ...blogData, description: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Hình ảnh chính">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false} // Ngăn tự động tải lên
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>

            {previewImage && (
              <Image
                alt="Hình ảnh xem trước bài viết"
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
          <Form.Item label="Nôi Dung Chi Tiết">
            <ContentSection
              onChange={setContent}
              initialContent={blogData.content}
            />
          </Form.Item>
          <Form.Item label="Link" name="Link">
            <Input
              value={blogData.link}
              onChange={(e) =>
                setBlogData({ ...blogData, link: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Thể loại">
            {isLoading ? (
              <p>Đang tải thể loại...</p>
            ) : isError ? (
              <p>Có lỗi khi tải thể loại</p>
            ) : (
              <Select
                value={blogData.category} // Chỉ lưu một thể loại
                onChange={handleCategoryChange} // Cập nhật blogData với thể loại được chọn
                style={{ width: "100%" }}
                placeholder="Chọn thể loại"
              >
                {queueData?.map((category: any) => (
                  <Select.Option
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%", borderRadius: "4px" }}
            >
              Thêm Bài Viết
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Page;
