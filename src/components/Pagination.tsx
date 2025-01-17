import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: any;
}) => {
  return (
    <div className="flex justify-center mt-8 items-center space-x-2">
      {/* Nút Previous */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-6 h-6 text-10 bg-gray-200 rounded-full hover:bg-gray-300 ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FaArrowLeft />
      </button>

      {/* Nút phân trang */}
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`w-6 h-6 text-10 rounded-full hover:bg-gray-300 ${
            currentPage === i + 1 ? "bg-primary-500 text-white" : "bg-gray-200"
          }`}
        >
          {i + 1}
        </button>
      ))}

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`flex items-center justify-center w-6 h-6 text-10 bg-gray-200 rounded-full hover:bg-gray-300 ${
          currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
