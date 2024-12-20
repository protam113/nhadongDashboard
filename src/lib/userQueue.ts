"use client"; // Đảm bảo đây là client component


// queueLogic.ts
import { useQueueList, useBrowseQueue } from '@/hooks/queue/useQueue';


export const UserQueue = (currentPage: number,type: string, refreshKey: number) => {
    const { data, isLoading, isError } = useQueueList(currentPage, {
        type:[type],
        status: [""],
        action: [""]
    },refreshKey);
    const queueData = data?.results || [];
    const { mutate: browseQueue } = useBrowseQueue();

    const handleBulkUpdate = (selectedKeys: number[], status: string) => {
        if (selectedKeys.length === 0) {
            console.warn(`No items selected for ${status}.`);
            return;
        }

        const browseManager = {
            id: selectedKeys,
            status: status,
        };

        browseQueue(browseManager);
    };

    


    return { queueData,next:data?.next, isLoading, isError, handleBulkUpdate };
};
