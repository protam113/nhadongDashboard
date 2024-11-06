"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateCategory } from "@/hooks/cateogry/useCategories"; // Make sure Tailwind CSS is imported
import { useRouter } from "next/navigation";
import { MdArrowBackIos } from "react-icons/md";

const { Option } = Select;

const CreateCategory: React.FC = () => {
    const { mutate: createCategory } = useCreateCategory();
    const [name, setName] = useState<string>("");
    const [model, setModel] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter(); // Initialize useRouter

    const handleSubmit = () => {
        if (!name || !model) {
            message.error("Please fill all fields!");
            return;
        }
        createCategory({ name, model, file });
        message.success("Category created successfully!");
        router.back();
    };

    const handleFileChange = (info: any) => {
        const uploadedFile = info.file.originFileObj as File;
        setFile(uploadedFile);
    };

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
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <Input
                placeholder="Tên Thể Loại"
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

            {/* File Upload */}
            <label className="block mb-2 font-medium text-gray-700">File</label>
            <Upload
                beforeUpload={() => false} // Prevent auto upload
                onChange={handleFileChange}
                className="mb-4"
            >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>

            {/* Submit Button */}
            <Button type="primary" onClick={handleSubmit} className="w-full">
                Create Category
            </Button>
        </div>
    );
};

export default CreateCategory;
