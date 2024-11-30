"use client"; // Đảm bảo đây là client component


// RoleList.ts

import {useRoleList} from "@/hooks/role/useRole";


export const RoleList = (currentPage: number
) => {
    const {
        data,
        isLoading,
        isError,
    } = useRoleList(currentPage);


    // Chuyển đổi dữ liệu thành định dạng cho Table
    const roles = data?.results || [];


    return { roles
        , isLoading
        , isError
    };
};
