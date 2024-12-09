"use client"; // Đảm bảo đây là client component


// queueLogic.ts
import {useActiveUser, useUserList} from "@/hooks/user/useUsers";
import { message } from "antd";


export const UserList = (currentPage: number,is_active: string,blocked: string
                          , refreshKey: number
) => {
    const { data, isLoading, isError, isFetching } = useUserList(currentPage, {
        is_active: [is_active],
        blocked: [blocked]
    },refreshKey);
    const queueData = data?.results || [];
    const { mutate: activeUser } = useActiveUser();

    const handleActiveUser = (selectedKeys: number[], status: string) => {
        if (selectedKeys.length === 0) {
            console.warn(`No items selected for ${status}.`);
            return;
        }

        const browseManager = {
            id: selectedKeys,
            status: status,
        };
        activeUser(browseManager, {
            onSuccess: () => {
                message.success("User status updated successfully!"); // Thông báo sau khi thành công
            },            
            onError: (error: any) => {
                console.error("Error in browseQueue:", error);  // Log lỗi nếu có
            }
        });
    };


    return { queueData
        , isLoading
        , isError
        , isFetching
        , handleActiveUser
        ,next:data?.next,
    };
};
