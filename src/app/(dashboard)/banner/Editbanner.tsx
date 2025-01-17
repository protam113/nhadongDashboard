"use client";

import React, { useState } from "react";
import { Upload, Button, message, Select } from "antd";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { useEditBanner } from "@/hooks/banner/useBanner";

const { Option } = Select;

// Định nghĩa kiểu EditCategoryItem
interface EditCategoryItem {
  visibility: string;
  image: RcFile | null; // Chỉnh sửa kiểu file thành RcFile | null
}

const EditBannerDraw: React.FC<{ banner: any }> = ({ banner }) => {
  const [visibility, setVisibility] = useState(banner?.visibility || ""); // Hiển thị tên thể loại
  const [imageList, setImageList] = useState<UploadFile<any>[]>(
    banner?.image
      ? [
          {
            uid: "-1", // Unique identifier
            name: "image",
            url: banner?.image, // Sử dụng URL từ category nếu có
          },
        ]
      : []
  );

  const { mutate } = useEditBanner();

  const handleSubmit = () => {
    if (!visibility) {
      message.error("Tên thể loại không được để trống!");
      return;
    }

    const editBanner: EditCategoryItem = {
      visibility,
      image:
        imageList.length > 0 && imageList[0].originFileObj
          ? imageList[0].originFileObj
          : null, // Lấy file thực tế từ fileList
    };

    mutate({
      bannerId: banner.id,
      editBanner,
    });
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setImageList(fileList); // Cập nhật fileList khi người dùng chọn ảnh mới
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div>
      <Select
        placeholder="Chọn Model"
        value={visibility}
        onChange={(value) => setVisibility(value)}
        className="mb-4 w-full"
      >
        <Option value="show">Hiện</Option>
        <Option value="hide">Ẩn</Option>
      </Select>
      <label className="block mb-2 font-medium text-gray-700">Ảnh</label>
      <Upload
        listType="picture-card"
        fileList={imageList}
        onChange={handleChange}
        beforeUpload={() => false}
      >
        {imageList.length < 1 && uploadButton}
      </Upload>

      <Button type="primary" onClick={handleSubmit} className="mt-2">
        Lưu thay đổi
      </Button>
    </div>
  );
};

export default EditBannerDraw;
