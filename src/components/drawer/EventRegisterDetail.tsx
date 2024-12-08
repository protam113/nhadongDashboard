import React from "react";
import { Drawer, Row, Col, Divider, Avatar } from "antd";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaInfoCircle,
  FaCalendar,
} from "react-icons/fa";
import dayjs from "dayjs";

const DescriptionItem = ({
  title,
  content,
  icon,
}: {
  title: string;
  content: string | React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="mb-4 flex items-start">
    <div className="mr-2 text-gray-600">{icon}</div>
    <div>
      <p className="font-bold text-gray-600">{title}:</p>
      <p className="text-gray-800">{content}</p>
    </div>
  </div>
);

// const formatDate = (date: string) =>
//   date ? dayjs(date).format("DD/MM/YYYY") : "Không có thông tin!";

const EventRegisterDetail: React.FC<{
  open: boolean;
  onClose: () => void;
  member: any;
}> = ({ open, onClose, member }) => {
  const fieldsData = member?.fields_data || {};
  const getFieldValue = (key: string) =>
    fieldsData[key]?.value || "Không có thông tin!";

  return (
    <Drawer
      width={640}
      placement="right"
      closable={true}
      onClose={onClose}
      open={open}
    >
      <p className="text-16 font-bold" style={{ marginBottom: 24 }}>
        <FaIdBadge className="mr-2 inline text-gray-700" /> Trang Cá Nhân
      </p>
      <Divider />
      <Row className="flex justify-center mb-4">
        <Avatar
          size={120}
          src={getFieldValue("image") || "https://via.placeholder.com/120"}
          alt="Avatar"
        />
      </Row>
      <p className="text-gray-700 text-lg font-semibold mb-4">
        <FaInfoCircle className="mr-2 inline text-gray-700" /> Thông Tin Cá Nhân
      </p>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <DescriptionItem
            title="Họ và Tên"
            content={`${getFieldValue("first_name")} ${getFieldValue(
              "last_name"
            )}`}
            icon={<FaUser />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Email"
            content={getFieldValue("email")}
            icon={<FaEnvelope />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Số Điện Thoại"
            content={getFieldValue("phone_number")}
            icon={<FaPhone />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Ngày Sinh"
            content={getFieldValue("dob")}
            icon={<FaCalendar />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Mã Ơn Gọi Tu Sĩ"
            content={getFieldValue("religious_vocation_id")}
            icon={<FaCalendar />}
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <DescriptionItem
            title="Họ Cha"
            content={
              member?.fields_data?.dad_first_name?.value ||
              "Không có thông tin!"
            }
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Tên Cha"
            content={
              member?.fields_data?.dad_last_name?.value || "Không có thông tin!"
            }
            icon={<FaIdBadge />}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title="Họ Mẹ"
            content={
              member?.fields_data?.mom_first_name?.value ||
              "Không có thông tin!"
            }
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Tên Mẹ"
            content={
              member?.fields_data?.mom_last_name?.value || "Không có thông tin!"
            }
            icon={<FaIdBadge />}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DescriptionItem
            title="Tên Anh Chị Em"
            content={getFieldValue("brothers_and_sisters_name")}
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Năm Sinh Anh Chị Em"
            content={getFieldValue("brothers_and_sisters_year")}
            icon={<FaCalendar />}
          />
        </Col>
      </Row>
      <Divider />
      <p className="text-gray-700 text-lg font-semibold mb-4">
        <FaInfoCircle className="mr-2 inline text-gray-700" /> Thông Tin Khác
      </p>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <DescriptionItem
            title="Địa Chỉ"
            content={getFieldValue("location")}
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Người Rửa Tội"
            content={getFieldValue("pardoner")}
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Ngày Rửa Tội"
            content={getFieldValue("baptism_day")}
            icon={<FaCalendar />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Nơi Rửa Tội"
            content={getFieldValue("baptismal_at")}
            icon={<FaCalendar />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Người Đỡ Đầu Rửa Tội"
            content={getFieldValue("baptismal_sponsor")}
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Cha Rửa Tội"
            content={getFieldValue("baptism_day_form")}
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Giáo Xứ"
            content={getFieldValue("parish_hometown")}
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Cha Thêm Sức"
            content={getFieldValue("confirmation_form")}
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Nơi Thêm Sức"
            content={getFieldValue("confirmation_at")}
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Người Đỡ Đầu Thêm Sức"
            content={getFieldValue("confirmation_sponsor")}
            icon={<FaIdBadge />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Thánh lễ Thêm Sức"
            content={getFieldValue("confirmation_mass")}
            icon={<FaCalendar />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Ngày Lần đầu nhận Mình Thánh Chúa"
            content={getFieldValue("first_communion_day")}
            icon={<FaCalendar />}
          />
        </Col>
        <Col span={12}>
          <DescriptionItem
            title="Quá Trình Học Giáo Lý"
            content={getFieldValue("learning_process")}
            icon={<FaCalendar />}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default EventRegisterDetail;
