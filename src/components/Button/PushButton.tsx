// components/PushButton.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import { PushButtonProps } from "@/types/types";

const PushButton: React.FC<PushButtonProps> = ({ href, label }) => {
    const router = useRouter();

    const handlePush = () => {
        router.push(href); // Chuyển hướng đến trang chỉ định
    };

    return (
        <button
            onClick={handlePush}
            className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
            <span>{label}</span>
            <FaArrowRight />
        </button>
    );
};

export default PushButton;
