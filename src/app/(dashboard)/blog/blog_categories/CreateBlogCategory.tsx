"use client"; // Đảm bảo đây là client component

import React, { useState } from "react";
import { Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateCategory } from "@/hooks/cateogry/useCategories"; // Ensure Tailwind CSS is imported
import { useRouter } from "next/navigation";
import {useUser} from "@/context/userProvider";

const CreateBlogCategory: React.FC = () => {
    const { userRoleId } = useUser() || {};;
    const { mutate: createCategory } = useCreateCategory();
    const [name, setName] = useState<string>(""); // State for category name
    const [file, setFile] = useState<File | null>(null); // State for file upload
    const router = useRouter(); // Initialize useRouter

    const handleSubmit = () => {
        if (!name) {
            message.error("Please fill all fields!");
            return;
        }

        // Create category with model set to "blog"
        createCategory({ name, model: "blog", file });

        // Check user role and show appropriate message
        if (userRoleId === 1) { // Admin
            message.success("Tạo Thể Loại Blog Thành Công!");
        } else if (userRoleId === 2) { // Manager
            message.warning("Tạo Thể Loại Blog Thành Công! Vui lòng đợi admin duyệt.");
        } else {
            message.warning("Tạo Thể Loại Blog Thành Công! Chờ admin duyệt.");
        }

        router.push("/blog/blog_categories"); // Redirect after submission
    };

    const handleFileChange = (info: any) => {
        const uploadedFile = info.file.originFileObj as File;
        setFile(uploadedFile);
    };

    return (
        <div className="p-4">
            <h2 className="text-18 font-bold mb-4">Tạo Thể Loại</h2>

            {/* Name Input */}
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <Input
                placeholder="Tên Thể Loại"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
            />

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

export default CreateBlogCategory;
