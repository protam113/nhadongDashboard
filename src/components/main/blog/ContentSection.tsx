    import React from 'react';
    import { Card, Select, Form, Input } from 'antd';
    import { Section, SectionField } from '@/types/types';  // Import kiểu dữ liệu

    const { Option } = Select;

    interface ContentSectionProps {
        section: Section;
        index: number;
        handleAddField: (index: number, fieldType: SectionField['type']) => void;
        handleFieldChange: (value: string, sectionIndex: number, fieldIndex: number) => void;
    }

    const ContentSection: React.FC<ContentSectionProps> = ({
                                                               section,
                                                               index,
                                                               handleAddField,
                                                               handleFieldChange,
                                                           }) => {
        return (
            <Card key={index} style={{ marginBottom: '20px' }}>
                <h3>Phần {index + 1}</h3>
                <Select
                    placeholder="Chọn loại trường để thêm"
                    style={{ width: '100%', marginBottom: '10px' }}
                    onChange={(value) => handleAddField(index, value)}
                >
                    <Option value="title">Thêm tiêu đề</Option>
                    <Option value="description">Thêm mô tả</Option>
                    <Option value="content">Thêm nội dung chi tiết</Option>
                </Select>
                {section.fields.map((field, fieldIndex) => (
                    <Form.Item key={fieldIndex} label={field.type}>
                        <Input
                            value={field.value}
                            onChange={(e) => handleFieldChange(e.target.value, index, fieldIndex)}
                        />
                    </Form.Item>
                ))}
            </Card>
        );
    };

    export default ContentSection;
