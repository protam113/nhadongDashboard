"use client";

import React, { useState } from "react";
import { Input, Upload, Button, message } from "antd";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { useEditVideo } from "@/hooks/video/useVideo";

// Định nghĩa kiểu EditCategoryItem
interface EditCategoryItem {
  content: string;
  image: RcFile | null; // Chỉnh sửa kiểu file thành RcFile | null
  link: string;
}

const EditVideo: React.FC<{ video: any }> = ({ video }) => {
  const [content, setContent] = useState(video?.content || ""); // Hiển thị tên thể loại
  const [link, setLink] = useState(video?.link || ""); // Hiển thị tên thể loại
  const [imageList, setImageList] = useState<UploadFile<any>[]>(
    video?.image
      ? [
          {
            uid: "-1", // Unique identifier
            name: "image",
            url: video?.image, // Sử dụng URL từ category nếu có
          },
        ]
      : []
  );

  const { mutate } = useEditVideo();

  const handleSubmit = () => {
    if (!content) {
      message.error("Tên thể loại không được để trống!");
      return;
    }

    const editVideo: EditCategoryItem = {
      content,
      link,
      image:
        imageList.length > 0 && imageList[0].originFileObj
          ? imageList[0].originFileObj
          : null, // Lấy file thực tế từ fileList
    };

    mutate({
      videoId: video.id,
      editVideo,
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
      <Input
        placeholder="Tiêu Đề"
        value={content}
        onChange={(e) => setContent(e.target.value)} // Cập nhật tên thể loại
      />
      <Input
        placeholder="Đường DẫnDẫn"
        value={link}
        onChange={(e) => setLink(e.target.value)} // Cập nhật tên thể loại
      />
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

export default EditVideo;
