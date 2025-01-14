"use client";

import { Button } from "antd";
import React from "react";
import { HistoryContent } from "@/components/design/Content";

const Page = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-right mb-4">
        <Button
          type="primary"
          href="/vocation/learn_vocation/edit_vocation"
          size="large"
        >
          Chỉnh sửa thông tin
        </Button>
      </div>
      <HistoryContent category="b52bfa39-9460-4f12-b0f2-b12aafaaf0c0" />
    </div>
  );
};

export default Page;
