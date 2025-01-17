"use client";

import { useBanner } from "@/hooks/banner/useBanner";



// BlogList.ts

export const BannerList = (currentPage: number, model: string ,refreshKey: number) => {

    const filters = model.trim() === "" ? {} : { model };

    const { data, isLoading, isError } = useBanner(currentPage,
        filters // Use the category chosen by the news
        ,refreshKey);

    
    const queueData = data?.results || [];

    const latestPost = queueData[0];
    const otherPosts = queueData.slice(1, 4);

    return { 
        queueData,
        next:data?.next,
        count: data?.count,
        latestPost,
        otherPosts,
        isLoading, 
        isError };
};
