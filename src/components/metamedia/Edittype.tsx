"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Form, Select, Upload, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { UploadFile } from "antd/lib/upload/interface";

interface MediaItem {
  id: string;
  file: RcFile | string | null; // Allow null as a valid file value
  file_type: string; // e.g., "IMAGE"
  metadata: string; // Metadata as a string (e.g., JSON)
}

interface MoreTypeProps {
  onDataChange: (data: {
    filetype: string[]; // Array of filetypes
    file: (RcFile | string | null)[]; // Array of RcFile, string, or null
    metadata: string[]; // Metadata as strings
    media_remove: string[]; // Media remove
  }) => void;
  media?: MediaItem[]; // Pass media array here
}

const EditMoreType: React.FC<MoreTypeProps> = ({
  onDataChange,
  media = [],
}) => {
  const [uploadFields, setUploadFields] = useState(
    media.map((item) => ({
      filetype: item.file_type,
      file: item.file, // URL of the media or RcFile
      metadata: JSON.stringify(item.metadata), // Convert metadata to JSON string
    }))
  );

  const [removedMedia, setRemovedMedia] = useState<string[]>([]);

  const handleDataChange = useCallback(() => {
    const validFields = uploadFields.filter(
      (_, index) =>
        !media[index]?.id || !removedMedia.includes(media[index]?.id)
    );

    // Chỉ giữ lại các trường mới (không có `id` từ `media`)
    const newFields = validFields.filter((_, index) => !media[index]?.id);

    const filetypeArray = newFields.map(({ filetype }) => filetype);
    const metadataArray = newFields.map(() => "{}");
    const fileArray = newFields.map(({ file }) => file);

    onDataChange({
      filetype: filetypeArray,
      file: fileArray,
      metadata: metadataArray,
      media_remove: removedMedia, // Gửi `media_remove` cho hình ảnh đã xóa
    });
  }, [uploadFields, removedMedia, onDataChange, media]);

  useEffect(() => {
    handleDataChange();
  }, [uploadFields, removedMedia, handleDataChange]);

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

    if (!newFile && typeof updatedFields[index].file === "string") {
      setRemovedMedia((prev) => {
        const newRemovedMedia = updatedFields[index].file;
        if (typeof newRemovedMedia === "string") {
          return [...prev, newRemovedMedia];
        }
        return prev;
      });
    }

    updatedFields[index] = {
      ...updatedFields[index],
      filetype,
      file: newFile,
    };

    setUploadFields(updatedFields);
  };

  const handleRemoveField = (index: number) => {
    // Nếu ảnh tồn tại trong API, thêm `id` vào `removedMedia`
    if (media[index]?.id) {
      setRemovedMedia((prev) => [...prev, media[index]?.id as string]);
    }

    // Loại bỏ trường khỏi `uploadFields`
    const updatedFields = uploadFields.filter((_, i) => i !== index);
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
          <Upload
            multiple={false}
            listType="picture-card"
            onChange={({ fileList }) =>
              handleFieldChange(index, fileList, field.filetype)
            }
            beforeUpload={() => false}
            defaultFileList={
              typeof field.file === "string"
                ? [
                    {
                      uid: index.toString(),
                      name: `media-${index}`,
                      url: field.file,
                      status: "done",
                    },
                  ]
                : []
            }
          >
            {field.file ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveField(index)}
          style={{ marginLeft: "8px", color: "red" }}
        >
          Xóa
        </Button>
      </div>
    ));

  return (
    <div>
      {renderUploadFields()}
      <button
        type="button"
        onClick={() =>
          setUploadFields([
            ...uploadFields,
            { filetype: "IMAGE", file: null, metadata: "{}" },
          ])
        }
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

export default EditMoreType;
