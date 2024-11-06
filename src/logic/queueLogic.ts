import { useQueueList, useBrowseQueue } from '@/hooks/queue/useQueue';

interface BrowseQueueResponse {
    data: any;  // Thay thế `any` bằng kiểu cụ thể nếu biết rõ kiểu dữ liệu trả về
    success: boolean;
}

export const useQueueManagement = (currentPage: number, type: string, refreshKey: number) => {
    const { data, isLoading, isError } = useQueueList(currentPage, {
        type: [type],
        status: [""],
        action: [""]
    }, refreshKey);

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

        console.log("browseManager:", browseManager);

        console.log("handleBulkUpdate - browseManager:", browseManager);

        browseQueue(browseManager, {
            onSuccess: (response: BrowseQueueResponse) => {
                console.log("Response from browseQueue:", response);  // Log phản hồi từ browseQueue
            },
            onError: (error: any) => {
                console.error("Error in browseQueue:", error);  // Log lỗi nếu có
            }
        });
    };

    const handleStatusChange = (value: string, id: number) => {
        const browseManager = {
            id: [id],
            status: value,
        };
        browseQueue(browseManager);
    };

    return { queueData, isLoading, isError, handleBulkUpdate, handleStatusChange };
};