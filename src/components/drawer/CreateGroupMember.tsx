"use client";

import React, {useState} from "react";
import {Drawer, Button, Form, Input, DatePicker, Select, Spin, Alert} from "antd";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import {useCreateGroupMember} from "@/hooks/group/useGroupMember";
import dayjs from "dayjs";
import {useGroupRoleList} from "@/hooks/group/useGroup";

const CreateGroupMember: React.FC<{ open: boolean; onClose: () => void; groupId: string }> = ({ open, onClose, groupId }) => {
    const { mutate } = useCreateGroupMember(groupId); // Sử dụng mutate từ custom hook
    const [form] = Form.useForm();
    const [currentPage] = useState(1);
    const [refreshKey] = useState(0);
    const { data, isLoading, isError } = useGroupRoleList(currentPage, refreshKey, groupId);

    const roles = data?.results || [];

    const handleSubmit = async (values: any) => {
        const formattedValues = {
            ...values,
            dob: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : null,
            join_date: values.join_date ? dayjs(values.join_date).format("YYYY-MM-DD") : null,
            first_vows_date: values.first_vows_date ? dayjs(values.first_vows_date).format("YYYY-MM-DD") : null,
            final_vows_date: values.final_vows_date ? dayjs(values.final_vows_date).format("YYYY-MM-DD") : null,
            group: groupId, // Sử dụng groupId đã được truyền vào component
        };

        // Đảm bảo rằng role là một ID hợp lệ
        if (values.role && typeof values.role === "string") {
            formattedValues.role = values.role; // role là UUID
        }

        mutate(formattedValues);
    };

    return (
        <Drawer
            width={640}
            placement="right"
            closable={true}
            onClose={onClose}
            open={open}
            title="Thêm Thành Viên Mới"
        >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Form.Item
                    label="Tên"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên thành viên!" }]}
                >
                    <Input prefix={<FaUser />} placeholder="Nhập tên" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
                >
                    <Input prefix={<FaEnvelope />} placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                    label="Số Điện Thoại"
                    name="phone_number"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                >
                    <Input prefix={<FaPhone />} placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item label="Ngày Sinh" name="dob">
                    <DatePicker className="w-full" />
                </Form.Item>
                <Form.Item label="Ngày Tham Gia" name="join_date">
                    <DatePicker className="w-full" />
                </Form.Item>
                <Form.Item label="Ngày Khấn Đầu Tiên" name="first_vows_date">
                    <DatePicker className="w-full" />
                </Form.Item>
                <Form.Item label="Ngày Khấn Trọn Đời" name="final_vows_date">
                    <DatePicker className="w-full" />
                </Form.Item>
                {isError && (
                    <Alert
                        message="Lỗi khi tải vai trò"
                        description="Không thể tải danh sách vai trò. Vui lòng thử lại sau."
                        type="error"
                        showIcon
                    />
                )}
                {isLoading ? (
                    <Spin tip="Đang tải vai trò..." />
                ) : (
                    <Form.Item
                        label="Vai Trò"
                        name="role"
                        rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
                    >
                        <Select placeholder="Chọn vai trò">
                            {roles?.map((role) => (
                                <Select.Option key={role.id} value={role.id}>
                                    {role.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <div className="flex justify-end">
                    <Button onClick={onClose} className="mr-2">
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" >
                        Thêm Thành Viên
                    </Button>
                </div>
            </Form>
        </Drawer>
    );
};

export default CreateGroupMember;
