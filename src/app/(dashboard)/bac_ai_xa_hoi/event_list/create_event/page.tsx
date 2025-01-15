"use client";

import React, { useCallback, useState } from "react";
import { Input, Select, Button, Form, message } from "antd";
import { useRouter } from "next/navigation";
import { RcFile } from "antd/lib/upload";
import { useCreateEvent } from "@/hooks/event/useEvent";
import Heading from "@/components/design/Heading";
import BackButton from "@/components/Button/BackButton";
import EventRichText from "@/components/main/event/eventRichText";
import MoreType from "@/app/(dashboard)/blog/blog_management/create_blog/MoreType";
import UploadImage from "@/components/common/UploadImage";

const { Option } = Select;

const Page = () => {
  const [form] = Form.useForm(); // Sửa lỗi không khởi tạo form
  const { mutate: createEvent } = useCreateEvent();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState("");
  const [blogData, setBlogData] = useState({
    title: "",
    image: [] as RcFile[],
    description: "",
    category: "event",
    file_type: [] as string[],
    file: [] as RcFile[],
    metadata: [] as string[],
    status: "",
  });

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
    []
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (blogData.title.length === 0) {
        message.error("Vui lòng nhập tiêu đề!");
        setLoading(false);
        return;
      }

      const eventDataToSend = {
        ...blogData,
        metadata: blogData.metadata.map((item) => JSON.stringify(item)),
        description,
      };

      createEvent(eventDataToSend);
      form.resetFields();
      setBlogData({
        title: "",
        image: [],
        description: "",
        category: "event",
        status: "",
        file_type: [],
        file: [],
        metadata: [],
      });
      setDescription("");
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "100%", margin: "0 auto" }}>
      {/* Nút quay lại */}
      <BackButton />
      <Heading name="tạo sự kiện mới " />
      {/* Form */}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Tên sự kiện */}
        <Form.Item
          label="Tên sự kiện"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên sự kiện!" }]}
        >
          <Input
            placeholder="Nhập tiêu đề bài viết "
            value={blogData.title}
            onChange={(e) =>
              setBlogData((prevData) => ({
                ...prevData,
                title: e.target.value,
              }))
            }
          />
        </Form.Item>

        {/* Mô tả */}
        <EventRichText
          onChange={setDescription} // Update description state
          initialContent={description}
        />

        {/* Trạng thái */}
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="open">Mở sự kiện có thể đăng ký</Option>
            <Option value="close">Đóng sự kiện không thể đăng ký</Option>
          </Select>
        </Form.Item>

        {/* Upload ảnh */}
        <Form.Item label="Hình ảnh">
          <UploadImage
            onImageChange={handleImageChange}
            maxCount={1}
            tooltipTitle="Vui lòng upload hình ảnh kích thước 820x500px."
          />
        </Form.Item>
        <Form.Item>
          <div className="mb-4">
            <Heading name="Thêm tài liệu hoặc PDF" />
            <MoreType onDataChange={handleDataChange} />
          </div>
        </Form.Item>
        {/* Nút gửi */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Tạo Sự Kiện
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
