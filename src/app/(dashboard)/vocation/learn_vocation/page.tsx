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
      <HistoryContent category="3b164b58-18c6-454b-bfec-3e345f8fe33f" />
    </div>
  );
};

export default Page;
