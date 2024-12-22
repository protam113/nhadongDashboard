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
import EditContentSection from "@/components/main/blog/EditContentSection";
import { useEditNews } from "@/hooks/new/useNews";

interface EditBlogModalProps {
  open: boolean;
  onClose: () => void;
  news: Blog | null; // Cho phép null nếu blog chưa được load
}

const EditNewsModal: React.FC<EditBlogModalProps> = ({
  open,
  onClose,
  news,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [initialCategories, setInitialCategories] = useState<string[]>([]);
  const [previewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const { queueData, isLoading, isError } = CategoriesList(1, "news", 0);
  const { mutate: editBlogMutation } = useEditNews();

  useEffect(() => {
    if (news) {
      const categoryIds =
        news.categories?.map((category) => category.id.toString()) || [];
      setInitialCategories(categoryIds); // Lưu thể loại ban đầu
      setSelectedCategories(categoryIds);

      form.setFieldsValue({
        title: news.title,
        description: news.description,
        content: news.content,
        link: news.link,
        category: categoryIds,
      });

      if (news.image) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: news.image,
          },
        ]);
      }
    }
  }, [news, form]);

  const handleCategoryChange = (checkedValues: string[]) => {
    setSelectedCategories(checkedValues);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = () => {
    if (!news) {
      console.error("Blog is null, cannot edit.");
      return;
    }

    form
      .validateFields()
      .then((values) => {
        const category_remove = initialCategories.filter(
          (category) => !selectedCategories.includes(category)
        );

        const editBlog = {
          ...values,
          category: selectedCategories,
          image: fileList.map((file) => file.originFileObj || file.url),
        };

        // Chỉ thêm `category_remove` nếu không rỗng
        if (category_remove.length > 0) {
          editBlog.category_remove = category_remove;
        }

        editBlogMutation({
          editNews: editBlog,
          blogId: news.id,
        });
      })
      .catch((info) => {
        console.error("Lỗi khi xác thực form:", info);
      });
  };
  console.log("🚀 ~ news?.content:", news?.content);

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
          <Col span={24}>
            <Form.Item
              name="content"
              label="Nội dung chi tiết"
              rules={[{ required: true, message: "Hãy nhập nội dung" }]}
            >
              {news && (
                <EditContentSection
                  onChange={(content) => form.setFieldValue("content", content)}
                  initialContent={news.content || ""}
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

export default EditNewsModal;
