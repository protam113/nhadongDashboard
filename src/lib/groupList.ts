
"use client"; // Đảm bảo đây là client component


// categoriesList.ts


import {useGroupList} from "@/hooks/group/useGroup";

export const GroupList = (currentPage: number, model: string, refreshKey: number) => {
    const { data, isLoading, isError } = useGroupList(currentPage,
        {model: [],} // Use the model chosen by the user
        ,refreshKey);


    const queueData = data?.results || [];

    return { queueData, isLoading, isError };
};
