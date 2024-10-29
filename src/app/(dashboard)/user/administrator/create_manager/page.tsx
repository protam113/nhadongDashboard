'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Upload, Card, message, Row, Col } from 'antd';
import { UploadOutlined, UserAddOutlined } from '@ant-design/icons';

const AddUserPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleAddUser = (values: any) => {
        setLoading(true);
        // Thêm vai trò là Manager mặc định
        const newUser = { ...values, role: 'Manager' };
        console.log('Dữ liệu người dùng mới:', newUser);
        // Gửi dữ liệu lên backend hoặc thực hiện logic thêm người dùng
        setTimeout(() => {
            message.success('Thêm người dùng thành công!');
            setLoading(false);
            form.resetFields();
        }, 1000);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Card title="Thêm Người Dùng" bordered={false} style={{ textAlign: 'center' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddUser}
                    initialValues={{ role: 'Manager' }}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="username"
                                label="Tên người dùng"
                                rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
                            >
                                <Input prefix={<UserAddOutlined />} placeholder="Tên người dùng" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                            >
                                <Input.Password placeholder="Mật khẩu" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="first_name"
                                label="Họ và tên đệm"
                                rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                            >
                                <Input placeholder="Họ và tên đệm" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="last_name"
                                label="Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                            >
                                <Input placeholder="Tên" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="phone_number"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input placeholder="Số điện thoại" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item name="mail" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
                                <Input placeholder="Email" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item name="profile_image" label="Ảnh hồ sơ">
                                <Upload beforeUpload={() => false} listType="picture" maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Tải lên ảnh hồ sơ</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Thêm người dùng
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddUserPage;
