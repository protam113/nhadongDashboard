"use client";

import React from 'react';
import { Button, Layout, theme, Avatar, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import Logo from "@/assets/image/logoHeader.png";
import {useUser} from "@/context/userProvider";

const { Header } = Layout;

const DropdownMenu: React.FC = () => {
    const { userInfo } = useUser() || {}; // Provide a default empty object if useUser returns null
    const { logout } = useAuth();

    const items: MenuProps['items'] = [
        {
            label: <a href="/profile">Profile</a>, // Updated link to profile
            key: '0',
        },
        {
            label: <a href="/settings">Settings</a>, // Updated link to settings
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                    <LogoutOutlined style={{ marginRight: 8 }} />
                    Logout
                </span>
            ),
            key: '3',
            onClick: () => {
                logout(); // Call logout function
            },
        },
    ];

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <Button
                type="text"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    border: '1px solid transparent',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid #f56a00';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid transparent';
                }}
            >
                <Avatar
                    src={userInfo?.profile_image || undefined} // Use user's profile image if available
                    style={{ backgroundColor: '#fde3cf', color: '#f56a00', marginRight: 8 }}
                    icon={!userInfo?.profile_image ? <UserOutlined /> : undefined} // Fallback icon
                />
                <span style={{ fontSize: '16px' }}>
                    {userInfo?.username || 'User'} {/* Display username or fallback to 'User' */}
                </span>
            </Button>
        </Dropdown>
    );
};


interface HeaderComponentProps {
    collapsed: boolean;
    toggleCollapse: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ collapsed, toggleCollapse }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                background: colorBgContainer,
            }}
        >
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapse}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                    lineHeight: '64px',
                }}
            />
            <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0' }}>
                <Image
                    src={Logo}
                    className="w-auto h-auto max-h-[50px] object-contain"
                    alt="Logo"
                />
                <p className="text-primary-logo text-18 font-bold ml-2">
                    Champagnat Dashboard
                </p>
            </div>
            <DropdownMenu />
        </Header>
    );
};

export default HeaderComponent;

