import { useState } from 'react';

// Định nghĩa kiểu cho BlogData
interface BlogData {
    title: string;
    desc: string;
    image: string;
    markdown: string;
}

const useNew = () => {
    // State để lưu trữ dữ liệu bài viết
    const [blogData, setBlogData] = useState<BlogData>({
        title: '',
        desc: '',
        image: '',
        markdown: ''
    });

    const [sections, setSections] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState<string | undefined>(undefined);

    const handleAddSection = (type: string) => {
        const newSection = {
            type,
            content: '',
        };
        setSections([...sections, newSection]);
        setSelectedType(undefined);
    };

    const handleChangeContent = (index: number, value: string) => {
        const updatedSections = [...sections];
        updatedSections[index].content = value; // Cập nhật nội dung
        setSections(updatedSections);
    };

    const handleSaveBlog = () => {
        // Cập nhật markdown từ các section
        const markdownString = sections.map(section => {
            switch (section.type) {
                case 'title':
                    return `# ${section.content}`;
                case 'desc':
                    return `> ${section.content}`;
                case 'content':
                    return section.content;
                case 'image':
                    return `![Image](${section.content})`;
                default:
                    return '';
            }
        }).join('\n\n');

        // Tạo một object mới với các trường không rỗng
        const savedBlogData: BlogData = {
            title: blogData.title || '', // Hoặc có thể bỏ qua
            desc: blogData.desc || '',
            image: blogData.image || '',
            markdown: markdownString || '' // Dùng markdown từ sections
        };

        console.log('Dữ liệu bài viết:', savedBlogData);
        // Logic lưu vào backend tại đây
    };

    // Hàm để cập nhật thông tin tiêu đề, mô tả và hình ảnh
    const updateBlogData = (key: keyof BlogData, value: string) => {
        setBlogData(prev => ({ ...prev, [key]: value }));
    };

    return {
        blogData, // Trả về blogData
        sections,
        selectedType,
        setSelectedType,
        handleAddSection,
        handleSaveBlog,
        handleChangeContent,
        updateBlogData // Cung cấp hàm này để cập nhật thông tin bài viết
    };
};

export default useNew;
