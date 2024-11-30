
"use client"; // Đảm bảo đây là client component


// categoriesList.ts



import {useGroupMember} from "@/hooks/group/useGroupMember";

export const GroupMemberList = (currentPage: number,groupId:string, refreshKey: number) => {
    const { data, isLoading, isError } = useGroupMember(
        currentPage,
        refreshKey, // Xóa dấu phẩy dư
        groupId
    );

    const queueData = data?.results || [];

    return { queueData, isLoading, isError };
};
