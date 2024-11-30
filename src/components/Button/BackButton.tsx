// components/BackButton.tsx
import React from 'react';
import { useRouter } from "next/navigation";
import { FaArrowLeft } from 'react-icons/fa'; // Sử dụng icon mũi tên trái

const BackButton: React.FC = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back(); // Quay lại trang trước đó
    };

    return (
        <button
            onClick={handleBack}
            className="flex items-center space-x-2 p-2 bg-primary-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
            <FaArrowLeft /> {/* Icon mũi tên trái */}
            <span>Quay lại</span>
        </button>
    );
};

export default BackButton;
