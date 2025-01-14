
"use client"; // Đảm bảo đây là client component


// eventList.ts

import { useVocationList } from "@/hooks/vocation/useVocation";

export const VocationList = (currentPage: number, status: string, refreshKey: number) => {

    const filters = status.trim() === "" ? {} : { status };

    const { data, isLoading, isError } = useVocationList(currentPage,
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