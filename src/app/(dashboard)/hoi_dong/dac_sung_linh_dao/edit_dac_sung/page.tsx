"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, Spin, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import HistoryEditRichText from "@/components/main/history/HistoryEditRichText";
import { HistoryMonasteryData } from "@/lib/historyMonasteryData";
import { useUpdateHistory } from "@/hooks/history_monastery/useHistoryMonastery";
import type { UploadFile } from "antd/es/upload/interface";
import BackButton from "@/components/Button/BackButton";

const Page = () => {
  const [form] = Form.useForm();
  const [refreshKey] = useState(0);
  const [about, setAbout] = useState<string>(""); // Nội dung đã chỉnh sửa
  const [initialContent, setInitialContent] = useState<string>(""); // Nội dung ban đầu
  const [title, setTitle] = useState<string>(""); // Tiêu đề
  const [fileList, setFileList] = useState<UploadFile[]>([]); // Danh sách ảnh upload

  const [historyId] = useState<string>("8e03b68b-e359-4d82-8dfe-39e3b5385291");
  const { mutate } = useUpdateHistory();
  const model = "2b05164a-253a-4540-a450-676619b49b4d";
  const {
    queueData: data,
    isLoading,
    isError,
  } = HistoryMonasteryData(refreshKey, model);

  useEffect(() => {
    if (data) {
      setInitialContent(data.about);
      setTitle(data.title || "");
      if (data.image) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: data.image,
          },
        ]);
      }
    }
  }, [data]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as File);
    } else {
    }
  };

  const handleChange = ({
    file,
    fileList,
  }: {
    file: UploadFile;
    fileList: UploadFile[];
  }) => {
    if (file.status === "done") {
      setFileList(fileList);
    } else if (file.status === "error") {
      message.error("Upload failed.");
    } else {
      setFileList(fileList);
    }
  };

  const handleSave = () => {
    const image = fileList[0]?.url || fileList[0]?.response?.url || null;

    // Chỉ gửi trường nào có thay đổi so với giá trị ban đầu
    const updateHistory: any = {};

    if (about !== initialContent) {
      updateHistory.about = about; // Nếu nội dung thay đổi, thêm vào dữ liệu gửi
    }

    if (title !== data?.title) {
      updateHistory.title = title; // Nếu tiêu đề thay đổi, thêm vào dữ liệu gửi
    }

    if (image !== data?.image) {
      updateHistory.image = image; // Nếu hình ảnh thay đổi, thêm vào dữ liệu gửi
    }

    // Kiểm tra nếu có bất kỳ thay đổi nào và gửi
    if (Object.keys(updateHistory).length > 0) {
      mutate({
        historyId: historyId,
        updateHistory: updateHistory,
      });
    }
  };

  if (isLoading) return <Spin size="large" />;
  if (isError || !data) return <div>Error loading queue data.</div>;

  return (
    <div>
      <BackButton />

      <Form form={form} layout="vertical">
        <Form.Item label="Tiêu đề" help="Vui lòng nhập tiêu đề ">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề của bài viết"
          />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          help="Tải lên hình ảnh với kích thước 820x500px để hiển thị tốt nhất"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            onPreview={handlePreview}
            beforeUpload={() => false} // Ngăn tự động upload
          >
            {fileList.length < 1 && (
              <div>
                <UploadOutlined />
                <p>Click để tải lên hình ảnh</p>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Nội dung" help="Cung cấp nội dung">
          <HistoryEditRichText
            onChange={setAbout}
            initialContent={initialContent}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleSave}
            disabled={
              about === initialContent && !title && fileList.length === 0
            }
            block
          >
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
