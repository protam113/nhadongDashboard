/** @format */
import type { Metadata } from 'next';

export const appInfo = {
    logo: '/image_logo.png',  // Remove `{ }` to correctly reference the logo
    title: 'Champagnat Dashboard',
    description: 'Chào mừng đến với Champagnat Dashboard',
};

// Use `appInfo` properties in `metadata` directly
export const metadata: Metadata = {
    title: appInfo.title,
    description: appInfo.description,
    // If the logo is used as an icon, you can add it here, if not, skip this field
    icons: {
        icon: appInfo.logo,
    },
};
