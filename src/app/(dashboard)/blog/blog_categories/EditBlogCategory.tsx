"use client";

import React, { useState } from "react";
import { Input, Upload, Button, message } from "antd";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { useEditCategory } from "@/hooks/cateogry/useCategories";
import { RcFile } from "antd/es/upload";

// Định nghĩa kiểu EditCategoryItem
interface EditCategoryItem {
    name: string;
    file: RcFile | null; // Chỉnh sửa kiểu file thành RcFile | null
}

const EditBlogCategory: React.FC<{ category: any }> = ({ category }) => {
    const [name, setName] = useState(category?.name || ""); // Hiển thị tên thể loại
    const [fileList, setFileList] = useState<UploadFile<any>[]>(
        category?.file
            ? [
                {
                    uid: '-1', // Unique identifier
                    name: 'file',
                    url: category?.file, // Sử dụng URL từ category nếu có
                }
            ]
            : []
    );

    const { mutate: editCategoryMutation } = useEditCategory();

    const handleSubmit = () => {
        if (!name) {
            message.error("Tên thể loại không được để trống!");
            return;
        }

        const editCategory: EditCategoryItem = {
            name,
            file: fileList.length > 0 && fileList[0].originFileObj ? fileList[0].originFileObj : null, // Lấy file thực tế từ fileList
        };

        editCategoryMutation({
            categoryId: category.id,
            editCategory,
        });
    };

    const handleChange: UploadProps["onChange"] = ({ fileList }) => {
        setFileList(fileList); // Cập nhật fileList khi người dùng chọn ảnh mới
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
                placeholder="Tên thể loại"
                value={name}
                onChange={(e) => setName(e.target.value)} // Cập nhật tên thể loại
            />
            <label className="block mb-2 font-medium text-gray-700">Ảnh</label>
            <Upload
                listType="picture-card"
                fileList={fileList} // Hiển thị ảnh cũ nếu có
                onChange={handleChange} // Cập nhật danh sách file
                beforeUpload={() => false} // Ngừng tự động upload ảnh
            >
                {fileList.length < 1 && uploadButton} {/* Nếu không có ảnh nào trong fileList, hiển thị nút upload */}
            </Upload>

            <Button
                type="primary"
                onClick={handleSubmit}
                className="mt-2"
            >
                Lưu thay đổi
            </Button>
        </div>
    );
};

export default EditBlogCategory;
