import React from 'react';
import { Layout, Menu } from 'antd';
import { NavItems } from '@/utils/navItem';
import Link from 'next/link';

const { Sider } = Layout;

const SidebarComponent: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
    const siderStyle: React.CSSProperties = {
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
        width: collapsed ? 120 : 250,
        transition: 'width 0.2s ease', // Thêm hiệu ứng cho transition
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
        return items.map(item => ({
            key: item.key,
            label: item.link ? (
                <Link href={item.link}>{item.name}</Link>
            ) : (
                item.name
            ),
            icon: item.icon || null,
            children: item.children ? createMenuItems(item.children) : undefined,
        }));
    };

    const menuItems = createMenuItems(navItems);

    return (
        <Sider trigger={null} collapsible collapsed={collapsed} style={siderStyle}>
            <div style={{ textAlign: 'center', margin: '16px 0' }}>
                Logo
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={menuItems}
            />
        </Sider>
    );
};

export default SidebarComponent;
