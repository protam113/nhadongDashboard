// src/app/(dashboard)/page.tsx
'use client';

import React from 'react';
// import Announcements from "@/components/design/Announcements";
// import AttendanceChartContainer from "@/components/container/AttendanceChartContainer";
// import CountChartContainer from "@/components/chart/CountChartContainer";
// import FinanceChart from "@/components/chart/FinanceChart";
import UserProfile from "@/components/info/userDate";


const Home: React.FC = () => {
    return (
        <div className="p-4 flex gap-4 flex-col md:flex-row">
            {/* LEFT */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
            {/*    /!* USER CARDS *!/*/}
                <div className="flex gap-4 justify-between flex-wrap">
                             <UserProfile/>
                </div>
            {/*    /!* MIDDLE CHARTS *!/*/}
                <div className="flex gap-4 flex-col lg:flex-row">
                    home page
                    {/*        /!* COUNT CHART *!/*/}
            {/*        <div className="w-full lg:w-1/3 h-[450px]">*/}
            {/*            <CountChartContainer />*/}
            {/*        </div>*/}
            {/*        /!* ATTENDANCE CHART *!/*/}
            {/*        <div className="w-full lg:w-2/3 h-[450px]">*/}
            {/*            <AttendanceChartContainer />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    /!* BOTTOM CHART *!/*/}
            {/*    <div className="w-full h-[500px]">*/}
            {/*        <FinanceChart />*/}
            {/*    </div>*/}
            </div>
            {/*/!* RIGHT *!/*/}
            {/*<div className="w-full lg:w-1/3 flex flex-col gap-8">*/}
            {/*    /!*<EventCalendarContainer/>*!/*/}
            {/*    <Announcements />*/}
            </div>
        </div>

    );
};

export default Home;
