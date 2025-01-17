"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Modal, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import EventQueueTable from "@/components/table/EventQueueTable";
import { DonateList } from "@/lib/donateList";
import { MdOutlineDelete, FaRegEdit, FaSync } from "@/lib/iconLib";
import PushButton from "@/components/Button/PushButton";
import DonationDetailDrawer from "@/components/drawer/DonationDetailDrawer";
import {
  useDeleteDonation,
  useEditDonation,
} from "@/hooks/donation/useDonation";
import EditDonationModal from "./drawer/EditDonation";
import { SpinLoading, Error, Heading } from "@/components/design/index";
import { useUser } from "@/context/userProvider";
import Pagination from "@/components/Pagination";

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibility] = useState<string>("show"); // State to hold selected model
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null); // State for selected blog
  const { mutate } = useDeleteDonation();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>(""); // State to hold the selected event ID
  const { mutate: updateDonation } = useEditDonation();
  const [loading, setLoading] = useState(false); // Thêm state loading
  const { userInfo } = useUser() || {}; // Provide a default empty object if useUser returns null

  // Pass model into CategoriesList
  const {
    queueData,
    next,
    isLoading,
    isError,
    count = 0,
  } = DonateList(currentPage, visibility, refreshKey);

  const handleEdit = (blog: any) => {
    setSelectedBlog(blog); // Set blog to be edited
    setIsDrawerVisible(true); // Open the drawer
    setLoading(false);
  };

  const handleSelectDonation = (postId: string) => {
    setSelectedPostId(postId); // Lưu postId khi người dùng chọn sự kiện
  };

  const handleDelete = (categoryId: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thể loại này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        mutate(categoryId);
      },
    });
  };

  const totalPages = next ? currentPage + 1 : currentPage;

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
      dataIndex: "visibility",
      key: "visibility",
      width: 400,
      render: (text, record) => (
        <Select
          defaultValue={text}
          onChange={(newStatus) => {
            // Send the full object with only status updated
            const updatedEvent = {
              ...record, // Get all properties of the event
              visibility: newStatus, // Update only the status
            };
            updateDonation({
              editDonation: updatedEvent,
              blogId: selectedPostId,
            }); // Send the full event object to the mutate function
            handleSelectDonation(record.id); // Now handleSelectEvent is called here
          }}
          options={[
            { value: "show", label: "Mở" },
            { value: "hide", label: "Đóng" },
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
          <Button type="primary" onClick={() => handleEdit(record)}>
            <FaRegEdit />
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) {
    return <SpinLoading />;
  }
  if (isError) {
    return <Error />;
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedBlog(null);
    setIsDrawerVisible(false); // Close the drawer
  };

  const handleViewDetails = (blog: any) => {
    setSelectedBlog(blog);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="p-4">
        <Heading name="Quản lý danh sách tin quyên góp" />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
            <FaSync /> Làm mới
          </Button>
          <PushButton
            href="/bac_ai_xa_hoi/donation/create_donation"
            label={"Tạo Tin Quyên Góp"}
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
        {count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        {userInfo?.role.name === "admin" ? (
          <>
            <EventQueueTable PostModel="donation" />
          </>
        ) : null}
      </div>

      <DonationDetailDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        blog={selectedBlog}
      />
      <EditDonationModal
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        blog={selectedBlog}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};

export default Page;
