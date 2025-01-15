import React, { useState } from "react";
import { Upload, message, Image, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { RcFile } from "antd/lib/upload";
import { UploadFileStatus } from "antd/es/upload/interface";
import { resizeFile } from "@/utils/useImageResize";

interface UploadImageProps {
  onFileChange: (file: RcFile | null) => void;
  maxCount?: number;
  tooltipTitle?: string;
}

const UploadFileMedia: React.FC<UploadImageProps> = ({
  onFileChange,
  maxCount = 1,
  tooltipTitle = "Vui lòng upload hình ảnh hoặc tệp PDF.",
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const newFile = newFileList[newFileList.length - 1];

    if (newFile && newFile.originFileObj) {
      const fileType = newFile.originFileObj.type;

      console.log(
        "Original file size:",
        (newFile.originFileObj.size / 1024 / 1024).toFixed(2),
        "MB"
      );

      const updatedFile: UploadFile = {
        ...newFile,
        status: "uploading" as UploadFileStatus,
      };

      try {
        // Nếu là ảnh thì resize, nếu là PDF thì giữ nguyên
        const processedFile = fileType.startsWith("image/")
          ? await resizeFile(newFile.originFileObj)
          : newFile.originFileObj;

        const rcProcessedFile = Object.assign(processedFile, {
          uid: newFile.uid,
        }) as RcFile;

        console.log(
          "Processed file size:",
          (rcProcessedFile.size / 1024 / 1024).toFixed(2),
          "MB"
        );

        const finalFile: UploadFile = {
          ...updatedFile,
          originFileObj: rcProcessedFile,
          status: "done" as UploadFileStatus,
          percent: 100,
          size: rcProcessedFile.size,
          name: rcProcessedFile.name,
          type: rcProcessedFile.type,
        };

        setFileList([finalFile]);
        onFileChange(rcProcessedFile);
      } catch (err) {
        const errorFile: UploadFile = {
          ...updatedFile,
          status: "error" as UploadFileStatus,
        };
        setFileList([errorFile]);
        message.error("Có lỗi xảy ra khi xử lý tệp");
        console.error("Processing error:", err);
        onFileChange(null);
      }
    } else {
      setFileList(newFileList);
      onFileChange(null);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    try {
      if (file.type === "application/pdf") {
        message.info(`File PDF: ${file.name}`);
        return;
      }

      let previewUrl = "";

      if (!file.url && !file.preview) {
        if (file.originFileObj) {
          const reader = new FileReader();
          previewUrl = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            if (file.originFileObj) {
              reader.readAsDataURL(file.originFileObj);
            }
          });
        }
      } else {
        previewUrl = file.url || file.preview || "";
      }

      setPreviewImage(previewUrl);
      setPreviewOpen(true);
    } catch (err) {
      console.error("Preview error:", err);
      message.error("Không thể tải xem trước");
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
          beforeUpload={() => false}
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

export default UploadFileMedia;
