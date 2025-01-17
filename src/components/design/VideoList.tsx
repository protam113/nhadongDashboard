"use client";

import React, { useState } from "react";
import { useDeleteVideo, useVideoList } from "@/hooks/video/useVideo";
import Image from "next/image";
import { Modal, Button, Spin } from "antd";
import { FaRegEdit, FaTrashAlt } from "@/lib/iconLib";
import EditVideo from "@/app/(dashboard)/thu_vien_video/EditVideo";

const VideoGallery = () => {
  const [currentPage] = useState(1);
  const { data, isLoading, isError } = useVideoList(currentPage, 0);
  const queueData = data?.data || [];
  const { mutate } = useDeleteVideo();

  const handleDelete = (videoID: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa video này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        mutate(videoID);
      },
    });
  };

  const [editingVideo, setEditingVideo] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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
      <div className="text-center">
        <Spin />
      </div>
    );

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false);
    setEditingVideo(null);
  };

  const handleEdit = (video: any) => {
    if (!video.id) {
      console.error("ID video không hợp lệ!");
      return;
    }
    setEditingVideo(video);
    setIsEditModalVisible(true);
  };

  return (
    <>
      <div>
        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {queueData.map((video, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Phần hình ảnh */}
              <div className="relative">
                <Image
                  alt={`Image ${index + 1}`}
                  src={video.image}
                  width={410}
                  height={230}
                  className="object-cover w-full h-56"
                />
                <div className="absolute inset-0 flex justify-center items-center">
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-all duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 3l14 9-14 9V3z"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Phần nội dung */}
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {video.content}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {video.create_date}
                </p>
                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-semibold hover:bg-primary-600 transition duration-300"
                >
                  Xem Thêm
                </a>
              </div>

              {/* Các nút chức năng */}
              <div className="flex justify-between items-center p-4 border-t">
                <Button
                  onClick={() => handleEdit(video)}
                  className="text-sm text-primary-500 hover:text-primary-600 flex items-center"
                >
                  <FaRegEdit className="mr-2" /> Sửa
                </Button>
                <Button
                  onClick={() => handleDelete(video.id)}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center"
                >
                  <FaTrashAlt className="mr-2" /> Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title="Sửa Video"
        visible={isEditModalVisible}
        onCancel={handleCancelEditModal}
        footer={null}
        width={600}
      >
        <EditVideo video={editingVideo} />
      </Modal>
    </>
  );
};

export default VideoGallery;
