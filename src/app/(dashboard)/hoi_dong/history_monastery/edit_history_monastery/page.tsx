"use client";

import HistoryEditRichText from "@/components/main/history/HistoryEditRichText";
import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Spin,
  Input,
  Upload,
  message,
  Tooltip,
  Image,
} from "antd";
import { HistoryMonasteryData } from "@/lib/historyMonasteryData";
import { useUpdateHistory } from "@/hooks/history_monastery/useHistoryMonastery";
import { UploadFile } from "antd/lib/upload";
import { RcFile } from "antd/es/upload";
import { PlusOutlined } from "@ant-design/icons";

const Page = () => {
  const [form] = Form.useForm();
  const [refreshKey] = useState(0); // State để làm mới dữ liệu
  const [about, setAbout] = useState<string>(""); // State để chứa nội dung đã chỉnh sửa
  const [initialContent, setInitialContent] = useState<string>(""); // State để lưu nội dung ban đầu
  const [title, setTitle] = useState<string>(""); // State để chứa title
  const [image, setImage] = useState<any>(null); // State để chứa image
  const [previewImage, setPreviewImage] = useState<string>(""); // State cho preview image
  const [previewOpen, setPreviewOpen] = useState<boolean>(false); // State để mở preview image
  const [historyId] = useState<string>("5");
  const { mutate } = useUpdateHistory();
  const model = "f33a306a-d0a2-4ab2-8e8b-01cb65f8ccb1";
  const {
    queueData: data,
    isLoading,
    isError,
  } = HistoryMonasteryData(refreshKey, model);

  useEffect(() => {
    if (data) {
      setInitialContent(data.about);
      setTitle(data.title || ""); // Cập nhật title
      setImage(data.image || null); // Cập nhật image
    }
  }, [data]);

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

  const handleChange = (info: any) => {
    if (info.file.status === "done") {
      setImage(info.file.response); // Cập nhật URL ảnh khi upload thành công
    } else if (info.file.status === "error") {
      message.error("Upload failed.");
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleSave = () => {
    if (about !== initialContent || title || image) {
      mutate({
        historyId: historyId,
        updateHistory: {
          about: about,
          title: title,
          image: image, // Gửi image mới
        },
      }); // Gửi dữ liệu đã chỉnh sửa tới API hoặc hook xử lý
    }
  };

  if (isLoading) return <Spin size="large" />;
  if (isError || !data) return <div>Error loading queue data.</div>; // Kiểm tra nếu `data` không tồn tại

  return (
    <Form form={form}>
      <Form.Item label="Title">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
        />
      </Form.Item>

      <Form.Item label="Image">
        <Tooltip
          title="Lưu ý: Vui lòng upload hình ảnh có kích thước 820x500px để hiển thị tốt nhất."
          placement="top"
        >
          <Upload
            listType="picture-card"
            fileList={image ? [image] : []} // Chuyển đổi image state thành array với UploadFile
            onChange={handleChange}
            onPreview={handlePreview}
            beforeUpload={() => false} // Ngừng upload tự động
          >
            {image ? null : uploadButton}
          </Upload>
        </Tooltip>
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

      <HistoryEditRichText
        onChange={setAbout} // Cập nhật `about` khi người dùng thay đổi
        initialContent={initialContent} // Truyền dữ liệu ban đầu vào editor
      />

      <Button
        type="primary"
        onClick={handleSave}
        disabled={about === initialContent && !title && !image}
      >
        Save Changes
      </Button>
    </Form>
  );
};

export default Page;
