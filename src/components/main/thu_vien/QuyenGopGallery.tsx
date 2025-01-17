"use client";

import React, { useState } from "react";
import { Image, Spin } from "antd";
import { FaArrowLeft, FaArrowRight } from "@/lib/iconLib";
import { GaleryList } from "@/lib/galeryList";

const QuyenGopGallery = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { queueData, next, isLoading, isError } = GaleryList(
    currentPage,
    "donation",
    0
  );
  const totalPages = next ? currentPage + 1 : currentPage;

  if (isError) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-gray-800 px-6 py-4 max-w-md text-center">
          <h2 className="text-lg font-semibold mb-2">Oops, có lỗi xảy ra!</h2>
          <p className="text-sm mb-4">
            Chúng tôi không thể lấy dữ liệu hình ảnh ngay bây giờ. Vui lòng thử
            lại sau.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="text-center justify-center mt-2">
        <Spin />
      </div>
    );
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  pt-5">
        {queueData.map((queueData, index) => (
          <div key={index} className="relative w-full h-full">
            <Image
              alt={`Image ${index + 1}`}
              src={queueData.image} // Sử dụng src trực tiếp
              width={380} // Đặt kích thước chiều rộng
              height={200} // Đặt kích thước chiều cao
              className="object-cover" // Đảm bảo hình ảnh được cắt tỉa đúng tỷ lệ
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8 items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-6 h-6 text-10 bg-gray-200 rounded-full hover:bg-gray-300 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaArrowLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-6 h-6 text-10 rounded-full hover:bg-gray-300 ${
              currentPage === i + 1
                ? "bg-primary-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={!next}
          className={`flex items-center justify-center w-6 h-6 text-10 bg-gray-200 rounded-full hover:bg-gray-300 ${
            !next ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default QuyenGopGallery;
