"use client";

import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode; // Define the type for children
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="container w-full max-w-[1200px] px-[20px] mx-auto relative ">
      {children}
    </div>
  );
};

export default Container;
