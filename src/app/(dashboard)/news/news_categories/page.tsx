import CategoryListTable from "@/components/table/CategoryTable";
import React from "react";

const Page = () => {
  return (
    <div>
      <CategoryListTable model="news" title="Tin Tức" />
    </div>
  );
};

export default Page;
