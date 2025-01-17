"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Spin, Select, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EventList } from "@/lib/eventList";
import Heading from "@/components/design/Heading";
import PushButton from "@/components/Button/PushButton";
import { useUpdateEvent } from "@/hooks/event/useEventDetail";
import { FaSync } from "@/lib/iconLib";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation"; // Import useRouter
import { useDeleteEvent } from "@/hooks/event/useEvent";
import { MdOutlineDelete } from "react-icons/md";
import Pagination from "@/components/Pagination";

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>(""); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [selectedPostId, setSelectedPostId] = useState<string>(""); // State to hold the selected event ID
  const { mutate } = useUpdateEvent(selectedPostId);
  const router = useRouter(); // Khởi tạo useRouter
  const { mutate: deleteEvent } = useDeleteEvent();

  // Pass model into CategoriesList
  const {
    queueData,
    next,
    isLoading,
    isError,
    count = 0,
  } = EventList(currentPage, status, refreshKey);
  const totalPages = next ? currentPage + 1 : currentPage;

  const handleDelete = (eventId: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sự kiện này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteEvent(eventId);
      },
    });
  };

  const handleViewDetails = (record: any) => {
    router.push(`/bac_ai_xa_hoi/event_list/${record.id}`); // Chuyển hướng đến URL với ID
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }
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
          <div className="flex items-center space-x-4">
            <span>Lọc trạng thái:</span>
            <Select
              defaultValue=""
              style={{ width: 150 }}
              onChange={(value) => {
                setStatus(value); // Cập nhật trạng thái
                setCurrentPage(1); // Reset về trang đầu
              }}
              options={[
                { value: "", label: "Tất cả" },
                { value: "open", label: "Open" },
                { value: "close", label: "Close" },
              ]}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
              <FaSync /> Làm mới
            </Button>
            <PushButton
              href="/bac_ai_xa_hoi/event_list/create_event"
              label={"Tạo Sự Kiện"}
            />
          </div>
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
        {count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default Page;
