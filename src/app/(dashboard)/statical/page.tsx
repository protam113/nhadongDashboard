import React from "react";
import StaticalProb from "@/components/statical/staticalProb";
import StaticalUserProb from "@/components/statical/staticalUser";

const Page: React.FC = () => {
  return (
    <div className="w-full">
      <StaticalProb />
      <StaticalUserProb />
    </div>
  );
};

export default Page;
