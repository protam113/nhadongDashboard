'use client';


import Image from "next/image";

const user = {
    admin: {
        count: async () => 10, // Số lượng admin
    },
    manager: {
        count: async () => 20, // Số lượng manager
    },
    user: {
        count: async () => 100, // Số lượng user
    },
    parent: {
        count: async () => 50, // Số lượng all
    },
};

const UserCard = async ({
                            type,
                        }: {
    type: "admin" | "manager" | "user" | "parent";
}) => {
    const modelMap: Record<typeof type, any> = {
        admin: user.admin,
        manager: user.manager,
        user: user.user,
        parent: user.parent,
    };

    const data = await modelMap[type].count();

    return (
        <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
                    2024/25
                </span>
                <Image src="/more.png" alt="More options" width={20} height={20} />
            </div>
            <h1 className="text-2xl font-semibold my-4">{data}</h1>
            <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
        </div>
    );
};

export default UserCard;
