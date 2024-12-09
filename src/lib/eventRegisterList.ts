
"use client";
import { useEventRegisterList } from "@/hooks/event/useEventRegistion";

 // Đảm bảo đây là client component


// eventList.ts


export const EventRegisterList = (currentPage: number, refreshKey: number,postId:string) => {
    const { data, isLoading, isError } = useEventRegisterList(postId,currentPage,
        refreshKey);

    const queueData = data?.results || [];

    return { 
        queueData,
        next:data?.next,
        count: data?.count,
        isLoading, 
        isError 
    };
    }