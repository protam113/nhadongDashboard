import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { DatePicker, Button, Spin, Alert, Select } from "antd";
import { StaticalUser } from "@/lib/statisticalUser"; // Giả sử StaticalUser trả về dữ liệu như bạn mô tả
import { TooltipItem } from "chart.js"; // Nhập TooltipItem

const { RangePicker } = DatePicker;
const { Option } = Select;

interface StatisticalUserResponse {
  total_users: number;
  admin_percentage: string;
  manager_percentage: string;
  no_role_percentage: string;
  user_details: {
    admin_count: number;
    manager_count: number;
    no_role_count: number;
  };
  daily_user_counts: Array<{
    count: number;
    date: string;
  }>;
}

const StaticalUserProb = () => {
  const [startDay, setStartDay] = useState<string | null>(null);
  const [endDay, setEndDay] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setStartDay(dateStrings[0]);
    setEndDay(dateStrings[1]);
  };

  const handleFetchData = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
  };

  const { queueData, isLoading, isError } = StaticalUser(
    startDay || "",
    endDay || "",
    frequency || "", // Dùng frequency ở đây
    refreshKey
  );

  // Kiểm tra trạng thái loading và lỗi
  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError) {
    return <Alert message="Error fetching data" type="error" />;
  }

  // Kiểm tra dữ liệu
  if (!queueData) {
    return <p>Không có dữ liệu để hiển thị.</p>;
  }

  // Kiểm tra kiểu dữ liệu của queueData
  const data = queueData as StatisticalUserResponse; // Áp dụng kiểu dữ liệu StatisticalUserResponse cho queueData

  // Dữ liệu cho biểu đồ Doughnut
  const chartData = {
    labels: ["Admin", "Manager", "No Role"],
    datasets: [
      {
        data: [
          data.user_details.admin_count,
          data.user_details.manager_count,
          data.user_details.no_role_count,
        ],
        backgroundColor: ["#FF5733", "#33FF57", "#F1C40F"],
        borderColor: ["#FF5733", "#33FF57", "#F1C40F"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Đảm bảo position là giá trị hợp lệ
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"doughnut">) => {
            // Định nghĩa kiểu cho tooltipItem
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Thống kê Người Dùng</h2>

      {/* Chọn ngày */}
      <RangePicker onChange={handleDateChange} />

      {/* Dropdown chọn tần suất */}
      <Select
        style={{ width: 200, marginLeft: 10 }}
        onChange={handleFrequencyChange}
        placeholder="Chọn tần suất"
      >
        <Option value="daily">Hằng ngày</Option>
        <Option value="weekly">Hằng tuần</Option>
        <Option value="monthly">Hằng tháng</Option>
      </Select>

      <Button
        type="primary"
        onClick={handleFetchData}
        disabled={!startDay || !endDay || !frequency} // Đảm bảo frequency được chọn
        style={{ marginLeft: 10 }}
      >
        Lấy Dữ Liệu
      </Button>

      {/* Hiển thị biểu đồ */}
      <Doughnut data={chartData} options={options} />

      {/* Hiển thị các thông số */}
      <div>
        <p>Tổng Người Dùng: {data.total_users}</p>
        <p>Admin: {data.user_details.admin_count}</p>
        <p>Manager: {data.user_details.manager_count}</p>
        <p>Không Có Vai Trò: {data.user_details.no_role_count}</p>
        <p>Tỷ Lệ Admin: {data.admin_percentage}%</p>
        <p>Tỷ Lệ Manager: {data.manager_percentage}%</p>
        <p>Tỷ Lệ Không Có Vai Trò: {data.no_role_percentage}%</p>
      </div>
    </div>
  );
};

export default StaticalUserProb;
