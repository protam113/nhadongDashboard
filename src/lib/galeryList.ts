"use client";

import { useGaleryList } from "@/hooks/galery/useGalery";


// BlogList.ts

export const GaleryList = (currentPage: number, model: string ,refreshKey: number) => {

    const filters = model.trim() === "" ? {} : { model };

    const { data, isLoading, isError } = useGaleryList(currentPage,
        filters // Use the category chosen by the news
        ,refreshKey);

    
    const queueData = data?.results || [];

    const latestPost = queueData[0];
    const otherPosts = queueData.slice(1, 4);

    return { 
        queueData,
        next:data?.next,
        latestPost,
        otherPosts,
        isLoading, 
        isError };
};
