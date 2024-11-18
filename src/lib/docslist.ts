
"use client"; // Đảm bảo đây là client component


// categoriesList.ts


import {useDocsList} from "@/hooks/document/useDocs";

export const DocsList = (currentPage: number, model: string, refreshKey: number) => {
    const { data, isLoading, isError } = useDocsList(currentPage,
        {model: [],} // Use the model chosen by the user
        ,refreshKey);


    const queueData = data?.results || [];

    return { queueData, isLoading, isError };
};
