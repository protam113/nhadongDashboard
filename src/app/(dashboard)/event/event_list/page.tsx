"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Spin, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EventList } from "@/lib/eventList";
import Heading from "@/components/design/Heading";
import PushButton from "@/components/Button/PushButton";
import { useUpdateEvent } from "@/hooks/event/useEventDetail";
import { FaArrowLeft, FaArrowRight, FaSync } from "@/lib/iconLib";

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category] = useState<string>("event"); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [selectedPostId, setSelectedPostId] = useState<string>(""); // State to hold the selected event ID
  const { mutate } = useUpdateEvent(selectedPostId);

  // Pass model into CategoriesList
  const { queueData, next, isLoading, isError } = EventList(
    currentPage,
    category,
    refreshKey
  );
  const totalPages = next ? currentPage + 1 : currentPage;

  const handleSelectEvent = (postId: string) => {
    setSelectedPostId(postId); // Lưu postId khi người dùng chọn sự kiện
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
      width: 400,
      render: (text, record) => (
        <Select
          defaultValue={text}
          onChange={(newStatus) => {
            // Send the full object with only status updated
            const updatedEvent = {
              ...record, // Get all properties of the event
              status: newStatus, // Update only the status
            };
            mutate(updatedEvent); // Send the full event object to the mutate function
            handleSelectEvent(record.id); // Now handleSelectEvent is called here
          }}
          options={[
            { value: "open", label: "Open" },
            { value: "close", label: "Close" },
          ]}
        />
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
        <Heading name="Quản lý danh sách Event  " />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
            <FaSync /> Làm mới
          </Button>
          <PushButton
            href="/event/event_list/create_event"
            label={"Tạo Sự Kiện"}
          />
        </div>

        <div className="overflow-auto" style={{ maxHeight: "800px" }}>
          <Table
            columns={columns}
            dataSource={queueData}
            rowKey="id"
            pagination={false}
            scroll={{ y: 500 }}
            onRow={(record) => ({
              onClick: () => {
                window.location.href = `/event/event_list/${record.id}`;
              },
            })}
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
