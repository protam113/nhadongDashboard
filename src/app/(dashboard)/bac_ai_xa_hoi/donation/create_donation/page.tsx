"use client";

import React, { useCallback, useState } from "react";
import { Input, Select, Upload, Button, Image, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { RcFile } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import Heading from "@/components/design/Heading";
import BackButton from "@/components/Button/BackButton";
import { useCreateDonation } from "@/hooks/donation/useDonation";
import DonationRichText from "@/components/main/donation/DonationRichText";
import MoreType from "@/app/(dashboard)/blog/blog_management/create_blog/MoreType";

const { Option } = Select;
const { TextArea } = Input;

const Page = () => {
  const { mutate: createEvent } = useCreateDonation();
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]); // Khai báo kiểu UploadFile
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [content, setContent] = useState("");
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: [] as RcFile[],
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

    // Convert RcFile to File[] if necessary
    const convertedImage =
      fileList.length > 0
        ? fileList.map((file) => file.originFileObj as File)
        : null;

    const donationDataToSend = {
      ...blogData,
      title: form.getFieldValue("title"),
      description: form.getFieldValue("description"),
      image: convertedImage,
      metadata: blogData.metadata.map((item) => JSON.stringify(item)),
      content,
      status: form.getFieldValue("status"),
      link: form.getFieldValue("link"), // Add the 'link' field
      visibility: form.getFieldValue("visibility"), // Add the 'visibility' field
    };

    try {
      createEvent(donationDataToSend);
      form.resetFields();
      setFileList([]);
      setBlogData({
        title: "",
        description: "",
        image: [],
        visibility: "",
        link: "",
        file_type: [],
        file: [],
        metadata: [],
      });
      setContent("");
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
