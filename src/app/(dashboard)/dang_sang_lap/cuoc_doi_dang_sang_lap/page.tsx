import { Button } from "antd";
import React from "react";
import { HistoryContent } from "@/components/design/Content";

const Page = () => {
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
      <HistoryContent category="1a8da765-a55f-4857-870e-38c57770907c" />
    </div>
  );
};

export default Page;
