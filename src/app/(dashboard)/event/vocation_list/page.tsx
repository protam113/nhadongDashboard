"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Spin, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa"; // Import refresh icon
import { EventList } from "@/lib/eventList";
import Heading from "@/components/design/Heading";
import PushButton from "@/components/Button/PushButton";
import { useUpdateEvent } from "@/hooks/event/useEventDetail";

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category] = useState<string>("vocation"); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [selectedPostId, setSelectedPostId] = useState<string>(""); // State to hold the selected event ID
  const { mutate } = useUpdateEvent(selectedPostId);

  // Pass model into CategoriesList
  const { queueData, isLoading, isError } = EventList(
    currentPage,
    category,
    refreshKey
  );

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
            onRow={(record) => ({
              onClick: () => {
                window.location.href = `/event/vocation_list/${record.id}`;
              },
            })}
          />
        </div>
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span style={{ margin: "0 8px" }}>Page {currentPage}</span>
          <Button onClick={() => setCurrentPage((prev) => prev + 1)}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Page;
