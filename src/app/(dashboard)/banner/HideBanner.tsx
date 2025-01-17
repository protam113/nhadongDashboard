"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { Table, Button, Modal, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaSync, FaRegEdit, MdOutlineDelete } from "@/lib/iconLib";
import { SpinLoading, Error } from "@/components/design/index";
import { useBanner, useDeleteBanner } from "@/hooks/banner/useBanner";
import EditBannerDraw from "./Editbanner";

interface Banner {
  id: string;
  image: string;
  visibility: string;
}

const HideBanner: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [visibility] = useState<string>("hide"); // Default value of "show"

  // Set filters based on visibility
  const filters = visibility.trim() === "" ? {} : { visibility };

  // Pass model into CategoriesList
  const { data, isLoading, isError } = useBanner(filters, refreshKey);

  const queueData: Banner[] = Array.isArray(data) ? data : [];
  console.log("🚀 ~ queueData:", queueData);

  const { mutate } = useDeleteBanner();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // For editing category
  const [editingBanner, setEditingBanner] = useState(null);

  const handleDelete = (bannerId: string) => {
    // Show confirmation dialog before deletion
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa banner này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        mutate(bannerId);
      },
    });
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false); // Hide the edit category modal
    setEditingBanner(null); // Reset editing category
  };

  const handleEdit = (editBanner: any) => {
    if (!editBanner.id) {
      console.error("ID thể loại không hợp lệ!");
      return;
    }
    setEditingBanner(editBanner);
    setIsEditModalVisible(true); // Mở modal chỉnh sửa
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
      title: "Banner",
      dataIndex: "image",
      key: "image",
      width: 400,
      render: (text, index) => (
        <Image
          alt={`Image ${index + 1}`}
          src={text} // Sử dụng dữ liệu từ dataIndex "image"
          width={600} // Chiều rộng
          height={300} // Chiều cao
          className="object-cover" // Đảm bảo tỷ lệ cắt hình ảnh
        />
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "visibility",
      key: "visibility",
      width: 400,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)}>
            <FaRegEdit />
          </Button>

          <Button danger onClick={() => handleDelete(record.id)}>
            <MdOutlineDelete className="text-albert-error" />
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <SpinLoading />;
  if (isError) return <Error />;

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  return (
    <>
      <div className="p-4">
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
      </div>
      <Modal
        title="Sửa Banner"
        visible={isEditModalVisible}
        onCancel={handleCancelEditModal}
        footer={null}
        width={600}
      >
        <EditBannerDraw banner={editingBanner} />{" "}
        {/* Hiển thị thông tin thể loại */}
      </Modal>
    </>
  );
};

export default HideBanner;
