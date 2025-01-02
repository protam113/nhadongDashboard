"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Spin, Select, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EventList } from "@/lib/eventList";
import Heading from "@/components/design/Heading";
import PushButton from "@/components/Button/PushButton";
import { useUpdateEvent } from "@/hooks/event/useEventDetail";
import { FaArrowLeft, FaArrowRight, FaSync } from "@/lib/iconLib";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useDeleteEvent } from "@/hooks/event/useEvent";
import { MdOutlineDelete } from "react-icons/md";

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category] = useState<string>("vocation");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const { mutate } = useUpdateEvent(selectedPostId);
  const router = useRouter();
  const { mutate: deleteEvent } = useDeleteEvent();

  // Pass model into CategoriesList
  const { queueData, next, isLoading, isError } = EventList(
    currentPage,
    category,
    refreshKey
  );

  const handleDelete = (eventId: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa ơn gọi này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteEvent(eventId);
      },
    });
  };

  const totalPages = next ? currentPage + 1 : currentPage;

  const handleSelectEvent = (postId: string) => {
    setSelectedPostId(postId);
  };
  const handleViewDetails = (record: any) => {
    router.push(`/event/vocation_list/${record.id}`);
  };

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Chi Tiết",
      dataIndex: "full",
      key: "full",
      width: 150,
      render: (_, record) => (
        <Button onClick={() => handleViewDetails(record)}>
          <EyeOutlined /> Xem Chi Tiết
        </Button>
      ),
    },
    {
      title: "Tiêu Đề",
      dataIndex: "title",
      key: "title",
      width: 400,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 300,
      render: (text, record) => (
        <Select
          defaultValue={text}
          onChange={(newStatus) => {
            const updatedEvent = {
              ...record,
              status: newStatus,
            };
            mutate(updatedEvent);
            handleSelectEvent(record.id);
          }}
          options={[
            { value: "open", label: "Open" },
            { value: "close", label: "Close" },
          ]}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <>
          <Button danger onClick={() => handleDelete(record.id)}>
            <MdOutlineDelete className="text-albert-error" />
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Error loading queue data.</div>;

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  return (
    <>
      <div className="p-4">
        <Heading name="Quản lý danh sách Ơn Gọi  " />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
            <FaSync /> Làm mới
          </Button>
          <PushButton
            href="/event/vocation_list/create_vocation"
            label={"Tạo Ơn Gọi"}
          />
        </div>

        <div className="overflow-auto" style={{ maxHeight: "800px" }}>
          <Table
            columns={columns}
            dataSource={queueData}
            rowKey="id"
            pagination={false}
            scroll={{ y: 500 }}
          />
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
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
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
    </>
  );
};

export default Page;
