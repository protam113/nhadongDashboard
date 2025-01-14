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
      <HistoryContent category="f33a306a-d0a2-4ab2-8e8b-01cb65f8ccb1" />
    </div>
  );
};

export default Page;
