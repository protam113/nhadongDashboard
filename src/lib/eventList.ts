
"use client"; // Đảm bảo đây là client component


// eventList.ts

import {useEventList} from "@/hooks/event/useEvent";

export const EventList = (currentPage: number, status: string, refreshKey: number) => {

    const filters = status.trim() === "" ? {} : { status };

    const { data, isLoading, isError } = useEventList(currentPage,
        filters// Use the model chosen by the user
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