'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Upload, Card, Select, Checkbox, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import { useCreateBlog } from '@/hooks/blog/useBlog';
import { CategoriesList } from "@/lib/categoriesList";

const { Option } = Select;

// Define the structure for a SectionField and Section
interface SectionField {
    type: 'title' | 'description' | 'image' | 'content' | 'link';
    value: string;
}

interface Section {
    fields: SectionField[];
}

const CreateBlogPage: React.FC = () => {
    const [content, setContent] = useState<Section[]>([]);
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        image: '',
        content: [] as Section[],
        category: [] as string[],
        link: '',
    });
    const [currentPage] = useState(1);
    const [refreshKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const { mutate: createBlogMutation } = useCreateBlog();
    const [form] = Form.useForm();
    const { queueData, isLoading, isError } = CategoriesList(currentPage, "blog", refreshKey);

    const handleCategoryChange = (checkedValues: string[]) => {
        setBlogData({ ...blogData, category: checkedValues });
    };

    const handleAddSection = () => {
        setContent([...content, { fields: [] }]);
    };

    const handleAddField = (index: number, fieldType: SectionField['type']) => {
        const newContent = [...content];
        newContent[index].fields.push({ type: fieldType, value: '' });
        setContent(newContent);
    };

    const handleFieldChange = (value: string, sectionIndex: number, fieldIndex: number) => {
        const newContent = [...content];
        newContent[sectionIndex].fields[fieldIndex].value = value;
        setContent(newContent);
        setBlogData({ ...blogData, content: newContent });
    };

    const handleImageUpload = (file: RcFile, sectionIndex: number, fieldIndex: number) => {
        const newContent = [...content];
        newContent[sectionIndex].fields[fieldIndex].value = URL.createObjectURL(file);
        setContent(newContent);
        setBlogData({ ...blogData, content: newContent });
        return false;
    };

    const handleSaveBlog = async () => {
        setLoading(true);
        try {
            // Check if categories are selected
            if (blogData.category.length === 0) {
                message.error('Vui lòng chọn ít nhất một thể loại!');
                setLoading(false);
                return;
            }

            // Ensure categories are being passed as strings (e.g., ["1", "2"])
            createBlogMutation(blogData);
            message.success('Thêm bài viết thành công!');
            form.resetFields();
            setContent([]); // Reset sections
            setBlogData({
                title: '',
                description: '',
                image: '',
                content: [] as Section[],
                category: [] as string[], // Reset categories
                link: '',
            });
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra khi thêm bài viết.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Card title="Tạo Blog" bordered={false}>
                <Form form={form} layout="vertical" onFinish={handleSaveBlog}>
                    <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input
                            value={blogData.title}
                            onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                        <Input
                            value={blogData.description}
                            onChange={(e) => setBlogData({ ...blogData, description: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Hình ảnh chính">
                        <Upload beforeUpload={(file) => handleImageUpload(file, -1, -1)} showUploadList={false}>
                            <Button icon={<PlusOutlined />}>Tải lên hình ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Link" name="Link">
                        <Input
                            value={blogData.link}
                            onChange={(e) => setBlogData({ ...blogData, link: e.target.value })}
                        />
                    </Form.Item>

                    <Form.Item label="Thể loại">
                        {isLoading ? (
                            <p>Đang tải thể loại...</p>
                        ) : isError ? (
                            <p>Có lỗi khi tải thể loại</p>
                        ) : (
                            <Checkbox.Group
                                options={queueData?.map((category: any) => ({
                                    label: category.name,
                                    value: category.id.toString(),  // Ensure categories are in string format
                                }))}
                                onChange={handleCategoryChange}
                                value={blogData.category}  // Bind the selected categories to blogData
                            />
                        )}
                    </Form.Item>

                    <Button type="dashed" onClick={handleAddSection} style={{ width: '100%', marginBottom: '20px' }}>
                        + Thêm phần mới
                    </Button>

                    {content.map((section, index) => (
                        <Card key={index} style={{ marginBottom: '20px' }}>
                            <h3>Phần {index + 1}</h3>
                            <Select
                                placeholder="Chọn loại trường để thêm"
                                style={{ width: '100%', marginBottom: '10px' }}
                                onChange={(value) => handleAddField(index, value as SectionField['type'])}
                            >
                                <Option value="title">Thêm tiêu đề</Option>
                                <Option value="desc">Thêm mô tả</Option>
                                <Option value="image">Thêm hình ảnh</Option>
                                <Option value="content">Thêm nội dung chi tiết</Option>
                            </Select>
                            {section.fields.map((field, fieldIndex) => (
                                <Form.Item key={fieldIndex} label={field.type}>
                                    {field.type === 'image' ? (
                                        <Upload beforeUpload={(file) => handleImageUpload(file, index, fieldIndex)} showUploadList={false}>
                                            <Button icon={<PlusOutlined />}>Tải lên hình ảnh</Button>
                                        </Upload>
                                    ) : (
                                        <Input
                                            value={field.value}
                                            onChange={(e) => handleFieldChange(e.target.value, index, fieldIndex)}
                                        />
                                    )}
                                </Form.Item>
                            ))}
                        </Card>
                    ))}

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', borderRadius: '4px' }}>
                            Thêm Bài Viết
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateBlogPage;