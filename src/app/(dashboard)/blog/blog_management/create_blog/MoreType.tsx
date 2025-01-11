"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Form, Image, Select, Tooltip, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { UploadFile } from "antd/lib/upload/interface";

interface MoreTypeProps {
  onDataChange: (data: {
    filetype: string[]; // Array of filetypes
    file: RcFile[]; // Array of RcFile objects
    metadata: string[]; // Metadata dưới dạng chuỗi
  }) => void;
}

const MoreType: React.FC<MoreTypeProps> = ({ onDataChange }) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const [uploadFields, setUploadFields] = useState<
    {
      filetype: string;
      file: RcFile | null;
      metadata: string; // Metadata là chuỗi
    }[]
  >([{ filetype: "IMAGE", file: null, metadata: "{}" }]);

  const handleDataChange = useCallback(() => {
    const validFields = uploadFields.filter(({ file }) => file !== null);

    // Tạo mảng chứa từng phần dữ liệu
    const fileArray = validFields.map(({ file }) => file as RcFile);
    // Tạo mảng chứa từng phần dữ liệu
    const filetypeArray = validFields.map(({ filetype }) => filetype);
    const metadataArray = validFields.map(
      ({ metadata }) => JSON.parse(metadata) // Chuyển metadata từ chuỗi JSON thành đối tượng
    ); // metadata sẽ là mảng các đối tượng thay vì chuỗi

    // Gửi dữ liệu cho onDataChange
    onDataChange({
      filetype: filetypeArray,
      file: fileArray,
      metadata: metadataArray, // metadata là mảng các đối tượng JSON
    });
  }, [uploadFields, onDataChange]);

  useEffect(() => {
    handleDataChange();
  }, [uploadFields, handleDataChange]);

  const addUploadField = () => {
    setUploadFields([
      ...uploadFields,
      {
        filetype: "IMAGE",
        file: null,
        metadata: "{}",
      },
    ]);
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

  const removeUploadField = (index: number) => {
    const updatedFields = uploadFields.filter((_, idx) => idx !== index);
    setUploadFields(updatedFields);
  };

  const handleFieldChange = (
    index: number,
    fileList: UploadFile[],
    filetype: string
  ) => {
    const updatedFields = [...uploadFields];
    const newFile =
      fileList.length > 0
        ? (fileList[fileList.length - 1].originFileObj as RcFile)
        : null;

    if (newFile) {
      updatedFields[index] = {
        ...updatedFields[index],
        filetype,
        file: newFile,
      };
    }

    setUploadFields(updatedFields);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const renderUploadFields = () =>
    uploadFields.map((field, index) => (
      <div key={index} style={{ marginBottom: "16px" }}>
        <Form.Item label={`Loại tệp ${index + 1}`}>
          <Select
            value={field.filetype}
            onChange={(value) => {
              const updatedFields = [...uploadFields];
              updatedFields[index].filetype = value;
              setUploadFields(updatedFields);
            }}
          >
            <Select.Option value="IMAGE">IMAGE</Select.Option>
            <Select.Option value="PDF">PDF</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={`Tải lên tệp ${index + 1}`}>
          <Tooltip
            title="Lưu ý: Vui lòng upload hình ảnh có kích thước 820x500px để hiển thị tốt nhất."
            placement="top"
          >
            <Upload
              multiple={false}
              listType="picture-card"
              onChange={({ fileList }) =>
                handleFieldChange(index, fileList, field.filetype)
              }
              onPreview={handlePreview}
              beforeUpload={() => false}
            >
              {field.file ? null : uploadButton}
            </Upload>
          </Tooltip>
          {previewImage && (
            <Image
              alt="Hình ảnh xem trước bài viết"
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
              }}
              src={previewImage}
            />
          )}
          <button
            type="button"
            onClick={() => removeUploadField(index)}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor: "red",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            Xóa
          </button>
        </Form.Item>
      </div>
    ));

  return (
    <div>
      {renderUploadFields()}
      <button
        type="button"
        onClick={addUploadField}
        style={{
          display: "block",
          marginTop: "16px",
          padding: "8px 16px",
          backgroundColor: "#1890ff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Thêm tệp mới
      </button>
    </div>
  );
};

export default MoreType;
