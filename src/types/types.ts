// types.ts
import {RcFile} from "antd/es/upload";

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

export interface Group {
    groupId: string;
}