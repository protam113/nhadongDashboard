// CreateNewPage.tsx
'use client';

import React from 'react';
import useNew from '@/hooks/new/useNew';
import NewForm from '@/utils/new/newForm';
import { Form, Input, Button, Upload, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from "antd/lib/upload";

const CreateNewPage: React.FC = () => {
    const {
        blogData, // Lấy dữ liệu blog
        sections,
        selectedType,
        setSelectedType,
        handleAddSection,
        handleSaveBlog,
        handleChangeContent,
        updateBlogData, // Hàm cập nhật blogData
    } = useNew();

    const handleImageUpload = (file: RcFile) => {
        updateBlogData('image', URL.createObjectURL(file)); // Cập nhật hình ảnh qua updateBlogData
        return false; // Ngăn không cho antd tự xử lý upload
    };

    return (
        <div className="flex">
            <div className="bg-white p-6 rounded-lg w-full">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                    Tạo Bài Viết Mới
                </h2>
                <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                    <Card title="Tạo Blog" bordered={false}>
                        <Form layout="vertical">
                            <Form.Item label="Tiêu đề">
                                <Input
                                    value={blogData.title} // Dùng giá trị từ blogData
                                    onChange={(e) => updateBlogData('title', e.target.value)} // Gọi hàm cập nhật
                                />
                            </Form.Item>
                            <Form.Item label="Mô tả">
                                <Input
                                    value={blogData.desc} // Dùng giá trị từ blogData
                                    onChange={(e) => updateBlogData('desc', e.target.value)} // Gọi hàm cập nhật
                                />
                            </Form.Item>
                            <Form.Item label="Hình ảnh chính">
                                <Upload
                                    beforeUpload={handleImageUpload}
                                >
                                    <Button icon={<PlusOutlined />}>Tải lên hình ảnh</Button>
                                </Upload>
                            </Form.Item>

                            {/* Form nhập liệu */}
                            <NewForm
                                sections={sections}
                                selectedType={selectedType}
                                setSelectedType={setSelectedType}
                                handleAddSection={handleAddSection}
                                handleChangeContent={handleChangeContent} // Thêm hàm này vào
                            />

                            {/* Nút Lưu */}
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSaveBlog} // Giữ nguyên cách gọi hàm
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow"
                                >
                                    Lưu Bài Viết
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateNewPage;
