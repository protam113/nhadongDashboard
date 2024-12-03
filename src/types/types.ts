// types.ts
import {RcFile} from "antd/es/upload";

/**
 authContext Interface
 **/

export interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    getToken: () => string | null; // Thêm getToken vào kiểu AuthContextType
}

/**
 PushButtonProps Interface
 **/
export interface PushButtonProps {
    href: string; // Đường dẫn để chuyển hướng
    label: string
}


/**
 Filters Interface
 **/
export interface Filters {
    [key: string]: string | number | string[] | undefined;
}

export interface SectionField {
    type: 'title' | 'description' | 'content' | 'link';
    value: string;
}

export interface Section {
    fields: SectionField[];
}


export interface Category {
    id: string;
    name: string;
    image: string;
}

export interface Blog {
    id: string;
    title: string;
    description: string;
    content: string;
    link: string;
    image: string;
    created_date: string;
    updated_date: string;
    categories: Category[];
}

export interface EditCategoryItem {
    name: string;
    image: RcFile | null; // Chỉnh sửa kiểu file thành RcFile | null
}




/**
 New Event Interface
 **/


export interface NewEvent {
    title: string;
    description: string;
    category: string; // Mảng danh mục
    status: string;
    image: File[] | string | null;
}


/**
 Event Interface
 **/

export interface EventList {
    id: number;
    title: string;
    description: string;
    content: string; // Có thể cần điều chỉnh nếu cấu trúc khác
    status: string;
    image: string | null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
    category: string;
    user: string;
}

// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
export interface FetchEventListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: EventList[];
}

