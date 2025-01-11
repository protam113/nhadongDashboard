"use client"; // Đảm bảo đây là client component
import React, { useState } from "react";
import { Table, Spin } from "antd";
import { useUserList } from "@/hooks/user/useUsers";
import { useRoleList } from "@/hooks/role/useRole";
import UserQueueList from "@/app/(dashboard)/user/queueList";
import Heading from "@/components/design/Heading";
import { FaArrowLeft, FaArrowRight } from "@/lib/iconLib";

const Role = () => {
  const [currentPage] = React.useState(1);
  const { data, isLoading, isError, isFetching } = useRoleList(currentPage);

  // Xử lý lỗi
  if (isError) {
    return <div>Error fetching roles</div>;
  }

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return <Spin size="large" />;
  }

  // Chuyển đổi dữ liệu thành định dạng cho Table
  const roles = data?.results || []; // Dùng results trực tiếp từ dữ liệu

  // Cột hiển thị cho Table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_: any, record: any, index: number) => index + 1, // This will display index + 1 as the ID
    },
    { title: "Role", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
  ];

  return (
    <div>
      <Table
        dataSource={roles}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      {isFetching && <Spin size="small" />}{" "}
      {/* Hiển thị loading khi đang tải dữ liệu */}
    </div>
  );
};

const User = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [refreshKey] = useState(0); // State to refresh data
  const { data, isLoading, isError, isFetching } = useUserList(
    currentPage,
    { blocked: ["false"] },
    refreshKey
  ); // Truyền currentPage vào hook

  const next = data?.next;
  const totalPages = next ? currentPage + 1 : currentPage;

  // Xử lý lỗi
  if (isError) {
    return <div>Error fetching users</div>;
  }

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return <Spin size="large" />;
  }

  // Chuyển đổi dữ liệu thành định dạng cho Table
  const users = data?.results || []; // Dùng results trực tiếp từ dữ liệu

  // Cột hiển thị cho Table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_: any, record: any, index: number) => index + 1, // This will display index + 1 as the ID
    },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Họ và Tên Đệm", dataIndex: "first_name", key: "first_name" },
    { title: "Tên", dataIndex: "last_name", key: "last_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số Điẹn Thoại", dataIndex: "phone_number", key: "phone_number" },
  ];

  return (
    <div>
      <Heading name="Role" />
      <Role />
      <Heading name="Quản Lý Người Dùng" />
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
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
      {isFetching && <Spin size="small" />}{" "}
      {/* Hiển thị loading khi đang tải dữ liệu */}
      <div className="mt-4">
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <UserQueueList />
      </div>
    </div>
  );
};

export default User;
