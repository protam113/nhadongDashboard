"use client";

import { HistoryMonasteryData } from "@/lib/historyMonasteryData";
import { Button, Spin } from "antd";
import React, { useState } from "react";

const Page = () => {
  const [refreshKey] = useState(0); // State để làm mới dữ liệu
  const model = "7449116f-1299-4b67-97b1-c5061a3d2dd5";
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
          href="/hoi_dong/dac_sung_linh_dao/edit_dac_sung"
          size="large"
        >
          Chỉnh sửa thông tin
        </Button>
      </div>
      <p
        className="content"
        dangerouslySetInnerHTML={{
          __html: data.about.replace(/\"/g, ""), // Xóa tất cả dấu "
        }}
      />
    </div>
  );
};

export default Page;
