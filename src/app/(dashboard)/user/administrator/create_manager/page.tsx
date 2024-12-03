'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Row, Col } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useCreateManager } from "@/hooks/user/useUsers";
import Heading from "@/components/design/Heading"; // Giả sử hook này đã được định nghĩa

const AddUserPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { mutate: createManagerMutation } = useCreateManager();

    const handleAddUser = async (values: any) => {
        setLoading(true);
        const newUser = { ...values, role: 'Manager' };

        try {
            await createManagerMutation(newUser);
            message.success('Thêm người dùng thành công!');
            form.resetFields();
        } catch (error: any) { // Assert the error type as any
            console.error(error);
            message.error('Có lỗi xảy ra khi thêm người dùng.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{ margin: '0 auto'}}>
            <Heading name="tạo quản trị viên  "/>

            <Card bordered={true}
                  style={{textAlign: 'center'}}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddUser}
                    initialValues={{role: 'Manager'}}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="username"
                                label="Tên người dùng"
                                rules={[{required: true, message: 'Vui lòng nhập tên người dùng'}]}
                            >
                                <Input prefix={<UserAddOutlined/>} placeholder="Tên người dùng"/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[{required: true, message: 'Vui lòng nhập mật khẩu'}]}
                            >
                                <Input.Password placeholder="Mật khẩu"/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="first_name"
                                label="Họ và tên đệm"
                                rules={[{required: true, message: 'Vui lòng nhập họ và tên đệm'}]}
                            >
                                <Input placeholder="Họ và tên đệm"/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="last_name"
                                label="Tên"
                                rules={[{required: true, message: 'Vui lòng nhập tên'}]}
                            >
                                <Input placeholder="Tên"/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="phone_number"
                                label="Số điện thoại"
                                rules={[{required: true, message: 'Vui lòng nhập số điện thoại'}]}
                            >
                                <Input placeholder="Số điện thoại"/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{type: 'email', message: 'Email không hợp lệ'}, {
                                    required: true,
                                    message: 'Vui lòng nhập email'
                                }]}
                            >
                                <Input placeholder="Email"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{textAlign: 'center'}}>
                        <Button type="primary" htmlType="submit" loading={loading}
                                style={{width: '100%', borderRadius: '4px'}}>
                            Thêm người dùng
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddUserPage;
