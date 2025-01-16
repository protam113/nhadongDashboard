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
  const [fileList, setFileList] = useState<UploadFile[]>([]); // Danh sách ảnh upload

  const [historyId] = useState<string>("6e11d70f-17ec-4027-a602-e2a1b9a76384");
  const { mutate } = useUpdateHistory();
  const model = "3b164b58-18c6-454b-bfec-3e345f8fe33f";
  const {
    queueData: data,
    isLoading,
    isError,
  } = HistoryMonasteryData(refreshKey, model);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        about: data.about,
      });
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
  }, [data, form]);

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
    if (!data) {
      message.warning("Không thể cập nhật bài viết!!.");
      return;
    }
    if (data.title.length === 0) {
      message.error("Vui lòng bổ sung tiêu đề!");
      return;
    }

    form
      .validateFields()
      .then((values) => {
        const updateHistory: any = {
          ...values,
          image: fileList.map((file) => file.originFileObj || file.url),
        };
        mutate({
          historyId: historyId,
          updateHistory: updateHistory,
        });
      })
      .catch((info) => {
        console.error("Lỗi khi xác thực form:", info);
      });
  };

  if (isLoading) return <Spin size="large" />;
  if (isError || !data) return <div>Error loading queue data.</div>;

  return (
    <div>
      <BackButton />
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu Đề"
          rules={[{ required: true, message: "Hãy nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề" />
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

        <Form.Item
          name="about"
          label="Nội dung"
          rules={[{ required: true, message: "Hãy nhập nội dung" }]}
        >
          <HistoryEditRichText
            onChange={(about) => form.setFieldValue("about", about)}
            initialContent={data?.about}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
