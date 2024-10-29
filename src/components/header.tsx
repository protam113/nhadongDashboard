"use client";

import React from 'react';
import { Button, Layout, theme, Avatar, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header } = Layout;

const items: MenuProps['items'] = [
    {
        label: <a href="https://www.antgroup.com">1st menu item</a>,
        key: '0',
    },
    {
        label: <a href="https://www.aliyun.com">2nd menu item</a>,
        key: '1',
    },
    {
        type: 'divider',
    },
    {
        label: '3rd menu item',
        key: '3',
    },
];

interface HeaderComponentProps {
    collapsed: boolean;
    toggleCollapse: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ collapsed, toggleCollapse }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: colorBgContainer }}>
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

            {/* Dropdown avatar nằm bên phải */}
            <Dropdown menu={{ items }} trigger={['click']}>
                <Button type="text">
                    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} icon={<UserOutlined />} />
                </Button>
            </Dropdown>
        </Header>
    );
};

export default HeaderComponent;
