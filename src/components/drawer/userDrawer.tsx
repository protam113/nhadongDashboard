import React from "react";
import { Drawer, Row, Col, Divider, Avatar } from "antd";
import { FaUser, FaEnvelope, FaPhone, FaIdBadge, FaInfoCircle } from "react-icons/fa";

const DescriptionItem = ({ title, content, icon }: { title: string; content: string | React.ReactNode; icon?: React.ReactNode }) => (
    <div className="mb-4 flex items-start">
        <div className="mr-2 text-gray-600">{icon}</div>
        <div>
            <p className="font-bold text-gray-600">{title}:</p>
            <p className="text-gray-800">{content}</p>
        </div>
    </div>
);

const UserDrawer: React.FC<{ open: boolean; onClose: () => void; userInfo: any }> = ({ open, onClose, userInfo }) => {
    return (
        <Drawer width={640} placement="right" closable={true} onClose={onClose} open={open}>
            <p className="site-description-item-profile-p text-16 font-bold" style={{ marginBottom: 24 }}>
                <FaIdBadge className="mr-2 inline text-gray-700" /> Trang Cá Nhân
            </p>
            <Divider />
            <Row className="flex justify-center mb-4">
                <Avatar
                    size={120}
                    src={userInfo?.profile_image || "https://via.placeholder.com/120"}
                    alt="Avatar"
                />
            </Row>
            <p className="site-description-item-profile-p">
                <FaInfoCircle className="mr-2 inline text-gray-700" /> Thông Tin Cá Nhân
            </p>

            <Row className="mt-4">
                <Col span={12}>
                    <DescriptionItem title="Username" content={userInfo?.username || "Không có thông tin!"} icon={<FaUser />} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Email" content={userInfo?.email || "Không có thông tin!"} icon={<FaEnvelope />} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="First Name" content={userInfo?.first_name || "Không có thông tin!"} icon={<FaUser />} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Last Name" content={userInfo?.last_name || "Không có thông tin!"} icon={<FaUser />} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Số Điện Thoại" content={userInfo?.phone_number || "Không có thông tin!"} icon={<FaPhone />} />
                </Col>
            </Row>
            <Divider />
            <p className="site-description-item-profile-p">
                <FaInfoCircle className="mr-2 inline text-gray-700" /> Trạng Thái Tài Khoản
            </p>
            <Row className="mt-4">
                <Col span={12}>
                    <DescriptionItem
                        title="Hoạt Động"
                        content={userInfo?.is_active ? "Có" : "Không"}
                        icon={<FaIdBadge />}
                    />
                </Col>
                <Col span={12}>
                    <DescriptionItem
                        title="Block"
                        content={userInfo?.blocked ? "Có" : "Không"}
                        icon={<FaIdBadge />}
                    />
                </Col>
            </Row>
        </Drawer>
    );
};

export default UserDrawer;
