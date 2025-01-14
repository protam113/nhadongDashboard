"use client";

import { HistoryContent } from "@/components/design/Content";
import { Button } from "antd";
import React from "react";

const Page = () => {
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
      <HistoryContent category="316132a6-b1ca-4071-8515-bc4fd077e638" />
    </div>
  );
};

export default Page;
