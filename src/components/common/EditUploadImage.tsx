// components/common/EditUploadImage.tsx
import React, { useState } from "react";
import { Upload, Image, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { RcFile } from "antd/lib/upload";
import { resizeImage } from "@/utils/imageResize";

interface UploadImageProps {
  onImageChange: (file: RcFile | null) => void;
  maxCount?: number;
  tooltipTitle?: string;
  file: string; // URL of the initial file to display
}

const EditUploadImage: React.FC<UploadImageProps> = ({
  onImageChange,
  maxCount = 1,
  tooltipTitle = "Vui lòng upload hình ảnh kích thước 820x500px.",
  file,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(
    file
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: file, // Hiển thị ảnh từ file cũ
          },
        ]
      : []
  );
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const newFile = newFileList[newFileList.length - 1];

    if (newFile && newFile.originFileObj) {
      try {
        const resizedImage = await resizeImage(newFile.originFileObj);

        const rcResizedImage = Object.assign(resizedImage, {
          uid: newFile.uid,
        }) as RcFile;

        const finalFile: UploadFile = {
          ...newFile,
          originFileObj: rcResizedImage,
          status: "done",
          percent: 100,
          size: rcResizedImage.size,
          name: rcResizedImage.name,
          type: rcResizedImage.type,
        };

        setFileList([finalFile]);
        onImageChange(rcResizedImage); // Truyền file ảnh mới ra ngoài
      } catch (err) {
        console.error("Resize error:", err);
        onImageChange(null);
      }
    } else {
      setFileList(newFileList);
      onImageChange(null);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      try {
        const previewUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          if (file.originFileObj) {
            reader.readAsDataURL(file.originFileObj);
          }
        });

        setPreviewImage(previewUrl);
        setPreviewOpen(true);
      } catch (err) {
        console.error("Preview error:", err);
      }
    } else {
      setPreviewImage(file.url || file.preview || "");
      setPreviewOpen(true);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Tooltip title={tooltipTitle} placement="topLeft">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={() => false} // Ngăn tự động tải lên
          maxCount={maxCount}
          showUploadList={{
            showRemoveIcon: true,
            showPreviewIcon: true,
          }}
        >
          {fileList.length >= maxCount ? null : uploadButton}
        </Upload>
      </Tooltip>
      {previewImage && (
        <Image
          alt="Preview"
          style={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default EditUploadImage;
