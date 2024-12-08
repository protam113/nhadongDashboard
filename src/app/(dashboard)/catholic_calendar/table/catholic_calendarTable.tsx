"use client";

import React, { useState } from "react";
import { Calendar, Badge } from "antd";
import type { BadgeProps, CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import { useScheduleList } from "@/hooks/schedule/useSchedule";

// Màu sắc cho các loại lễ
const feastTypeColors: Record<string, BadgeProps["status"]> = {
  "Lễ trọng": "error", // Màu đỏ
  "Lễ kính": "warning", // Màu vàng
  "Lễ nhớ": "processing", // Màu xanh lam
  "Lễ nhớ tùy ý": "default", // Màu xám
  "Lễ nhớ tùy ý*": "processing", // Màu tím
};

// Sắp xếp loại lễ theo ưu tiên
const feastPriority = [
  "Lễ trọng",
  "Lễ kính",
  "Lễ nhớ",
  "Lễ nhớ tùy ý",
  "Lễ nhớ tùy ý*",
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
  // const [month] = useState<number>(1); // Sử dụng number thay vì string
  const [refreshKey] = useState<number>(0);

  // Lấy dữ liệu từ ScheduleList
  const {
    data: queueData,
    isLoading,
    isError,
  } = useScheduleList(
    { year: year }, // Truyền year và month đúng vào đây
    refreshKey
  );

  // Hiển thị lễ theo ngày
  const dateCellRender = (value: Dayjs) => {
    const currentDate = value.format("YYYY-MM-DD");

    // Kiểm tra trước khi truy cập dayData và dayData.feasts
    const dayData = queueData?.find((item: any) => item.day === currentDate);

    // Kiểm tra nếu dayData không tồn tại hoặc không có feasts
    if (!dayData || !dayData.feasts || dayData.feasts.length === 0) return null;

    // Sắp xếp lễ theo thứ tự ưu tiên
    const sortedFeasts = sortFeasts(dayData.feasts);

    return (
      <ul className="events">
        {sortedFeasts.map((feast: any) => (
          <li key={feast.id}>
            <Badge
              status={feastTypeColors[feast.feast_type]}
              text={feast.feast_name}
            />
          </li>
        ))}
      </ul>
    );
  };

  // Xử lý render cell cho Calendar
  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  // Hiển thị Calendar
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading data</p>
      ) : (
        <Calendar cellRender={cellRender} />
      )}
    </div>
  );
};

export default CatholicCalendarTable;
