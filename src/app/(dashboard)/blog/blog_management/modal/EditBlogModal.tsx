"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Space,
} from "antd";
import { Blog } from "@/types/types";
import { CategoriesList } from "@/lib/categoriesList";
import { UploadFile } from "antd/lib/upload/interface";
import { useEditBlog } from "@/hooks/blog/useBlog";
import EditContentSection from "@/components/main/blog/EditContentSection";
import EditMoreType from "@/components/metamedia/Edittype";
import { RcFile } from "antd/es/upload";
import EditUploadImage from "@/components/common/EditUploadImage";

interface EditBlogModalProps {
  open: boolean;
  onClose: () => void;
  blog: Blog | null;
}

type BlogData = {
  file_type: string[];
  file: RcFile[];
  metadata: string[];
  media_remove?: string[];
};

const EditBlogModal: React.FC<
  EditBlogModalProps & {
    loading: boolean;
    setLoading: (state: boolean) => void;
  }
> = ({ open, onClose, blog, loading, setLoading }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [initialCategories, setInitialCategories] = useState<string[]>([]);
  const { queueData, isLoading, isError } = CategoriesList(1, "blog", 0);
  const { mutate: editBlogMutation } = useEditBlog();
  const [blogData, setBlogData] = useState<BlogData>({
    file_type: [],
    file: [],
    metadata: [],
  });

  useEffect(() => {
    if (blog) {
      const categoryIds =
        blog.categories?.map((category) => category.id.toString()) || [];
      setInitialCategories(categoryIds);
      setSelectedCategories(categoryIds);

      form.setFieldsValue({
        title: blog.title,
        description: blog.description,
        content: blog.content,
        link: blog.link,
        category: categoryIds,
      });

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
    }
  }, [blog, form]);

  const handleCategoryChange = (checkedValues: string[]) => {
    setSelectedCategories(checkedValues);
  };

  const handleDataChange = useCallback(
    (data: {
      filetype: string[];
      file: (string | RcFile | null)[]; // Allowing string, RcFile, or null
      metadata: string[];
      media_remove?: string[];
    }) => {
      const { filetype, file, metadata, media_remove } = data;

      if (filetype) {
        setBlogData((prevData) => ({
          ...prevData,
          file_type: filetype, // Cập nhật file_type
        }));
      }

      if (file) {
        // Filter out invalid files (null or strings)
        const validFiles = file.filter(
          (item): item is RcFile => item !== null && !(typeof item === "string")
        );
        setBlogData((prevData) => ({
          ...prevData,
          file: validFiles, // Cập nhật mảng tệp file chỉ với RcFile hợp lệ
        }));
      }
      if (metadata) {
        setBlogData((prevData) => ({
          ...prevData,
          metadata: metadata, // Cập nhật metadata
        }));
      }

      // Cập nhật media_remove nếu có
      if (media_remove) {
        setBlogData((prevData) => ({
          ...prevData,
          media_remove: media_remove, // Cập nhật danh sách các media đã bị xóa
        }));
      }
    },
    [] // Không phụ thuộc vào bất kỳ giá trị nào ngoài data
  );

  const handleSubmit = () => {
    if (!blog) {
      message.warning("Không thể cập nhật bài viết!!.");
      return;
    }

    form
      .validateFields()
      .then((values) => {
        const category_remove = initialCategories.filter(
          (category) => !selectedCategories.includes(category)
        );

        const hasCategoryChanged =
          selectedCategories.length !== initialCategories.length ||
          selectedCategories.some((cat) => !initialCategories.includes(cat));

        const uniqueCategories = Array.from(new Set(selectedCategories));

        const editBlog: any = {
          ...values,
          category_remove:
            category_remove.length > 0 ? category_remove : undefined,
          image: fileList.map((file) => file.originFileObj || file.url),
          file_type: blogData.file_type,
          file: blogData.file,
          metadata: blogData.metadata,
        };

        // Chỉ thêm `category` khi có sự thay đổi và loại bỏ trùng lặp
        if (hasCategoryChanged || uniqueCategories.length > 0) {
          editBlog.category = uniqueCategories;
        }

        if (blogData.media_remove && blogData.media_remove.length > 0) {
          editBlog.media_remove = blogData.media_remove;
        }

        // Gửi mutation với payload hoàn chỉnh
        editBlogMutation(
          {
            editBlog: editBlog,
            blogId: blog.id,
          },
          {
            onSuccess: () => {
              setLoading(false);
              onClose();
            },
            onError: () => {
              setLoading(false);
            },
          }
        );
      })
      .catch((info) => {
        console.error("Lỗi khi xác thực form:", info);
      });
  };

  return (
    <Drawer
      title="Chỉnh Sửa Bài Viết"
      width={900}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit} type="primary" loading={loading}>
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
              <EditContentSection
                onChange={(content) => form.setFieldValue("content", content)}
                initialContent={blog?.content || ""}
              />
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
              <EditUploadImage
                file={blog?.image || ""} // URL hình ảnh hiện tại (nếu có)
                onImageChange={(file) => {
                  if (file) {
                    setFileList([
                      {
                        uid: file.uid,
                        name: file.name,
                        status: "done",
                        originFileObj: file,
                        url: URL.createObjectURL(file),
                      },
                    ]);
                  } else {
                    setFileList([]);
                  }
                }}
                maxCount={1}
                tooltipTitle="Vui lòng upload hình ảnh kích thước 820x500px."
              />
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
            <Form.Item label="Media">
              <EditMoreType
                onDataChange={handleDataChange}
                media={
                  blog?.media?.map((item) => ({
                    id: item.id ?? "",
                    file: item.file,
                    file_type: item.file_type ?? "",
                    metadata: JSON.stringify(item.metadata),
                  })) ?? []
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default EditBlogModal;
