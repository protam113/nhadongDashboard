"use client";

import { useState } from "react";
import { DatePicker, Button } from "antd";
import { Line } from "@ant-design/plots";
import dayjs from "dayjs";
import { SpinLoading, Error } from "@/components/design/index";

import { StaticalData } from "@/lib/staticalData";

const { RangePicker } = DatePicker;

const StaticalProb = () => {
  const [startDay, setStartDay] = useState<string>(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [endDay, setEndDay] = useState<string>(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );
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
    <div className="w-full">
      <p>Thông Kê Truy Cập</p>
      <div className="flex items-center space-x-2" style={{ marginBottom: 20 }}>
        <RangePicker
          onChange={handleDateChange}
          defaultValue={[
            dayjs(startDay, "YYYY-MM-DD"),
            dayjs(endDay, "YYYY-MM-DD"),
          ]}
        />
        <div className="mr-2">
          <Button
            type="primary"
            onClick={handleFetchData}
            disabled={!startDay || !endDay}
          >
            Fetch Data
          </Button>
        </div>
      </div>

      {isLoading && <SpinLoading />}
      {isError && <Error />}
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
