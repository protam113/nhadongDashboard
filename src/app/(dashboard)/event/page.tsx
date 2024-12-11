"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa"; // Import refresh icon

import { EventList } from "@/lib/eventList";
import Heading from "@/components/design/Heading";
import EventQueueTable from "@/components/table/EventQueueTable";

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [category] = useState<string>(""); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data

  // Pass model into CategoriesList
  const { queueData, isLoading, isError } = EventList(
    currentPage,
    category,
    refreshKey
  );

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
  ];

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Error loading queue data.</div>;

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  return (
    <>
      <div className="p-4">
        <Heading name="Quản lý danh sách Event & Ơn Gọi  " />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
            <FaSync /> Làm mới
          </Button>
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
        <EventQueueTable PostModel="event" />
      </div>
    </>
  );
};

export default Page;
