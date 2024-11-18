"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Input, Select, Upload, Button, Image, message } from "antd";
import {  PlusOutlined } from "@ant-design/icons";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { useCreateCategory } from "@/hooks/cateogry/useCategories";
import { useRouter } from "next/navigation";
import { RcFile } from "antd/lib/upload";
import { MdArrowBackIos } from "react-icons/md";

const { Option } = Select;

const CreateCategory: React.FC = () => {
    const { mutate: createCategory } = useCreateCategory();
    const [name, setName] = useState<string>("");
    const [model, setModel] = useState<string>("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = () => {
        if (!name || !model) {
            message.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        createCategory({ name, model, image: fileList[0]?.originFileObj ?? null });
        message.success("Tạo thể loại thành công!");
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
                <Button
                    onClick={() => router.back()}
                    icon={<MdArrowBackIos />}
                >
                    Quay lại
                </Button>
            </div>
            <h2 className="text-18 font-bold mb-4">Tạo Thể Loại</h2>

            {/* Name Input */}
            <label className="block mb-2 font-medium text-gray-700">Tên Thể Loại</label>
            <Input
                placeholder="Nhập tên thể loại"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
            />

            {/* Model Selection */}
            <label className="block mb-2 font-medium text-gray-700">Model</label>
            <Select
                placeholder="Chọn Model"
                value={model}
                onChange={(value) => setModel(value)}
                className="mb-4 w-full"
            >
                <Option value="blog">Blog</Option>
                <Option value="news">News</Option>
                <Option value="document">Document</Option>
            </Select>

            {/* Image Upload with Preview */}
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

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                    }}
                    src={previewImage}
                />
            )}

            {/* Submit Button */}
            <Button type="primary" onClick={handleSubmit} className="w-full">
                Tạo Thể Loại
            </Button>
        </div>
    );
};

export default CreateCategory;
