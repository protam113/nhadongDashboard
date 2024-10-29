import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Champagnat Dashboard",
  description: "Generated by create next app",
    icons: {
        icon: "assets/image/logo.svg", // Đường dẫn tới biểu tượng
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <AntdRegistry>
            {children}
      </AntdRegistry>
      </body>
    </html>
  );
}
