"use client"; // Đảm bảo đây là client component

// categoriesList.ts
import {useCateogiesList} from "@/hooks/cateogry/useCategories";

export const CategoriesList = (currentPage: number, model: string, refreshKey: number) => {
    const { data, isLoading, isError } = useCateogiesList(currentPage, {
        model: [model], // Use the model chosen by the user
    },refreshKey);


    const queueData = data?.results || [];

    return { 
        queueData,
        next:data?.next,
        count: data?.count,
        isLoading, 
        isError 
    };
    }

