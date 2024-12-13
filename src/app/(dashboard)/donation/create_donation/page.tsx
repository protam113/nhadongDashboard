"use client";

import React, { useState } from "react";
import { Input, Select, Upload, Button, Image, message, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { RcFile } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import Heading from "@/components/design/Heading";
import BackButton from "@/components/Button/BackButton";
import { useCreateDonation } from "@/hooks/donation/useDonation";
import DonationRichText from "@/components/main/donation/DonationRichText";

const { Option } = Select;
const { TextArea } = Input;

const Page = () => {
  const { mutate: createEvent } = useCreateDonation();
  const [form] = Form.useForm();
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]); // Khai báo kiểu UploadFile
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async (values: any) => {
    createEvent({
      ...values,
      image: fileList[0]?.originFileObj ?? null,
      category: "event",
      content: content,
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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
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
          <Input placeholder="Nhập tên sự kiện" />
        </Form.Item>
        <Form.Item
          label="Mô Tả Ngắn"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập tên sự kiện!" }]}
        >
          <TextArea placeholder="Nhập tên sự kiện" />
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
        <Form.Item
          label="Link"
          name="link"
          rules={[{ required: true, message: "Vui lòng nhập link sự kiện!" }]}
        >
          <Input placeholder="Nhập link (nguồn)" />
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
