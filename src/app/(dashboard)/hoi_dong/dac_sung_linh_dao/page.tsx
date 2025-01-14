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
      <HistoryContent category="2b05164a-253a-4540-a450-676619b49b4d" />
    </div>
  );
};

export default Page;
