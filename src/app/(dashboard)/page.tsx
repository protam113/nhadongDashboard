// src/app/(dashboard)/page.tsx
"use client";

import React from "react";
import UserProfile from "@/components/info/userDate";
import CommentsQueueTable from "@/components/main/home/commentQueue";

const Home: React.FC = () => {
  return (
    <div className="p-4">
      <div className="">
        <UserProfile />
      </div>
      <div className="w-full">
        <CommentsQueueTable />
      </div>
    </div>
  );
};

export default Home;
