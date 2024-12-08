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
      <div className="flex gap-4 justify-between">
        <UserProfile />
      </div>
      <div className="w-full">
        <CommentsQueueTable />
      </div>
      {/*        /!* ATTENDANCE CHART *!/*/}
      {/*        <div className="w-full lg:w-2/3 h-[450px]">*/}
      {/*            <AttendanceChartContainer />*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    /!* BOTTOM CHART *!/*/}
      {/*    <div className="w-full h-[500px]">*/}
      {/*        <FinanceChart />*/}
      {/*    </div>*/}
      {/*/!* RIGHT *!/*/}
      {/*<div className="w-full lg:w-1/3 flex flex-col gap-8">*/}
      {/*    /!*<EventCalendarContainer/>*!/*/}
      {/*    <Announcements />*/}
    </div>
  );
};

export default Home;
