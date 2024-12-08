"use client";

import React, { useState } from "react";
import { Input, Select, Upload, Button, Image, message, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { RcFile } from "antd/lib/upload";
import { useCreateEvent } from "@/hooks/event/useEvent";
import { UploadFile } from "antd/lib/upload/interface";
import Heading from "@/components/design/Heading";
import BackButton from "@/components/Button/BackButton";
import EventRichText from "@/components/main/event/eventRichText";

const { Option } = Select;

const Page = () => {
  const { mutate: createEvent } = useCreateEvent();
  const [form] = Form.useForm();
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]); // Khai báo kiểu UploadFile
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [description, setDescription] = useState("");

  const handleSubmit = async (values: any) => {
    createEvent({
      ...values,
      image: fileList[0]?.originFileObj ?? null,
      category: "event",
      description: description,
    });
    message.success("Tạo sự kiện thành công!");
    router.back();
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
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto mt-8">
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

        {/* Nút gửi */}
        <Form.Item>
          <Button
            type="primary"
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
