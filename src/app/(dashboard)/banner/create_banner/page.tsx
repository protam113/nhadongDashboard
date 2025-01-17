"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Select, Upload, Button, Image, message, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { useRouter } from "next/navigation";
import { RcFile } from "antd/lib/upload";
import { MdArrowBackIos } from "react-icons/md";
import { useCreateBanner } from "@/hooks/banner/useBanner";

const { Option } = Select;

const Page: React.FC = () => {
  const { mutate } = useCreateBanner();
  const [visibility, setVisibility] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (!visibility) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    mutate({ visibility, image: fileList[0]?.originFileObj ?? null });
    router.back();
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file.originFileObj as RcFile);
    } else {
      setPreviewImage(file.url || file.preview || "");
    }
    setPreviewOpen(true);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Nút quay lại */}
      <div className="flex justify-start mb-4">
        <Button onClick={() => router.back()} icon={<MdArrowBackIos />}>
          Quay lại
        </Button>
      </div>
      <h2 className="text-18 font-bold mb-4">Thêm Banner</h2>

      {/* Name Input */}

      {/* Model Selection */}
      <label className="block mb-2 font-medium text-gray-700">Trạng Thái</label>
      <Select
        placeholder="Chọn Model"
        value={visibility}
        onChange={(value) => setVisibility(value)}
        className="mb-4 w-full"
      >
        <Option value="show">Hiện</Option>
        <Option value="hide">Ẩn</Option>
      </Select>
      <div className="mb-4">
        {/* Image Upload with Preview */}
        <Tooltip title="Kích thước đề xuất: 2560x720">
          <label className="block mb-2 font-medium text-gray-700">Ảnh</label>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => false} // Ngăn tự động tải lên
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Tooltip>
        {previewImage && (
          <Image
            alt="Xem Anh Trươc"
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
            }}
            src={previewImage}
          />
        )}
      </div>
      {/* Submit Button */}
      <Button type="primary" onClick={handleSubmit} className="w-full">
        Thêm Banner{" "}
      </Button>
    </div>
  );
};

export default Page;
