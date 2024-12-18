"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Image,
  Input,
  Row,
  Space,
  Upload,
  UploadProps,
} from "antd";
import { Blog } from "@/types/types";
import { CategoriesList } from "@/lib/categoriesList";
import { UploadFile } from "antd/lib/upload/interface";
import { useEditBlog } from "@/hooks/blog/useBlog";

interface EditBlogModalProps {
  open: boolean;
  onClose: () => void;
  blog: Blog | null; // Cho phép null nếu blog chưa được load
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({
  open,
  onClose,
  blog,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [previewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const { queueData, isLoading, isError } = CategoriesList(1, "blog", 0);
  const { mutate: editBlogMutation } = useEditBlog();

  useEffect(() => {
    if (blog) {
      // Lấy danh sách ID thể loại đã chọn
      const categoryIds =
        blog.categories?.map((category) => category.id.toString()) || [];

      // Gán dữ liệu ban đầu vào form
      form.setFieldsValue({
        title: blog.title,
        description: blog.description,
        link: blog.link,
        category: categoryIds,
      });

      // Xử lý hình ảnh cho Upload
      if (blog.image) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: blog.image,
          },
        ]);
      }

      // Gán thể loại đã chọn
      setSelectedCategories(categoryIds);
    }
  }, [blog, form]);

  const handleCategoryChange = (checkedValues: string[]) => {
    setSelectedCategories(checkedValues);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = () => {
    if (!blog) {
      console.error("Blog is null, cannot edit.");
      return; // Dừng nếu blog là null
    }

    form
      .validateFields()
      .then((values) => {
        console.log("Form Values:", values); // Debug form values
        const editBlog = {
          ...values,
          category: selectedCategories,
          image: fileList.map((file) => file.originFileObj || file.url),
        };

        console.log("Updated Data:", editBlog); // Debug data gửi lên API
        editBlogMutation({
          editBlog: editBlog,
          blogId: blog.id, // ID bài viết cần sửa
        });
      })
      .catch((info) => {
        console.error("Lỗi khi xác thực form:", info);
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
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tiêu Đề"
              rules={[{ required: true, message: "Hãy nhập tiêu đề" }]}
            >
              <Input placeholder="Nhập tiêu đề" />
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
                <Checkbox.Group
                  options={queueData?.map((category: any) => ({
                    label: category.name,
                    value: category.id.toString(),
                  }))}
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default EditBlogModal;
