"use client";

import React from "react";
import {Modal, Typography, Divider, Button, Avatar, Image} from "antd";

const { Title, Paragraph } = Typography;

interface NewsDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    doc: any | null;
}

const DocsDetailsModal: React.FC<NewsDetailsModalProps> = ({ visible, onClose, doc }) => {
    if (!doc) return null;

    // Helper function to clean and parse the content field
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


    const contentData = parseContent(doc.content);

    // Parse the content data
    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            title="Thông Tin Chi Tiết Bài Viết"
            width={900}
            bodyStyle={{ padding: "24px" }}
            className="bg-white"
        >
            {/* Title of the blog post */}
            <Title level={3} className="text-3xl font-semibold text-gray-900 mb-4">
                {doc.title}
            </Title>

            {/* Description of the blog post */}
            <Paragraph className="text-gray-800 mb-4">
                <strong>Mô tả:</strong> {doc.description}
            </Paragraph>

            {/* Content of the blog post */}
            <div className="mb-4">
                <strong className="text-xl text-gray-900">Nội dung:</strong>
                <div className="space-y-4 mt-2">
                    {/* Display the extracted content */}
                    {contentData && contentData.title && (
                        <p className="text-gray-600">{contentData.title}</p> // Only display title content
                    )}
                    {contentData && contentData.description && (
                        <p className="text-gray-600">{contentData.description}</p> // Only display description content
                    )}
                    {contentData && contentData.content && (
                        <p className="text-gray-600">{contentData.content}</p> // Only display content
                    )}
                </div>
            </div>

            {doc.image && (
                <div className="mb-4">
                    <Image src={doc.image} alt="Blog Image" className="w-full h-auto rounded-xl shadow-lg"/>
                </div>
            )}

            {/* Link to the blog post */}
            <Paragraph className="text-gray-800 mb-4">
                <strong>Link:</strong>
                <a
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    {doc.link}
                </a>
            </Paragraph>

            {/* Categories of the blog post */}
            <Paragraph className="text-gray-800 mb-4">
                <strong>Thể loại:</strong>
            </Paragraph>
            <div className="flex flex-wrap gap-2 mb-4">
                {doc.categories && doc.categories.length > 0 ? (
                    doc.categories.map((category: any) => (
                        <span
                            key={category.id}
                            className="bg-indigo-500 text-white py-1 px-3 rounded-full text-sm"
                        >
                            {category.name}
                        </span>
                    ))
                ) : (
                    <span>No categories available</span>
                )}
            </div>

            {/* Author information */}
            <Divider />
            <div className="flex items-center mt-4">
                {doc.user.profile_image && (
                    <Avatar
                        src={doc.user.profile_image}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                )}
                <div>
                    <Paragraph className="text-gray-800 mb-1">
                        <strong>Tác giả:</strong>{" "}
                        {`${doc.user.first_name} ${doc.user.last_name} (${doc.user.username})`}
                    </Paragraph>
                    <Paragraph className="text-gray-600 mb-1">
                        <strong>Email:</strong> {doc.user.email}
                    </Paragraph>
                    {doc.user.phone_number && (
                        <Paragraph className="text-gray-600 mb-1">
                            <strong>Số điện thoại:</strong> {doc.user.phone_number}
                        </Paragraph>
                    )}
                </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-4">
                <Button onClick={onClose} className="bg-gray-500 text-white hover:bg-gray-600">
                    Đóng
                </Button>
            </div>
        </Modal>
    );
};

export default DocsDetailsModal;
