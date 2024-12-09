"use client";

import { Form, Input, Button, Upload } from "antd";
import Heading from "@/components/design/Heading";
import { useUpdateProfile } from "@/hooks/auth/useProfile";
import { useUser } from "@/context/userProvider";
import { UploadOutlined } from "@ant-design/icons";

const Page: React.FC = () => {
  const [form] = Form.useForm();
  const { mutate } = useUpdateProfile();
  const { userInfo } = useUser() || {}; // Lấy thông tin người dùng hiện tại

  // Hàm xử lý khi gửi form
  const onFinish = (values: {
    profile_image: File | null;
    phone_number: string | null;
    first_name: string | null;
    last_name: string | null;
  }) => {
    // Gửi dữ liệu qua API để cập nhật
    mutate(values);
  };

  // Thiết lập giá trị ban đầu của form
  const initialValues = {
    first_name: userInfo?.first_name || "",
    last_name: userInfo?.last_name || "",
    phone_number: userInfo?.phone_number || "",
    profile_image: null,
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
          <Form.Item
            label="Ảnh đại diện"
            name="profile_image"
            valuePropName="fileList"
          >
            <Upload beforeUpload={() => false} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
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
