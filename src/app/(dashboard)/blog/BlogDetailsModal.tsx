"use client";

import React from "react";
import {Modal, Typography, Divider, Button, Image} from "antd";

const { Title, Paragraph } = Typography;

interface BlogDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    blog: any | null; // Accept blog data type as any
}

const BlogDetailsModal: React.FC<BlogDetailsModalProps> = ({ visible, onClose, blog }) => {
    if (!blog) return null; // Only render if blog is not null

        const parseContent = (content: string) => {
            // Loại bỏ các dấu ngoặc kép ngoài cùng nếu có
            let cleanedString = content.replace(/^"|"$/g, "")
                .replace(/\\"/g, '"')  // Chuyển \\" thành "
                .replace(/'/g, '"');    // Thay dấu nháy đơn bằng dấu nháy kép

            // Kiểm tra nếu chuỗi bắt đầu và kết thúc bằng {{ và }} thì loại bỏ chúng
            if (cleanedString.startsWith("{{") && cleanedString.endsWith("}}")) {
                cleanedString = cleanedString.slice(2, -2);  // Loại bỏ {{ và }}
            }


            // Chắc chắn chuỗi đã trở thành JSON hợp lệ
            try {
                const jsonObject = JSON.parse(`{${cleanedString}}`);  // Đảm bảo thêm dấu ngoặc nhọn bao quanh chuỗi
                return jsonObject;
            } catch (error) {
                console.error("Error parsing content:", error);
                return null;
            }
        };


        const contentData = parseContent(blog.content);

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null} // Tắt các nút mặc định
            title="Thông Tin Chi Tiết Bài Viết"
            width={900}
            bodyStyle={{padding: "24px"}} // Thêm padding cho nội dung modal
            className="bg-white"
        >
            {/* Tiêu đề bài viết */}
            <Title level={3} className="text-3xl font-semibold text-gray-900 mb-4">{blog.title}</Title>

            {/* Mô tả bài viết */}
            <Paragraph className="text-gray-800 mb-4">
                <strong>Mô tả:</strong> {blog.description}
            </Paragraph>

            {/* Nội dung bài viết */}
            <div className="mb-4">
                <strong className="text-gray-900">Nội dung:</strong>
                <div className="space-y-4 mt-2">
                    {/* Display the extracted content */}
                    {contentData && contentData.title && (
                        <p className="text-gray-600 text-16 font-bold">{contentData.title}</p> // Only display title content
                    )}
                    {contentData && contentData.description && (
                        <p className="text-gray-600 text-14 ">{contentData.description}</p> // Only display description content
                    )}
                    {contentData && contentData.content && (
                        <p className="text-gray-600 text-14">{contentData.content}</p> // Only display content
                    )}
                </div>
            </div>

            {/* Link bài viết */}
            <Paragraph className="text-gray-800 mb-4">
                <strong>Link:</strong>
                <a href={blog.link} target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:underline">{blog.link}</a>
            </Paragraph>

            {/* Hình ảnh bài viết */}
            {blog.image && (
                <div className="mb-4">
                    <Image src={blog.image} alt="Blog Image" className="w-full h-auto rounded-xl shadow-lg"/>
                </div>
            )}

            {/* Thể loại bài viết */}
            <Paragraph className="text-gray-800 mb-4"><strong>Thể loại:</strong></Paragraph>
            <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories.map((category: any) => (
                    <span key={category.id}
                          className="bg-indigo-500 text-white py-1 px-3 rounded-full text-sm">{category.name}</span>
                ))}
            </div>

            {/* Thông tin tác giả */}
            <Divider/>
            <div className="flex items-center mt-4">
                {blog.user.profile_image && (
                    <img src={blog.user.profile_image} alt="Profile"
                         className="w-16 h-16 rounded-full object-cover mr-4"/>
                )}
                <div>
                    <Paragraph className="text-gray-800 mb-1">
                        <strong>Tác
                            giả:</strong> {`${blog.user.first_name} ${blog.user.last_name} (${blog.user.username})`}
                    </Paragraph>
                    <Paragraph className="text-gray-600 mb-1">
                        <strong>Email:</strong> {blog.user.email}
                    </Paragraph>
                    {blog.user.phone_number && (
                        <Paragraph className="text-gray-600 mb-1">
                            <strong>Số điện thoại:</strong> {blog.user.phone_number}
                        </Paragraph>
                    )}
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <Button onClick={onClose} className="bg-gray-500 text-white hover:bg-gray-600">
                    Đóng
                </Button>
            </div>
        </Modal>
    );
};

export default BlogDetailsModal;
