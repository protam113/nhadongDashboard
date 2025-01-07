
"use client"; // Đảm bảo đây là client component


import { useMessageList } from "@/hooks/message/useMessage";
// MissionList.ts

export const MessageList = (currentPage: number, model: string, refreshKey: number) => {
    const { data, isLoading, isError } = useMessageList(currentPage,
        {category: [model],} // Use the model chosen by the user
        ,refreshKey);


    const queueData = data?.results || [];

    return { 
        queueData,
        next:data?.next,
        count: data?.count,
        isLoading, 
        isError 
    };
    }