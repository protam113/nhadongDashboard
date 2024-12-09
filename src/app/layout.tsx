// src/layout.tsx
"use client";

import "../styles/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ReactQueryProvider from "@/app/ReactQueryProvider";
import { appInfo, metadata } from "@/constants/appInfos";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <head>
          <title>
            {metadata.title ? String(metadata.title) : "Default Title"}
          </title>
          <meta
            name="description"
            content={metadata.description || "Default description"}
          />
          {/* Assuming logo is a valid image path, ensure it renders correctly */}
          <link
            rel="icon"
            href={
              typeof appInfo.logo === "string"
                ? appInfo.logo
                : "/fallback-icon.svg"
            }
            type="image/svg+xml"
          />
        </head>
        <body>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
