"use client";

import VideoGallery from "@/components/design/VideoList";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import CreateVideoCategory from "./CreateVideo";
import { Heading } from "@/components/design";

const Page = () => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // For creating category
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

  const handleLoadingChange = (isLoading: boolean) => {
    setIsCreateLoading(isLoading);
  };

  const handleCancelCreateModal = () => {
    setIsCreateModalVisible(false); // Hide the create category modal
  };

  const handleCreate = () => {
    setIsCreateModalVisible(true); // Show the modal when "Create Category" is clicked
  };

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Heading name="Danh sách Video" />
          <Button
            type="primary"
            onClick={handleCreate}
            loading={isCreateLoading}
          >
            Thêm Video{" "}
          </Button>
        </div>
        <div>
          <VideoGallery />
        </div>
      </div>

      <Modal
        title="Thêm Vieo"
        visible={isCreateModalVisible}
        onCancel={handleCancelCreateModal}
        footer={null}
        width={600}
      >
        <CreateVideoCategory onLoadingChange={handleLoadingChange} />
      </Modal>
    </>
  );
};

export default Page;
