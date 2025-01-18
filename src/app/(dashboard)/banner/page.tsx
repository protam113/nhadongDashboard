"use client"; // Ensures this is a client component

import React from "react";
import PushButton from "@/components/Button/PushButton";
import ShowBanner from "./ShowBanner";
import HideBanner from "./HideBanner";
import { Heading } from "@/components/design";

const Page: React.FC = () => {
  return (
    <>
      <div className="p-4">
        <Heading name="Quản Lý Banner" />

        {/* Model selection */}
        <div className="flex justify-between items-center mb-4">
          <PushButton href="/banner/create_banner" label={"Tạo Banner"} />
        </div>

        <ShowBanner />
        <Heading name="Quản Lý Banner Ẩn" />

        <HideBanner />
      </div>
    </>
  );
};

export default Page;
