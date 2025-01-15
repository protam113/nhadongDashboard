"use client";

import React, { useCallback, useState } from "react";
import { Input, Select, Button, Form, message } from "antd";
import { useRouter } from "next/navigation";
import { RcFile } from "antd/lib/upload";
import Heading from "@/components/design/Heading";
import BackButton from "@/components/Button/BackButton";
import { useCreateDonation } from "@/hooks/donation/useDonation";
import DonationRichText from "@/components/main/donation/DonationRichText";
import MoreType from "@/app/(dashboard)/blog/blog_management/create_blog/MoreType";
import UploadImage from "@/components/common/UploadImage";

const { Option } = Select;
const { TextArea } = Input;

const Page = () => {
  const { mutate } = useCreateDonation();
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [content, setContent] = useState("");
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: [] as RcFile[],
    content: "",
    link: "",
    visibility: "",
    file_type: [] as string[],
    file: [] as RcFile[],
    metadata: [] as string[],
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
    [] // Không phụ thuộc vào bất kỳ giá trị nào ngoài data
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (blogData.title.length === 0) {
        message.error("Vui lòng nhập tiêu đề!");
        setLoading(false);
        return;
      }

      if (blogData.image.length === 0) {
        message.error("Vui lòng tải lên một hình ảnh!");

        return;
      }

      const donationDataToSend = {
        ...blogData,
        metadata: blogData.metadata.map((item) => JSON.stringify(item)),
        content,
      };
      mutate(donationDataToSend);
      form.resetFields();
      setBlogData({
        title: "",
        description: "",
        image: [],
        content: "",
        visibility: "",
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

  return (
    <div style={{ padding: "20px", maxWidth: "100%", margin: "0 auto" }}>
      {/* Nút quay lại */}
      <BackButton />
      <Heading name="tạo tin quyên góp mới " />

      {/* Form */}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Tên sự kiện */}
        <Form.Item
          label="Tiêu Đề"
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
        <Form.Item
          label="Mô Tả Ngắn"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập tên sự kiện!" }]}
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

        {/* Mô tả */}
        <DonationRichText
          onChange={setContent} // Update description state
          initialContent={content}
        />

        {/* Trạng thái */}
        <Form.Item
          label="Trạng thái"
          name="visibility"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="show">Hiện</Option>
            <Option value="hide">Ẩn</Option>
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
        <Form.Item
          label="Link"
          name="link"
          rules={[{ required: true, message: "Vui lòng nhập link sự kiện!" }]}
        >
          <Input placeholder="Nhập link (nguồn)" />
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
            loading={loading}
            htmlType="submit"
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
