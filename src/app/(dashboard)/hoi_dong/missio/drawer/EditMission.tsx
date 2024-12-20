"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Upload,
  UploadProps,
} from "antd";
import { Document } from "@/types/types";
import { CategoriesList } from "@/lib/categoriesList";
import { UploadFile } from "antd/lib/upload/interface";
import EditContentSection from "@/components/main/blog/EditContentSection";
import { useEditMission } from "@/hooks/mission/useMission";

interface EditBlogModalProps {
  open: boolean;
  onClose: () => void;
  document: Document | null; // Cho phép null nếu blog chưa được load
}

const EditMissionModal: React.FC<EditBlogModalProps> = ({
  open,
  onClose,
  document,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [initialCategory, setInitialCategory] = useState<string | null>(null);
  const [previewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const { queueData, isLoading, isError } = CategoriesList(1, "mission", 0);
  const { mutate: editBlogMutation } = useEditMission();

  useEffect(() => {
    if (document) {
      const categoryId = document.category?.id.toString() || null;
      setInitialCategory(categoryId); // Lưu thể loại ban đầu
      setSelectedCategory(categoryId); // Thiết lập giá trị thể loại hiện tại

      form.setFieldsValue({
        title: document.title,
        description: document.description,
        content: document.content,
        link: document.link,
        category: categoryId,
      });

      if (document.image) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: document.image,
          },
        ]);
      }
    }
  }, [document, form]);
  console.log("🚀 ~ document:", document);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = () => {
    if (!document) {
      console.error("Document is null, cannot edit.");
      return;
    }

    form
      .validateFields()
      .then((values) => {
        const editBlog = {
          ...values,
          category: selectedCategory ? [selectedCategory] : [],
          category_remove:
            initialCategory && initialCategory !== selectedCategory
              ? [initialCategory]
              : [],
          image: fileList.map((file) => file.originFileObj || file.url),
        };

        editBlogMutation({
          editDoc: editBlog,
          blogId: document.id,
        });
      })
      .catch((info) => {
        console.error("Validation failed:", info);
      });
  };

  return (
    <Drawer
      title="Chỉnh Sửa Bài Viết"
      width={720}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit} type="primary">
            Lưu
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Tiêu Đề"
              rules={[{ required: true, message: "Hãy nhập tiêu đề" }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập tiêu đề" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô Tả"
              rules={[{ required: true, message: "Hãy nhập mô tả" }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="content"
              label="Nội dung chi tiết"
              rules={[{ required: true, message: "Hãy nhập nội dung" }]}
            >
              {document && (
                <EditContentSection
                  onChange={(content) => form.setFieldValue("content", content)}
                  initialContent={document.content || ""}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="link"
              label="Link"
              rules={[{ required: true, message: "Hãy nhập link" }]}
            >
              <Input placeholder="Nhập link" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Hình ảnh chính">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={() => false} // Ngăn tự động tải lên
              >
                {fileList.length >= 1 ? null : <div>+ Tải lên</div>}
              </Upload>
              {previewImage && (
                <Image
                  alt="Xem Ảnh Trước"
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Thể loại">
              {isLoading ? (
                <p>Đang tải thể loại...</p>
              ) : isError ? (
                <p>Có lỗi khi tải thể loại</p>
              ) : (
                <Select
                  options={queueData?.map((category: any) => ({
                    label: category.name,
                    value: category.id.toString(),
                  }))}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  allowClear
                  placeholder="Chọn thể loại"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default EditMissionModal;
