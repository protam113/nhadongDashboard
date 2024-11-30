import React from "react";
import { Drawer, Row, Col, Divider, Avatar } from "antd";
import { FaUser, FaEnvelope, FaPhone, FaIdBadge, FaInfoCircle, FaCalendar } from "react-icons/fa";
import dayjs from "dayjs";

const DescriptionItem = ({ title, content, icon }: { title: string; content: string | React.ReactNode; icon?: React.ReactNode }) => (
    <div className="mb-4 flex items-start">
        <div className="mr-2 text-gray-600">{icon}</div>
        <div>
            <p className="font-bold text-gray-600">{title}:</p>
            <p className="text-gray-800">{content}</p>
        </div>
    </div>
);

const formatDate = (date:string) => (date ? dayjs(date).format("DD/MM/YYYY") : "Không có thông tin!");


const GroupMemberDetail: React.FC<{ open: boolean; onClose: () => void; member: any }> = ({open, onClose, member}) => {
    return (
        <Drawer width={640} placement="right" closable={true} onClose={onClose} open={open}>
            <p className="site-description-item-profile-p text-16 font-bold" style={{ marginBottom: 24 }}>
                <FaIdBadge className="mr-2 inline text-gray-700" /> Trang Cá Nhân
            </p>
            <Divider />
            <Row className="flex justify-center mb-4">
                <Avatar
                    size={120}
                    src={member?.image || "https://via.placeholder.com/120"}
                    alt="Avatar"
                />
            </Row>
            <p className="site-description-item-profile-p">
                <FaInfoCircle className="mr-2 inline text-gray-700" /> Thông Tin Cá Nhân
            </p>

            <Row className="mt-4">
                <Col span={12}>
                    <DescriptionItem title="Tên" content={member?.name || "Không có thông tin!"} icon={<FaUser />} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Email" content={member?.email || "Không có thông tin!"} icon={<FaEnvelope />} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Số Điện Thoại" content={member?.phone_number || "Không có thông tin!"} icon={<FaPhone />} />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Ngày Tham Gia" content={member?.join_date || "Không có thông tin!"} icon={<FaCalendar />} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem
                        title="Ngày Sinh"
                        content={member?.dob || "Không có thông tin!"}
                        icon={<FaCalendar />}
                    />
                </Col>
                <Col span={12}>
                    <DescriptionItem
                        title="Ngày Khấn Đầu Tiên"
                        content={member?.first_vows_date || "Không có thông tin!"}
                        icon={<FaCalendar />}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem
                        title="Ngày Khấn Trọn Đời"
                        content={member?.final_vows_date || "Không có thông tin!"}
                        icon={<FaCalendar />}
                    />
                </Col>
                <Col span={12}>
                    <DescriptionItem
                        title="Vai Trò"
                        content={member?.role || "Không có thông tin!"}
                        icon={<FaIdBadge />}
                    />
                </Col>
            </Row>
            <Divider />
            <p className="site-description-item-profile-p">
                <FaInfoCircle className="mr-2 inline text-gray-700" /> Thông Tin Khác
            </p>
            <Row className="mt-4">
                <Col span={12}>
                    <DescriptionItem
                        title="Nhóm"
                        content={member?.group || "Không có thông tin!"}
                        icon={<FaIdBadge />}
                    />
                </Col>
                <Col span={12}>
                    <DescriptionItem title="Ngày Tạo" content={formatDate(member?.created_date)} icon={<FaCalendar />} />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <DescriptionItem title="Ngày Cập Nhật" content={formatDate(member?.updated_date)} icon={<FaCalendar />} />
                </Col>
            </Row>
        </Drawer>
    );
};

export default GroupMemberDetail;
