"use client"; // Đảm bảo đây là client component


// categoriesList.ts
import {useBlogList} from "@/hooks/blog/useBlog";

export const BlogList = (currentPage: number, category: string, refreshKey: number) => {

    const filters = category.trim() === "" ? {} : { category };

    const { data, isLoading, isError } = useBlogList(currentPage,
        filters // Use the model chosen by the user
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
