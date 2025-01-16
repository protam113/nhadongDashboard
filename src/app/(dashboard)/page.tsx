"use client";

import React from "react";
import UserProfile from "@/components/info/userDate";
import CommentsQueueTable from "@/components/main/home/commentQueue";
import { useUser } from "@/context/userProvider";

const Home: React.FC = () => {
  const { userInfo } = useUser() || {};

  return (
    <div className="p-4">
      <div className="">
        <UserProfile />
      </div>
      {userInfo?.role.name === "admin" ? (
        <div className="w-full">
          <CommentsQueueTable />
        </div>
      ) : null}
    </div>
  );
};

export default Home;
