'use client';


import React, { useState } from 'react';
import { Form, Input, Button, Upload, Card, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';

const { Option } = Select;

interface SectionField {
    type: 'title' | 'desc' | 'image' | 'content';
    value: string;
}

interface Section {
    fields: SectionField[];
}

const CreateBlogPage: React.FC = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [blogData, setBlogData] = useState({
        title: '',
        desc: '',
        image: '',
        sections: [] as Section[],
    });

    const handleAddSection = () => {
        setSections([...sections, { fields: [] }]);
    };

    const handleAddField = (index: number, fieldType: SectionField['type']) => {
        const newSections = [...sections];
        newSections[index].fields.push({ type: fieldType, value: '' });
        setSections(newSections);
    };

    const handleFieldChange = (
        value: string,
        sectionIndex: number,
        fieldIndex: number
    ) => {
        const newSections = [...sections];
        newSections[sectionIndex].fields[fieldIndex].value = value;
        setSections(newSections);
        setBlogData({ ...blogData, sections: newSections });
    };

    const handleImageUpload = (file: RcFile, sectionIndex: number, fieldIndex: number) => {
        const newSections = [...sections];
        newSections[sectionIndex].fields[fieldIndex].value = URL.createObjectURL(file);
        setSections(newSections);
        setBlogData({ ...blogData, sections: newSections });
    };

    const handleSaveBlog = () => {
        console.log('Dữ liệu blog:', blogData);
        // Thêm logic lưu blog vào backend ở đây
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Card title="Tạo Blog" bordered={false}>
                <Form layout="vertical">
                    <Form.Item label="Tiêu đề">
                        <Input
                            value={blogData.title}
                            onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả">
                        <Input
                            value={blogData.desc}
                            onChange={(e) => setBlogData({ ...blogData, desc: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Hình ảnh chính">
                        <Upload
                            beforeUpload={(file) => {
                                setBlogData({ ...blogData, image: URL.createObjectURL(file) });
                                return false;
                            }}
                        >
                            <Button icon={<PlusOutlined />}>Tải lên hình ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Button
                        type="dashed"
                        onClick={handleAddSection}
                        style={{ width: '100%', marginBottom: '20px' }}
                    >
                        + Thêm phần mới
                    </Button>

                    {sections.map((section, index) => (
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
                                    {field.type === 'title' || field.type === 'desc' || field.type === 'content' ? (
                                        <Input
                                            value={field.value}
                                            onChange={(e) =>
                                                handleFieldChange(e.target.value, index, fieldIndex)
                                            }
                                        />
                                    ) : field.type === 'image' ? (
                                        <Upload
                                            beforeUpload={(file) => {
                                                handleImageUpload(file, index, fieldIndex);
                                                return false;
                                            }}
                                        >
                                            <Button icon={<PlusOutlined />}>Tải lên hình ảnh</Button>
                                        </Upload>
                                    ) : null}
                                </Form.Item>
                            ))}
                        </Card>
                    ))}

                    <Button type="primary" onClick={handleSaveBlog}>
                        Lưu Blog
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default CreateBlogPage;
