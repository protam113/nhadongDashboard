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
    image: RcFile | null; // Chỉnh sửa kiểu file thành RcFile | null
}

const EditBlogCategory: React.FC<{ category: any }> = ({ category }) => {
    const [name, setName] = useState(category?.name || ""); // Hiển thị tên thể loại
    const [imageList, setImageList] = useState<UploadFile<any>[]>(
        category?.image
            ? [
                {
                    uid: '-1', // Unique identifier
                    name: 'image',
                    url: category?.image, // Sử dụng URL từ category nếu có
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
            image: imageList.length > 0 && imageList[0].originFileObj ? imageList[0].originFileObj : null, // Lấy file thực tế từ fileList
        };

        editCategoryMutation({
            categoryId: category.id,
            editCategory,
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
                placeholder="Tên thể loại"
                value={name}
                onChange={(e) => setName(e.target.value)} // Cập nhật tên thể loại
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
