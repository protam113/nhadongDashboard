"use client";

import React, { useState } from "react";
import { Calendar, Badge, Button } from "antd";
import type { BadgeProps, CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import { useScheduleList } from "@/hooks/schedule/useSchedule";
import FeastDrawer from "../modal/ScheduleModal";
import { FaSync } from "@/lib/iconLib";

// Màu sắc cho các loại lễ
const feastTypeColors: Record<string, BadgeProps["status"]> = {
  "Lễ trọng": "error",
  "Lễ kính": "warning",
  "Lễ nhớ": "processing",
  "Lễ nhớ tùy ý": "default",
  "Lễ nhớ tùy ý*": "processing",
  " ": "processing",
};

// Sắp xếp loại lễ theo ưu tiên
const feastPriority = [
  "Lễ trọng",
  "Lễ kính",
  "Lễ nhớ",
  "Lễ nhớ tùy ý",
  "Lễ nhớ tùy ý*",
  " ",
];

// Hàm sắp xếp lễ
const sortFeasts = (feasts: any[]) => {
  return feasts.sort(
    (a, b) =>
      feastPriority.indexOf(a.feast_type) - feastPriority.indexOf(b.feast_type)
  );
};

const CatholicCalendarTable: React.FC = () => {
  const [year] = useState<string>(new Date().getFullYear().toString());
  const [refreshKey, setRefreshKey] = useState<number>(0); // State to refresh data
  const [selectedFeast, setSelectedFeast] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [ScheduleId, setScheduleId] = useState<string>(""); // Store the selected schedule ID

  const {
    data: queueData,
    isLoading,
    isError,
  } = useScheduleList({ year: year }, refreshKey);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };
  // Hiển thị lễ theo ngày
  const dateCellRender = (value: Dayjs) => {
    const currentDate = value.format("YYYY-MM-DD");
    const dayData = queueData?.find((item: any) => item.day === currentDate);
    const sortedFeasts = dayData?.feasts ? sortFeasts(dayData.feasts) : [];

    return (
      <div
        onClick={() => {
          setSelectedDate(currentDate); // Lưu ngày được chọn
          setSelectedFeast(sortedFeasts.length ? sortedFeasts[0] : null); // Lưu lễ đầu tiên nếu có
          setScheduleId(dayData?.id || null); // Lưu ID của lễ
          setIsDrawerVisible(true); // Mở Drawer
        }}
        style={{ cursor: "pointer" }}
      >
        <ul className="events">
          {sortedFeasts.map((feast: any) => (
            <li key={feast.id}>
              <Badge
                status={feastTypeColors[feast?.feast_type]}
                text={feast.feast_name}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handleRefresh} style={{ marginLeft: "8px" }}>
          <FaSync /> Làm mới
        </Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading data</p>
      ) : (
        <Calendar cellRender={cellRender} />
      )}

      {/* Sử dụng FeastDrawer */}
      <FeastDrawer
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        selectedDate={selectedDate}
        selectedFeast={selectedFeast}
        scheduleId={ScheduleId}
      />
    </div>
  );
};

export default CatholicCalendarTable;
