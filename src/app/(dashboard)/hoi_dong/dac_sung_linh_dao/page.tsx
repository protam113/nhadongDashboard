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

  if (isLoading) return <Spin size="large" />;
  if (isError || !data) return <div>Error loading queue data.</div>; // Kiểm tra nếu `data` không tồn tại

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
