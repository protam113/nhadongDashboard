import React from "react";
import { Layout, Menu } from "antd";
import { NavItems } from "@/utils/navItem";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/image/image_logo.png";

const { Sider } = Layout;

const SidebarComponent: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "fixed",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    width: collapsed ? 120 : 250,
    transition: "width 0.2s ease",
    fontSize: "18px",
  };

  interface NavItem {
    key: string;
    name: string;
    icon?: React.ReactNode;
    link?: string;
    children?: NavItem[];
  }

  interface MenuItem {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    children?: MenuItem[];
  }

  const navItems = NavItems();

  const createMenuItems = (items: NavItem[]): MenuItem[] => {
    return items.map((item) => ({
      key: item.key,
      label: item.link ? <Link href={item.link}>{item.name}</Link> : item.name,
      icon: item.icon || null,
      children: item.children ? createMenuItems(item.children) : undefined,
    }));
  };

  const menuItems = createMenuItems(navItems);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} style={siderStyle}>
      <div style={{ textAlign: "center", margin: "18px 0" }}>
        <Link href="/">
          <Image
            src={Logo}
            className={`w-full h-auto ${
              collapsed ? "max-h-[40px]" : "max-h-[70px]"
            } object-contain`}
            alt="Logo"
          />
        </Link>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menuItems}
        style={{ fontSize: "16px" }}
      />
    </Sider>
  );
};

export default SidebarComponent;
