"use client";

import { Form, Input, Button, Upload, Image } from "antd";
import Heading from "@/components/design/Heading";
import { useUpdateProfile } from "@/hooks/auth/useProfile";
import { useUser } from "@/context/userProvider";
import { useState } from "react";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";

const Page: React.FC = () => {
  const [form] = Form.useForm();
  const { mutate } = useUpdateProfile();
  const { userInfo } = useUser() || {}; // Lấy thông tin người dùng hiện tại
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    // Lưu fileList mới vào state
    setFileList(fileList);
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
  // Hàm xử lý khi gửi form
  const onFinish = (values: {
    phone_number: string | null;
    first_name: string | null;
    last_name: string | null;
  }) => {
    const profileImage = fileList[0]?.originFileObj || null;
    mutate({
      ...values,
      profile_image: profileImage, // Gửi file ảnh vào API
    });
  };

  // Thiết lập giá trị ban đầu của form
  const initialValues = {
    first_name: userInfo?.first_name || "",
    last_name: userInfo?.last_name || "",
    phone_number: userInfo?.phone_number || "",
  };

  return (
    <div className="justify-center items-center min-h-screen">
      <div className="p-6 rounded w-full">
        <Heading name="Cập nhật thông tin cá nhân" />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialValues} // Đặt giá trị mặc định
          className="space-y-4"
        >
          <Form.Item label="Ảnh Đại Diện">
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
          <Form.Item
            label="Họ"
            name="first_name"
            rules={[{ required: true, message: "Vui lòng nhập họ." }]}
          >
            <Input placeholder="Nhập họ" />
          </Form.Item>
          <Form.Item
            label="Tên"
            name="last_name"
            rules={[{ required: true, message: "Vui lòng nhập tên." }]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone_number"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại." },
              { pattern: /^\d+$/, message: "Số điện thoại không hợp lệ." },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Page;
