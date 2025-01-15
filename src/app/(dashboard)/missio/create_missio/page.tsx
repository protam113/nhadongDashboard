"use client";

import React, { useCallback, useState } from "react";
import { Form, Input, Button, Card, Select, message, Row, Col } from "antd";
import { RcFile } from "antd/lib/upload";
import { CategoriesList } from "@/lib/categoriesList";
import BackButton from "@/components/Button/BackButton";
import Heading from "@/components/design/Heading";
import ContentSection from "@/components/main/blog/ContentSection";
import { useCreateMission } from "@/hooks/mission/useMission";
import MoreType from "../../blog/blog_management/create_blog/MoreType";
import { useRouter } from "next/navigation";
import UploadImage from "@/components/common/UploadImage";

const { TextArea } = Input;

const Page: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: [] as RcFile[], // Đổi từ `null` thành mảng `File[]`
    content: "",
    category: "",
    link: "",
    file_type: [] as string[],
    file: [] as RcFile[],
    metadata: [] as string[],
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { mutate } = useCreateMission();
  const [form] = Form.useForm();
  const { queueData, isLoading, isError } = CategoriesList(1, "mission", 0);

  const handleCategoryChange = (value: string) => {
    setBlogData({ ...blogData, category: value });
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
      if (blogData.image.length === 0) {
        message.error("Vui lòng tải lên một hình ảnh!");
        setLoading(false);
        return;
      }

      // Use the HTML content stored in the state
      const blogDataToSend = {
        ...blogData,
        content,
        metadata: blogData.metadata.map((item) => JSON.stringify(item)),
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
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <BackButton />

      <Heading name="tạo sứ vụ mới  " />

      <Card bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleSaveBlog}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
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
                <UploadImage
                  onImageChange={handleImageChange}
                  maxCount={1}
                  tooltipTitle="Vui lòng upload hình ảnh kích thước 820x500px."
                />
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
            </Col>
            <Col span={12}>
              <Heading name="Thêm Hình Ảnh Hoặc PDF" />
              <MoreType onDataChange={handleDataChange} />
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

export default Page;
