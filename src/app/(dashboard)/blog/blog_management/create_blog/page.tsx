"use client";

import React, { useState, useCallback } from "react";
import { Form, Input, Button, Card, Checkbox, message, Row, Col } from "antd";
import { RcFile } from "antd/lib/upload";
import { useCreateBlog } from "@/hooks/blog/useBlog";
import { CategoriesList } from "@/lib/categoriesList";
import { useRouter } from "next/navigation";
import BackButton from "@/components/Button/BackButton";
import Heading from "@/components/design/Heading";
import ContentSection from "@/components/main/blog/ContentSection";
import MoreType from "./MoreType";
import UploadImage from "@/components/common/UploadImage";

const { TextArea } = Input;

const CreateBlogPage: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: [] as RcFile[],
    content: "",
    category: [] as string[],
    link: "",
    file_type: [] as string[],
    file: [] as RcFile[],
    metadata: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const { mutate: createBlogMutation } = useCreateBlog();
  const [form] = Form.useForm();
  const { queueData, isLoading, isError } = CategoriesList(1, "blog", 0);
  const router = useRouter();

  const handleCategoryChange = (checkedValues: string[]) => {
    setBlogData((prevData) => ({ ...prevData, category: checkedValues }));
  };

  const handleDataChange = useCallback(
    (data: { filetype: string[]; file: RcFile[]; metadata: string[] }) => {
      const { filetype, file, metadata } = data;

      // Cập nhật từng phần một như handleCategoryChange
      if (filetype) {
        setBlogData((prevData) => ({
          ...prevData,
          file_type: filetype, // Cập nhật file_type
        }));
      }

      if (file) {
        setBlogData((prevData) => ({
          ...prevData,
          file: file, // Cập nhật mảng tệp file
        }));
      }

      if (metadata) {
        setBlogData((prevData) => ({
          ...prevData,
          metadata: metadata,
        }));
      }
    },
    [] // Không phụ thuộc vào bất kỳ giá trị nào ngoài data
  );

  const handleImageChange = (file: RcFile | null) => {
    if (file) {
      setBlogData((prevData) => ({
        ...prevData,
        image: [file],
      }));
    } else {
      setBlogData((prevData) => ({
        ...prevData,
        image: [],
      }));
    }
  };

  const handleSaveBlog = async () => {
    setLoading(true);
    try {
      if (blogData.category.length === 0) {
        message.error("Vui lòng chọn ít nhất một thể loại!");
        setLoading(false);
        window.location.reload();
        return;
      }

      if (blogData.image.length === 0) {
        message.error("Vui lòng tải lên một hình ảnh!");
        window.location.reload();

        return;
      }

      const blogDataToSend = {
        ...blogData,
        content,
        metadata: blogData.metadata.map((item) => JSON.stringify(item)),
      };

      createBlogMutation(blogDataToSend);
      form.resetFields();
      setBlogData({
        title: "",
        description: "",
        image: [],
        content: "",
        category: [],
        link: "",
        file_type: [],
        file: [],
        metadata: [],
      });
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi thêm bài viết.");
    } finally {
      setLoading(false);
      router.back();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "100%", margin: "0 auto" }}>
      <BackButton />

      <Heading name="Tạo bài viết mới" />

      <Card bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleSaveBlog}>
          <Row gutter={[12, 24]}>
            {/* Nhóm thông tin cơ bản */}
            <Col span={12}>
              <Form.Item
                label="Tiêu đề bài viết"
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
              >
                <Input
                  placeholder="Nhập tiêu đề bài viết (ví dụ: Hướng dẫn nấu ăn)"
                  value={blogData.title}
                  onChange={(e) =>
                    setBlogData((prevData) => ({
                      ...prevData,
                      title: e.target.value,
                    }))
                  }
                />
              </Form.Item>

              <Form.Item
                label="Mô tả ngắn gọn"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <TextArea
                  placeholder="Nhập một đoạn mô tả ngắn về bài viết"
                  rows={4}
                  value={blogData.description}
                  onChange={(e) =>
                    setBlogData((prevData) => ({
                      ...prevData,
                      description: e.target.value,
                    }))
                  }
                />
              </Form.Item>
            </Col>

            {/* Nhóm hình ảnh */}
            <Col span={12}>
              <Form.Item label="Hình ảnh chính">
                <UploadImage
                  onImageChange={handleImageChange}
                  maxCount={1}
                  tooltipTitle="Vui lòng upload hình ảnh kích thước 820x500px."
                />
              </Form.Item>
            </Col>

            {/* Nội dung và thể loại */}
            <Col span={24}>
              <Form.Item label="Nội dung bài viết">
                <ContentSection
                  onChange={setContent}
                  initialContent={blogData.content}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Link liên kết">
                <Input
                  placeholder="Nhập link liên kết đến bài viết khác"
                  value={blogData.link}
                  onChange={(e) =>
                    setBlogData((prevData) => ({
                      ...prevData,
                      link: e.target.value,
                    }))
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Chọn thể loại">
                {isLoading ? (
                  <p>Đang tải danh sách thể loại...</p>
                ) : isError ? (
                  <p>Có lỗi khi tải danh sách thể loại.</p>
                ) : (
                  <Checkbox.Group
                    options={queueData?.map((category) => ({
                      label: category.name,
                      value: category.id.toString(),
                    }))}
                    onChange={handleCategoryChange}
                    value={blogData.category}
                  />
                )}
              </Form.Item>
            </Col>

            {/* Tài liệu bổ sung */}
            <Col span={24}>
              <div className="mb-4">
                <Heading name="Thêm tài liệu hoặc PDF" />
                <MoreType onDataChange={handleDataChange} />
              </div>
            </Col>
          </Row>

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

export default CreateBlogPage;
