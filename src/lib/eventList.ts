
"use client"; // Đảm bảo đây là client component


// eventList.ts

import {useEventList} from "@/hooks/event/useEvent";

export const EventList = (currentPage: number, category: string, refreshKey: number) => {
    const { data, isLoading, isError } = useEventList(currentPage,
        {category: [category],} // Use the model chosen by the user
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