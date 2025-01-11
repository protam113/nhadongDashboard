"use client";

import { HistoryMonasteryData } from "@/lib/historyMonasteryData";
import { Button } from "antd";
import React, { useState } from "react";
import { SpinLoading, Error } from "@/components/design/index";

const Page = () => {
  const [refreshKey] = useState(0); // State để làm mới dữ liệu
  const model = "f970e50f-d7ca-441e-8142-da00d68ef09d";
  const {
    queueData: data,
    isLoading,
    isError,
  } = HistoryMonasteryData(refreshKey, model);

  if (isLoading) {
    return <SpinLoading />;
  }
  if (isError) {
    return <Error />;
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
          href="/dang_sang_lap/cuoc_doi_dang_sang_lap/edit_founder_history"
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
