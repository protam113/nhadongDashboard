'use client';

// Page.tsx
import React, { useState, useEffect } from 'react';
import ChatSidebar from "@/components/main/chatAI/chatSidebar";
import { useChat, useChatList } from "@/hooks/chat/useChatAI";
import ChatInput from "@/components/main/chatAI/ChatInput";
import ChatFont from "@/components/main/chatAI/chatFont";

const Page = () => {
    const [chatView, setChatView] = useState(false); // Xác định chế độ hiển thị
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const { data, isLoading, isError } = useChatList(refreshKey);
    const { mutate } = useChat();
    const [userInput, setUserInput] = useState(''); // Nội dung nhập từ người dùng
    const [chatHistory, setChatHistory] = useState<
        { message: string; sender: string }[]
    >([]);

    // Đồng bộ dữ liệu từ API vào chatHistory
    useEffect(() => {
        if (data && Array.isArray(data) && !isLoading && !isError) {
            const formattedData = data
                .map((item: { content: string; response: string }) => [
                    { message: item.content, sender: 'user' },
                    { message: item.response, sender: 'system' },
                ])
                .flat();
            setChatHistory(formattedData);
        }
    }, [data, isLoading, isError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSendMessage = () => {
        if (userInput.trim()) {
            // Thêm câu hỏi của người dùng vào lịch sử chat
            setChatHistory((prev) => [
                ...prev,
                { message: userInput, sender: 'user' },
            ]);
            setUserInput(''); // Xóa nội dung input sau khi gửi

            // Gửi tin nhắn tới API
            mutate({ content: userInput });
            setChatView(true);
        }
    };

    return (
        <div className="h-[700px] flex">
            {/* Sidebar */}
            <ChatSidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-white px-4">
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                        {isLoading ? (
                            <p className="text-gray-500">Đang tải dữ liệu...</p>
                        ) : isError ? (
                            <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu.</p>
                        ) : chatHistory.length > 0 ? (
                            chatHistory.map((chat, index) => (
                                <div
                                    key={index}
                                    className={`${
                                        chat.sender === 'user'
                                            ? 'flex justify-end text-white bg-blue-500 p-2 rounded-lg max-w-xl text-right ml-auto'
                                            : 'flex justify-start text-black bg-gray-200 p-2 rounded-lg max-w-xl mr-auto'
                                    }`}
                                >
                                    {chat.message}
                                </div>
                            ))
                        ) : (
                            <ChatFont />
                        )}

                    </div>
                </div>

                {/* Input Section */}
                <ChatInput
                    userInput={userInput}
                    handleInputChange={handleInputChange}
                    handleSendMessage={handleSendMessage}
                />
            </main>
        </div>
    );
};

export default Page;
