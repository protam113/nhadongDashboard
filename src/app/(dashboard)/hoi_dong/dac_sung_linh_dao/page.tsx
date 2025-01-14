import { HistoryContent } from "@/components/design/Content";
import { Button } from "antd";
import React from "react";

const Page = () => {
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
      <HistoryContent category="6bbbaf4c-3ed3-4e30-a99e-bfcebc118b2b" />
    </div>
  );
};

export default Page;
