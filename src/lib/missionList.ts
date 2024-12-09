
"use client"; // Đảm bảo đây là client component


// MissionList.ts


import { useMissionList } from "@/hooks/mission/useMission";

export const MissionList = (currentPage: number, model: string, refreshKey: number) => {
    const { data, isLoading, isError } = useMissionList(currentPage,
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