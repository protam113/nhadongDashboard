'use client';


// ChatInput.tsx
import React from "react";

interface ChatInputProps {
    userInput: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ userInput, handleInputChange, handleSendMessage }) => {
    return (
        <div className="flex items-center p-4 border-t bg-gray-50">
            <input
                type="text"
                value={userInput}
                onChange={handleInputChange} // Cập nhật giá trị người dùng nhập
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
                onClick={handleSendMessage} // Gọi hàm gửi tin nhắn
                className="ml-4 bg-primary-500 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg"
            >
                Gửi
            </button>
        </div>
    );
};

export default ChatInput;
