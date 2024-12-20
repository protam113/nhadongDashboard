// src/app/(dashboard)/page.tsx
"use client";

import React from "react";
// import Announcements from "@/components/design/Announcements";
// import AttendanceChartContainer from "@/components/container/AttendanceChartContainer";
// import CountChartContainer from "@/components/chart/CountChartContainer";
// import FinanceChart from "@/components/chart/FinanceChart";
import UserProfile from "@/components/info/userDate";
import CommentsQueueTable from "@/components/main/home/commentQueue";

const Home: React.FC = () => {
  return (
    <div className="p-4">
      <div className="justify-between">
        <UserProfile />
      </div>
      <div className="w-full">
        <CommentsQueueTable />
      </div>
    </div>
  );
};

export default Home;
