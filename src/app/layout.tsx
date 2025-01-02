// src/app/layout.tsx
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
          {/* Basic Meta Tags */}
          <title>{metadata.title?.toString() || "Default Title"}</title>
          <meta
            name="description"
            content={metadata.description?.toString() || "Default description"}
          />
          <meta
            name="keywords"
            content={
              Array.isArray(metadata.keywords)
                ? metadata.keywords.join(", ")
                : metadata.keywords?.toString()
            }
          />

          {/* Favicon */}
          <link rel="icon" href={appInfo.logo} type="image/svg+xml" />
          <link rel="apple-touch-icon" href={appInfo.logo} />

          {/* Viewport for Mobile */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          />
          <meta name="theme-color" content={metadata.themeColor?.toString()} />

          {/* Open Graph Tags */}
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={metadata.openGraph?.title?.toString() || appInfo.title}
          />
          <meta
            property="og:description"
            content={
              metadata.openGraph?.description?.toString() || appInfo.description
            }
          />
          <meta
            property="og:image"
            content={`${appInfo.domain}${appInfo.ogImage}`}
          />
          <meta property="og:url" content={appInfo.domain} />
          <meta
            property="og:site_name"
            content={metadata.openGraph?.siteName?.toString() || appInfo.title}
          />

          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={metadata.twitter?.title?.toString() || appInfo.title}
          />
          <meta
            name="twitter:description"
            content={
              metadata.twitter?.description?.toString() || appInfo.description
            }
          />
          <meta
            name="twitter:image"
            content={`${appInfo.domain}${appInfo.ogImage}`}
          />
          <meta name="twitter:creator" content="@yourTwitterHandle" />

          {/* Canonical URL */}
          <link rel="canonical" href={appInfo.domain} />
        </head>
        <body>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
