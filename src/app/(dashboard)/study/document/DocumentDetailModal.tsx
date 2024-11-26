"use client";

import React from "react";
import { Modal, Typography, Divider,Button } from "antd";

const { Title, Paragraph } = Typography;

interface NewsDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    news: any | null; // Accept blog data type as any
}

const DocsDetailsModal: React.FC<NewsDetailsModalProps> = ({ visible, onClose, news }) => {
    if (!news) return null; // Only render if blog is not null

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
            <Title level={3} className="text-3xl font-semibold text-gray-900 mb-4">{news.title}</Title>

            {/* Mô tả bài viết */}
            <Paragraph className="text-gray-800 mb-4">
                <strong>Mô tả:</strong> {news.description}
            </Paragraph>

            {/* Nội dung bài viết */}
            <div className="mb-4">
                <strong className="text-xl text-gray-900">Nội dung:</strong>
                <div className="space-y-4 mt-2">

                    <p className="text-gray-600">{news.content}</p>
                </div>
            </div>

            {/* Link bài viết */}
            <Paragraph className="text-gray-800 mb-4">
                <strong>Link:</strong>
                <a href={news.link} target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:underline">{news.link}</a>
            </Paragraph>

            {/* Hình ảnh bài viết */}
            {news.image && (
                <div className="mb-4">
                    <img src={news.image} alt="Blog Image" className="w-full h-auto rounded-xl shadow-lg"/>
                </div>
            )}

            {/* Thể loại bài viết */}
            <Paragraph className="text-gray-800 mb-4"><strong>Thể loại:</strong></Paragraph>
            <div className="flex flex-wrap gap-2 mb-4">
                {/* Check if category is an object (single category) or an array (multiple categories) */}
                {news.category ? (
                    // If a single category exists, render it
                    <span key={news.category.id}
                          className="bg-indigo-500 text-white py-1 px-3 rounded-full text-sm">
            {news.category.name}
        </span>
                ) : (
                    <span>No categories available</span> // Fallback message when no category exists
                )}
            </div>


            {/* Thông tin tác giả */}
            <Divider/>
            <div className="flex items-center mt-4">
                {news.user.profile_image && (
                    <img src={news.user.profile_image} alt="Profile"
                         className="w-16 h-16 rounded-full object-cover mr-4"/>
                )}
                <div>
                    <Paragraph className="text-gray-800 mb-1">
                        <strong>Tác
                            giả:</strong> {`${news.user.first_name} ${news.user.last_name} (${news.user.username})`}
                    </Paragraph>
                    <Paragraph className="text-gray-600 mb-1">
                        <strong>Email:</strong> {news.user.email}
                    </Paragraph>
                    {news.user.phone_number && (
                        <Paragraph className="text-gray-600 mb-1">
                            <strong>Số điện thoại:</strong> {news.user.phone_number}
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

export default DocsDetailsModal;
