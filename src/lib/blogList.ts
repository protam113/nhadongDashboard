"use client"; // Đảm bảo đây là client component


// categoriesList.ts
import {useBlogList} from "@/hooks/blog/useBlog";

export const BlogList = (currentPage: number, model: string, refreshKey: number) => {
    const { data, isLoading, isError } = useBlogList(currentPage,
        {model: [],} // Use the model chosen by the user
    ,refreshKey);


    const queueData = data?.results || [];

    return { queueData, isLoading, isError };
};
