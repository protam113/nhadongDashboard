"use client";

import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useStatisticalUser } from "@/hooks/statical/useStatical";
import dayjs from "dayjs";
import { DatePicker, Button, Select } from "antd";
import { SpinLoading, Error } from "@/components/design/index";

const { RangePicker } = DatePicker;
const { Option } = Select;

// Đăng ký các thành phần cần thiết
Chart.register(ArcElement, Tooltip, Legend);

const StaticalUserProb = () => {
  // Lấy ngày đầu tiên và cuối cùng của tháng hiện tại
  const [startDay, setStartDay] = useState<string>(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [endDay, setEndDay] = useState<string>(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );
  const [frequency, setFrequency] = useState<string>("day");
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, isError } = useStatisticalUser(
    {
      start_date: startDay,
      end_date: endDay,
      frequency,
    },
    refreshKey
  );

  // Xử lý khi người dùng chọn ngày
  const handleDateChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    if (dates) {
      setStartDay(dates[0]?.format("YYYY-MM-DD") || "");
      setEndDay(dates[1]?.format("YYYY-MM-DD") || "");
    }
  };

  // Làm mới dữ liệu
  const refreshData = () => setRefreshKey((prev) => prev + 1);

  // Kiểm tra trạng thái loading và lỗi
  if (isLoading) {
    return <SpinLoading />;
  }

  if (isError) {
    return <Error />;
  }

  // Kiểm tra dữ liệu
  if (!data) {
    return <p>Không có dữ liệu để hiển thị.</p>;
  }

  // Chuẩn bị dữ liệu biểu đồ Doughnut
  const chartData = {
    labels: ["Admin", "Manager", "No Role"],
    datasets: [
      {
        data: [
          data.user_details.admin_count,
          data.user_details.manager_count,
          data.user_details.no_role_count,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="w-full">
      <h2>Thống kê Người Dùng</h2>
      <div style={{ marginBottom: 20 }} className="flex items-center">
        <RangePicker
          onChange={handleDateChange}
          defaultValue={[
            dayjs(startDay, "YYYY-MM-DD"),
            dayjs(endDay, "YYYY-MM-DD"),
          ]}
        />
        <div className="mr-2">
          <Select
            defaultValue="day"
            style={{ width: 120, marginLeft: 10 }}
            onChange={setFrequency}
          >
            <Option value="day">Ngày</Option>
            <Option value="month">Tháng</Option>
            <Option value="quarter">Quý</Option>
            <Option value="year">Năm</Option>
          </Select>
        </div>
        <div className="mr-2">
          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={refreshData}
            disabled={!startDay || !endDay}
          >
            Lấy dữ liệu
          </Button>
        </div>
      </div>

      {/* Hiển thị biểu đồ */}
      <div className="flex justify-center items-center">
        <div className="h-[300px] w-full max-w-[600px]">
          <Doughnut data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default StaticalUserProb;
