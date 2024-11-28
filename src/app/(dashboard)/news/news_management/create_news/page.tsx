'use client';

import React, { useState } from 'react';
import {Form, Input, Button, Upload, Card, Checkbox, message, Image} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import { CategoriesList } from "@/lib/categoriesList";
import {UploadFile, UploadProps} from "antd/lib/upload/interface";
import {useCreateNews} from "@/hooks/new/useNews";
import ContentSection from "@/components/main/blog/ContentSection";
import { Section, SectionField } from '@/types/types';
import {useRouter} from "next/navigation";


const CreateNewsPage: React.FC = () => {
    const [content, setContent] = useState<Section[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        image: [] as RcFile[],  // Đổi từ `null` thành mảng `File[]`
        content: [] as Section[],
        category: [] as string[],
        link: '',
    });
    const [currentPage] = useState(1);
    const [refreshKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const { mutate: createBlogMutation } = useCreateNews();
    const [form] = Form.useForm();
    const { queueData, isLoading, isError } = CategoriesList(currentPage, "news", refreshKey);
    const router = useRouter();

    const handleCategoryChange = (checkedValues: string[]) => {
        setBlogData({ ...blogData, category: checkedValues });
    };

    const handleAddSection = () => {
        setContent([...content, { fields: [] }]);
    };

    const handleAddField = (index: number, fieldType: SectionField['type']) => {
        const newContent = [...content];

        // Thêm các trường nội dung dựa trên loại trường
        if (fieldType === 'title' || fieldType === 'description' || fieldType === 'content') {
            newContent[index].fields.push({ type: fieldType, value: '' });
        }

        setContent(newContent);
    };


    const handleFieldChange = (value: string, sectionIndex: number, fieldIndex: number) => {
        const newContent = [...content];
        newContent[sectionIndex].fields[fieldIndex].value = value;
        setContent(newContent);
        setBlogData({ ...blogData, content: newContent });
    };


    const handleChange: UploadProps["onChange"] = ({ fileList }) => {
        setFileList(fileList);
        setBlogData({ ...blogData, image: fileList.map(file => file.originFileObj as RcFile) });  // Lưu mảng file
    };



    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file.originFileObj as RcFile);
        } else {
            setPreviewImage(file.url || file.preview || "");
        }
        setPreviewOpen(true);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleSaveBlog = async () => {
        setLoading(true);
        try {
            if (blogData.category.length === 0) {
                message.error('Vui lòng chọn ít nhất một thể loại!');
                setLoading(false);
                return;
            }

            if (blogData.image.length === 0) {  // Kiểm tra xem đã có ảnh chưa
                message.error('Vui lòng tải lên một hình ảnh!');
                setLoading(false);
                return;
            }

            // Định dạng content thành chuỗi JSON
            const formattedContent = (blogData.content as Section[]).map((section) => {
                const sectionData: Record<string, string> = {};
                section.fields.forEach((field) => {
                    sectionData[field.type] = field.value;
                });

                // Convert đối tượng thành chuỗi JSON, sau đó thay dấu " bằng dấu '
                const jsonString = JSON.stringify(sectionData);
                return jsonString.replace(/"/g, "'");  // Thay dấu " thành dấu '
            });

            // Nếu bạn muốn chỉ có một chuỗi JSON duy nhất cho tất cả phần nội dung
            const contentString = formattedContent.join(", ");  // Nối tất cả các phần lại với nhau
            const blogDataToSend = {
                ...blogData,
                content: `{${contentString}}`,  // Đặt trong dấu {}
                image: blogData.image,  // Sử dụng mảng File[] của hình ảnh
            };

            console.log(blogDataToSend);
            createBlogMutation(blogDataToSend);  // Gọi mutation để tạo blog
            form.resetFields();  // Reset form sau khi tạo bài viết
            setContent([]);  // Reset các phần nội dung
            setBlogData({
                title: '',
                description: '',
                image: [],  // Reset lại mảng ảnh
                content: [],
                category: [],
                link: '',
            });
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra khi thêm bài viết.');
        } finally {
            setLoading(false);
            router.back();
        }
    };


    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Card title="Tạo Tin Tức" bordered={false}>
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
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={() => false} // Ngăn tự động tải lên
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>

                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                }}
                                src={previewImage}
                            />
                        )}
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
                        <ContentSection
                            key={index}
                            section={section}
                            index={index}
                            handleAddField={handleAddField}
                            handleFieldChange={handleFieldChange}
                        />
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

export default CreateNewsPage;
