"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Form, Select } from "antd";
import { RcFile } from "antd/es/upload";
import UploadFileMedia from "@/components/common/UploadFile";

interface MoreTypeProps {
  onDataChange: (data: {
    filetype: string[]; // Array of filetypes
    file: RcFile[]; // Array of RcFile objects
    metadata: string[]; // Metadata dưới dạng chuỗi
  }) => void;
}

const MoreType: React.FC<MoreTypeProps> = ({ onDataChange }) => {
  const [uploadFields, setUploadFields] = useState<
    {
      filetype: string;
      file: RcFile | null;
      metadata: string; // Metadata là chuỗi
    }[]
  >([{ filetype: "IMAGE", file: null, metadata: "{}" }]);

  const handleDataChange = useCallback(() => {
    const validFields = uploadFields.filter(({ file }) => file !== null);

    const fileArray = validFields.map(({ file }) => file as RcFile);
    const filetypeArray = validFields.map(({ filetype }) => filetype);
    const metadataArray = validFields.map(({ metadata }) =>
      JSON.parse(metadata)
    );

    onDataChange({
      filetype: filetypeArray,
      file: fileArray,
      metadata: metadataArray,
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

  const removeUploadField = (index: number) => {
    const updatedFields = uploadFields.filter((_, idx) => idx !== index);
    setUploadFields(updatedFields);
  };

  const handleFieldChange = (index: number, file: RcFile | null) => {
    const updatedFields = [...uploadFields];
    updatedFields[index].file = file;
    setUploadFields(updatedFields);
  };

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
          <UploadFileMedia
            onFileChange={(file) => handleFieldChange(index, file)}
            maxCount={1}
            tooltipTitle="Vui lòng upload hình ảnh hoặc tệp PDF."
          />
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
