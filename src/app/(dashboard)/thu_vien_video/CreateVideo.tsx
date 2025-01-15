import React, { useState } from "react";
import { Form, Input, Button, message, Progress } from "antd";
import { useCreateVideo } from "@/hooks/video/useVideo";
import UploadImage from "@/components/common/UploadImage";

const CreateVideo: React.FC<{
  onLoadingChange?: (isLoading: boolean, progress: number) => void;
}> = ({ onLoadingChange }) => {
  const { mutate } = useCreateVideo();
  const [blogData, setBlogData] = useState({
    image: null as File | null, // Chỉ chứa một file duy nhất
    content: "",
    link: "",
  });
  const [form] = Form.useForm();
  const [progress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Xử lý thay đổi hình ảnh
  const handleImageChange = (file: File | null) => {
    setBlogData((prevData) => ({
      ...prevData,
      image: file, // Chỉ lưu file duy nhất
    }));
  };

  // Xử lý gửi form
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (blogData.content.length === 0) {
        message.error("Vui lòng nhập tiêu đề!");
        setIsLoading(false);
        return;
      }

      if (blogData.link.length === 0) {
        message.error("Vui lòng liên kết video!");
        setIsLoading(false);
        return;
      }

      if (!blogData.image) {
        message.error("Vui lòng tải lên một hình ảnh!");
        setIsLoading(false);
        return;
      }

      const blogDataToSend = {
        ...blogData,
      };

      // Nếu có onLoadingChange, cập nhật trạng thái tải lên
      if (onLoadingChange) {
        onLoadingChange(true, progress);
      }

      mutate(blogDataToSend); // Gọi mutation để tạo video
      form.resetFields();
      setBlogData({
        image: null,
        content: "",
        link: "",
      });
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi thêm video.");
    } finally {
      setIsLoading(false);
      if (onLoadingChange) {
        onLoadingChange(false, 0); // Reset tiến trình khi kết thúc
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-18 font-bold mb-4">Create Video</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <label className="block mb-2 font-medium text-gray-700">Tiêu Đề</label>
        <Input
          placeholder="Tiêu Đề"
          value={blogData.content}
          onChange={(e) =>
            setBlogData({ ...blogData, content: e.target.value })
          }
          className="mb-4"
        />
        <label className="block mb-2 font-medium text-gray-700">
          Đường Dẫn
        </label>
        <Input
          placeholder="Đường Dẫn"
          value={blogData.link}
          onChange={(e) => setBlogData({ ...blogData, link: e.target.value })}
          className="mb-4"
        />
        <label className="block mb-2 font-medium text-gray-700">Image</label>
        <UploadImage
          onImageChange={handleImageChange}
          maxCount={1}
          tooltipTitle="Vui lòng upload hình ảnh kích thước 820x500px."
        />

        <Progress
          percent={progress}
          status={progress === 100 ? "success" : "active"}
        />
        <Button
          type="primary"
          onClick={handleSubmit}
          className="w-full mt-4"
          disabled={isLoading}
        >
          Create Video
        </Button>
      </Form>
    </div>
  );
};

export default CreateVideo;
