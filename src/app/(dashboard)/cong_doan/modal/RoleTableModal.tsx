"use client";

import React, { useState } from "react";
import {Table, Spin, Alert, Pagination, Button, Modal} from "antd";
import { useGroupRoleList } from "@/hooks/group/useGroup";
import CreateRoleGroup from "@/app/(dashboard)/cong_doan/modal/createRoleGroupModal";

interface RoleTableModalProps {
    groupId: string;
}

const RoleTableModal: React.FC<RoleTableModalProps> = ({ groupId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0); // State để làm mới dữ liệu
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1); // Thay đổi `refreshKey` để gọi lại API
    };

    // Gọi custom hook để lấy dữ liệu role
    const { data, isLoading, isError } = useGroupRoleList(currentPage, refreshKey, groupId);

    // Cột của bảng
    const columns = [
        {
            title: "Tên Vai Trò",
            dataIndex: "name", // Dữ liệu API trả về có trường name
            key: "name",
        },
    ];

    // Hiển thị giao diện
    if (isLoading) {
        return (
            <div className="flex justify-center py-4">
                <Spin tip="Đang tải vai trò..." />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-4">
                <Alert
                    message="Lỗi"
                    description="Không thể tải danh sách vai trò. Vui lòng thử lại sau."
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div>
            <Table
                dataSource={data?.results || []} // Sử dụng `results` từ API trả về
                columns={columns}
                rowKey={(record) => record.id}
                pagination={false}
            />
            <Button type="primary" className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
                Create Role Group
            </Button>

            <Modal
                title="Create Role Group"
                visible={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateRoleGroup
                    groupId={groupId} // Truyền groupId vào
                    onLoadingChange={(isLoading, progress) => {
                        if (!isLoading && progress === 100) {
                            handleRefresh(); // Refresh danh sách role sau khi tạo xong
                            setIsCreateModalOpen(false); // Đóng modal
                        }
                    }}
                />
            </Modal>

            {/* Phân trang */}
            <div className="mt-4 flex justify-end">
                <Pagination
                    current={currentPage}
                    total={data?.count || 0}
                    pageSize={10} // Mặc định mỗi trang 10 mục
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default RoleTableModal;
