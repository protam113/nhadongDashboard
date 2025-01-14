"use client";

import React, { useCallback, useState } from "react";
import { Input, Select, Upload, Button, Image, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { RcFile } from "antd/lib/upload";
import { useCreateEvent } from "@/hooks/event/useEvent";
import { UploadFile } from "antd/lib/upload/interface";
import Heading from "@/components/design/Heading";
import BackButton from "@/components/Button/BackButton";
import EventRichText from "@/components/main/event/eventRichText";
import MoreType from "@/app/(dashboard)/blog/blog_management/create_blog/MoreType";

const { Option } = Select;

const Page = () => {
  const [form] = Form.useForm(); // Sửa lỗi không khởi tạo form
  const { mutate: createEvent } = useCreateEvent();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [blogData, setBlogData] = useState({
    title: "",
    image: [] as RcFile[],
    category: "event",
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

    // Chuyển đổi RcFile thành File[] hoặc string nếu cần thiết
    const convertedImage =
      fileList.length > 0
        ? fileList.map((file) => file.originFileObj as File) // Chuyển RcFile thành File[]
        : null;

    const eventDataToSend = {
      ...blogData,
      title: form.getFieldValue("title"),
      image: convertedImage, // Đảm bảo kiểu dữ liệu đúng
      metadata: blogData.metadata.map((item) => JSON.stringify(item)),
      description,
      status: form.getFieldValue("status"),
    };

    try {
      createEvent(eventDataToSend);
      form.resetFields();
      setFileList([]);
      setBlogData({
        title: "",
        image: [],
        category: "event",
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

  const handleChange = ({ fileList }: { fileList: any }) =>
    setFileList(fileList);

  const handlePreview = async (file: any) => {
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
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

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
          <Input placeholder="Nhập tên sự kiện" />
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
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
              }}
              src={previewImage}
              alt="Preview"
            />
          )}
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
