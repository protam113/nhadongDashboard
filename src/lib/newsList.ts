"use client"; // Đảm bảo đây là client component


// categoriesList.ts

import {useNewsList} from "@/hooks/new/useNews";

export const NewsList = (currentPage: number, model: string, refreshKey: number) => {
    const { data, isLoading, isError } = useNewsList(currentPage,
        {model: [],} // Use the model chosen by the user
        ,refreshKey);


    const queueData = data?.results || [];

    return { queueData, isLoading, isError };
};
