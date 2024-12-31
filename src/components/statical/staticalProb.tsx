"use client";

import { useState } from "react";
import { DatePicker, Button, Spin, Alert } from "antd";
import { Line } from "@ant-design/plots";
import { StaticalData } from "@/lib/staticalData";

const { RangePicker } = DatePicker;

const StaticalProb = () => {
  const [startDay, setStartDay] = useState<string | null>(null);
  const [endDay, setEndDay] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setStartDay(dateStrings[0]);
    setEndDay(dateStrings[1]);
  };

  const handleFetchData = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const { queueData, isLoading, isError } = StaticalData(
    startDay || "",
    endDay || "",
    refreshKey
  );

  const config = {
    data: queueData.filtered_views,
    xField: "date",
    yField: "total_views",
    point: {
      size: 5,
      shape: "diamond",
    },
    tooltip: {
      showMarkers: true,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
  };

  return (
    <div>
      <p>Thông Kê Truy Cập</p>
      <RangePicker onChange={handleDateChange} />
      <Button
        type="primary"
        onClick={handleFetchData}
        disabled={!startDay || !endDay}
      >
        Fetch Data
      </Button>
      {isLoading && <Spin />}
      {isError && <Alert message="Error fetching data" type="error" />}
      {!isLoading && !isError && (
        <>
          <Line {...config} />
          <div>
            <p>Lượt Truy Cập Trong Ngày: {queueData.today_views}</p>
            <p>Tổng Truy Cập : {queueData.total_views}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default StaticalProb;
