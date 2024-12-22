"use client";

import { useDonationList } from "@/hooks/donation/useDonation";


// NewsList.ts

export const DonateList = (currentPage: number, visibility: string, refreshKey: number) => {

    const filters = visibility.trim() === "" ? {} : { visibility };

    const { data, isLoading, isError } = useDonationList(currentPage,
        filters // Use the category chosen by the news
        , refreshKey);


    const queueData = data?.results || [];

    return {
        queueData, isLoading, isError, next: data?.next,
        count: data?.count,
    };
};