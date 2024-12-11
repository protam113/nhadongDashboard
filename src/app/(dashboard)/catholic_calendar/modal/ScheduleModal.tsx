"use client";

import React, { useState } from "react";
import { Drawer, Button } from "antd";
import { FeastDrawerProps } from "@/types/types";
import CreateSchedule from "./createSchedule";

const FeastDrawer: React.FC<FeastDrawerProps> = ({
  visible,
  onClose,
  scheduleId,
  selectedDate,
  selectedFeast,
}) => {
  const [isCreateScheduleDrawerVisible, setIsCreateScheduleDrawerVisible] =
    useState(false);

  // Open the CreateSchedule drawer
  const handleCreateScheduleClick = () => {
    setIsCreateScheduleDrawerVisible(true); // Open CreateSchedule drawer
  };

  // Close the CreateSchedule drawer
  const handleCreateScheduleClose = () => {
    setIsCreateScheduleDrawerVisible(false); // Close CreateSchedule drawer
  };

  return (
    <>
      {/* Main FeastDrawer showing feast details */}
      <Drawer
        title="Thông tin ngày"
        placement="right"
        onClose={onClose}
        open={visible}
        width={400}
      >
        {selectedDate && (
          <div>
            <p>
              <strong>Ngày:</strong> {selectedDate}
            </p>
            {selectedFeast ? (
              <div>
                <p>
                  <strong>Tên lễ:</strong> {selectedFeast.feast_name}
                </p>
                <p>
                  <strong>Loại lễ:</strong> {selectedFeast.feast_type}
                </p>
                <p>
                  <strong>Mô tả:</strong>{" "}
                  {selectedFeast.description || "Không có"}
                </p>
              </div>
            ) : (
              <p>Không có lễ trong ngày này.</p>
            )}
          </div>
        )}

        {/* Button to trigger opening the CreateSchedule drawer */}
        <Button
          type="primary"
          onClick={handleCreateScheduleClick}
          style={{ marginTop: 16 }}
        >
          Tạo Lễ
        </Button>
      </Drawer>

      {/* CreateSchedule drawer for creating new schedule */}
      <Drawer
        title="Tạo Lễ"
        placement="right"
        onClose={handleCreateScheduleClose}
        open={isCreateScheduleDrawerVisible}
        width={400}
      >
        <CreateSchedule scheduleId={scheduleId} />
      </Drawer>
    </>
  );
};

export default FeastDrawer;
