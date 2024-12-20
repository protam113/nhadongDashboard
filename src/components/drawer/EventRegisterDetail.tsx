import React from "react";
import { Drawer, Row, Col, Divider, Avatar, Button } from "antd";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaInfoCircle,
  FaCalendar,
} from "react-icons/fa";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph } from "docx";

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

// Hàm tạo file Word
const generateWordDocument = (member: any) => {
  const fieldsData = member?.fields_data || {};

  const getFieldValue = (key: string) =>
    fieldsData[key]?.value || "Không có thông tin!";

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Thông Tin Cá Nhân",
            heading: "Heading1",
            spacing: { after: 200 },
          }),
          new Paragraph(
            `Họ và Tên: ${getFieldValue("first_name")} ${getFieldValue(
              "last_name"
            )}`
          ),
          new Paragraph(`Email: ${getFieldValue("email")}`),
          new Paragraph(`Số Điện Thoại: ${getFieldValue("phone_number")}`),
          new Paragraph(`Ngày Sinh: ${getFieldValue("dob")}`),
          new Paragraph(
            `Mã Ơn Gọi Tu Sĩ: ${getFieldValue("religious_vocation_id")}`
          ),
          new Paragraph(`Địa Chỉ: ${getFieldValue("location")}`),

          new Paragraph({
            text: "Thông Tin Gia Đình",
            heading: "Heading1",
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph(`Họ Cha: ${getFieldValue("dad_first_name")}`),
          new Paragraph(`Tên Cha: ${getFieldValue("dad_last_name")}`),
          new Paragraph(`Họ Mẹ: ${getFieldValue("mom_first_name")}`),
          new Paragraph(`Tên Mẹ: ${getFieldValue("mom_last_name")}`),
          new Paragraph(
            `Tên Anh/Em: ${getFieldValue("brothers_and_sisters_name")}`
          ),
          new Paragraph(
            `Năm Sinh Anh/Em: ${getFieldValue("brothers_and_sisters_year")}`
          ),

          new Paragraph({
            text: "Thông Tin Khác",
            heading: "Heading1",
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph(`Người Rửa Tội: ${getFieldValue("pardoner")}`),
          new Paragraph(`Ngày Rửa Tội: ${getFieldValue("baptism_day")}`),
          new Paragraph(`Nơi Rửa Tội: ${getFieldValue("baptismal_at")}`),
          new Paragraph(
            `Người Đỡ Đầu Rửa Tội: ${getFieldValue("baptismal_sponsor")}`
          ),
          new Paragraph(`Cha Rửa Tội: ${getFieldValue("baptism_day_form")}`),
          new Paragraph(`Giáo Xứ: ${getFieldValue("parish_hometown")}`),
          new Paragraph(`Cha Thêm Sức: ${getFieldValue("confirmation_form")}`),
          new Paragraph(`Nơi Thêm Sức: ${getFieldValue("confirmation_at")}`),
          new Paragraph(
            `Người Đỡ Đầu Thêm Sức: ${getFieldValue("confirmation_sponsor")}`
          ),
          new Paragraph(
            `Thánh lễ Thêm Sức: ${getFieldValue("confirmation_mass")}`
          ),
          new Paragraph(
            `Ngày Lần đầu nhận Mình Thánh Chúa: ${getFieldValue(
              "first_communion_day"
            )}`
          ),
          new Paragraph(
            `Quá Trình Học Giáo Lý: ${getFieldValue("learning_process")}`
          ),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "Thông_Tin_Cá_Nhân.docx");
  });
};

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
      <Button
        type="primary"
        onClick={() => generateWordDocument(member)}
        className="mb-4"
      >
        Tải Xuống Thông Tin
      </Button>
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
