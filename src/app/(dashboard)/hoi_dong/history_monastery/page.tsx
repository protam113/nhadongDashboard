"use client";

import { HistoryMonasteryData } from "@/lib/historyMonasteryData";
import { Button, Spin } from "antd";
import React, { useState } from "react";

const Page = () => {
  const [refreshKey] = useState(0); // State để làm mới dữ liệu
  const model = "f33a306a-d0a2-4ab2-8e8b-01cb65f8ccb1";
  const {
    queueData: data,
    isLoading,
    isError,
  } = HistoryMonasteryData(refreshKey, model);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh", // Chiều cao toàn màn hình
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
  if (isError) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontFamily: "Arial, sans-serif",
          color: "#ff4d4f",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Lỗi tải dữ liệu
        </h1>
        <p>
          Hệ thống không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng hoặc
          thử lại sau.
        </p>
      </div>
    );
  }
  if (!data) {
    return (
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#ff4d4f", // Màu đỏ cảnh báo
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        Hãy cập nhật thông tin website.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-right mb-4">
        <Button
          type="primary"
          href="/hoi_dong/history_monastery/edit_history_monastery"
          size="large"
        >
          Chỉnh sửa thông tin
        </Button>
      </div>
      <div>
        <div>
          <h1 className="text-3xl font-bold">{data.title}</h1>
        </div>
        <p
          className="content"
          dangerouslySetInnerHTML={{
            __html: data.about.replace(/\"/g, ""), // Xóa tất cả dấu "
          }}
        />
      </div>
    </div>
  );
};

export default Page;
