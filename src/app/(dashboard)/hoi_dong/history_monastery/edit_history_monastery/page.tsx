"use client";

import HistoryEditRichText from "@/components/main/history/HistoryEditRichText";
import React, { useState, useEffect } from "react";
import { Button, Form, Spin } from "antd";
import { HistoryMonasteryData } from "@/lib/historyMonasteryData";
import { useUpdateHistory } from "@/hooks/history_monastery/useHistoryMonastery";

const Page = () => {
  const [form] = Form.useForm();
  const [refreshKey] = useState(0); // State để làm mới dữ liệu
  const [about, setAbout] = useState<string>(""); // State để chứa nội dung đã chỉnh sửa
  const [initialContent, setInitialContent] = useState<string>(""); // State để lưu nội dung ban đầu
  const { mutate } = useUpdateHistory();

  const {
    queueData: data,
    isLoading,
    isError,
  } = HistoryMonasteryData(refreshKey);

  useEffect(() => {
    if (data) {
      setInitialContent(data.about); // Cập nhật dữ liệu về phần `about` sau khi tải xong
    }
  }, [data]);

  const handleSave = () => {
    if (about !== initialContent) {
      mutate({ about }); // Gửi dữ liệu đã chỉnh sửa tới API hoặc hook xử lý
    }
  };

  if (isLoading) return <Spin size="large" />;
  if (isError || !data) return <div>Error loading queue data.</div>; // Kiểm tra nếu `data` không tồn tại

  return (
    <Form form={form}>
      <HistoryEditRichText
        onChange={setAbout} // Cập nhật `about` khi người dùng thay đổi
        initialContent={initialContent} // Truyền dữ liệu ban đầu vào editor
      />
      <Button
        type="primary"
        onClick={handleSave}
        disabled={about === initialContent}
      >
        Save Changes
      </Button>
    </Form>
  );
};

export default Page;
