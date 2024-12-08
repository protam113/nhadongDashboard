"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync } from "react-icons/fa"; // Import refresh icon
// import { EyeOutlined } from "@ant-design/icons";
import Heading from "@/components/design/Heading";
import { Post } from "@/types/types";
import { useEventRegisterList } from "@/hooks/event/useEventRegistion";
// import EventRegisterDetail from "../drawer/EventRegisterDetail";

const EventRegisterListTable: React.FC<Post> = ({ postId }) => {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  //   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //   const [selectedMember, setSelectedMember] = useState(null);

  // Pass model into CategoriesList
  const { data, isLoading, isError } = useEventRegisterList(
    postId,
    currentPage,
    refreshKey
  );
  const queueData = data?.results || [];

  //   const handleViewDetails = (member: any) => {
  //     setSelectedMember(member);
  //     setIsDrawerOpen(true);
  //   };

  //   const handleDrawerClose = () => {
  //     setIsDrawerOpen(false);
  //     setSelectedMember(null);
  //   };

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (_, __, index) => <span>{index + 1}</span>, // index + 1
    },
    // {
    //   title: "Chi Tiết",
    //   dataIndex: "full",
    //   key: "full",
    //   width: 150,
    //   render: (_, record) => (
    //     <Button onClick={() => handleViewDetails(record)}>
    //       <EyeOutlined /> Xem Chi Tiết
    //     </Button>
    //   ),
    // },
    {
      title: "Họ Và Tên",
      children: [
        {
          title: "Họ và Tên đệm",
          dataIndex: ["fields_data", "first_name", "value"], // Access nested fields
          key: "first_name",
          width: 150,
          render: (value) => <span>{value}</span>,
        },
        {
          title: "Tên",
          dataIndex: ["fields_data", "last_name", "value"], // Access nested fields
          key: "last_name",
          width: 150,
          render: (value) => <span>{value}</span>,
        },
      ],
    },
    {
      title: "Số Điện Thoại",
      dataIndex: ["fields_data", "phone_number", "value"], // Access nested fields
      key: "phone_number",
      width: 250,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: ["fields_data", "email", "value"], // Access nested fields
      key: "email",
      width: 150,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: () => (
        // _: any, record: any
        <>
          <p> delete</p>
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
        <Heading name="Danh sách người dùng trong group " />

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
            rowSelection={{
              selectedRowKeys: selectedKeys,
              onChange: (selectedRowKeys) =>
                setSelectedKeys(selectedRowKeys as number[]),
            }}
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

      {/* <EventRegisterDetail
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        member={selectedMember}
      /> */}
    </>
  );
};

export default EventRegisterListTable;
