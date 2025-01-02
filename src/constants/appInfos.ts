// src/constants/appInfos.ts
import type { Metadata } from 'next';

export const appInfo = {
    logo: '/image_logo.png',
    title: 'Champagnat Dashboard',
    description: 'Chào mừng đến với Champagnat Dashboard',
    domain: 'https://dashboard.hoidonganhemducmaria.com',
    ogImage: '/logo_default.png',
    themeColor: '#ffffff',
    keywords: 'dashboard, champagnat, analytics',
} as const;

// Đảm bảo các giá trị không null/undefined
export const metadata: Metadata = {
    title: appInfo.title,
    description: appInfo.description,
    keywords: [appInfo.keywords], // Chuyển thành array để phù hợp với type
    
    icons: {
        icon: appInfo.logo,
        apple: appInfo.logo,
    },
    themeColor: appInfo.themeColor,
    
    openGraph: {
        type: 'website',
        title: appInfo.title,
        description: appInfo.description,
        siteName: appInfo.title,
        url: appInfo.domain,
        images: [{
            url: `${appInfo.domain}${appInfo.ogImage}`,
            width: 1200,
            height: 630,
            alt: appInfo.title,
        }],
    },
    
    twitter: {
        card: 'summary_large_image',
        title: appInfo.title,
        description: appInfo.description,
        images: [`${appInfo.domain}${appInfo.ogImage}`],
    },
    
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
    
    alternates: {
        canonical: appInfo.domain,
    },
};