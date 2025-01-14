"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
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
import { Donation } from "@/types/types";
import { UploadFile } from "antd/lib/upload/interface";
import EditContentSection from "@/components/main/blog/EditContentSection";
import { useEditDonation } from "@/hooks/donation/useDonation";
import { RcFile } from "antd/es/upload";
import EditMoreType from "@/components/metamedia/Edittype";

interface EditBlogModalProps {
  open: boolean;
  onClose: () => void;
  blog: Donation | null;
}

type BlogData = {
  file_type: string[];
  file: RcFile[];
  metadata: string[];
  media_remove?: string[]; // Nếu bạn cần lưu media_remove
};

const EditDonationModal: React.FC<EditBlogModalProps> = ({
  open,
  onClose,
  blog,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const { mutate } = useEditDonation();
  const [blogData, setBlogData] = useState<BlogData>({
    file_type: [],
    file: [],
    metadata: [],
  });

  useEffect(() => {
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        description: blog.description,
        content: blog.content,
        link: blog.link,
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

  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
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

  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || file.preview || "");
    setPreviewOpen(true);
  };

  const handleSubmit = () => {
    if (!blog) {
      console.error("Blog is null, cannot edit.");
      return;
    }

    form
      .validateFields()
      .then((values) => {
        const editDonation = {
          ...values,
          image: fileList.map((file) => file.originFileObj || file.url),
          file_type: blogData.file_type,
          file: blogData.file,
          metadata: blogData.metadata,
        };

        if (blogData.media_remove && blogData.media_remove.length > 0) {
          editDonation.media_remove = blogData.media_remove;
        }

        mutate({
          editDonation: editDonation,
          blogId: blog.id,
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
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false}
              >
                {fileList.length >= 1 ? null : <div>+ Tải lên</div>}
              </Upload>
              <Image
                alt="Xem trước"
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
                src={previewImage}
              />
            </Form.Item>
          </Col>
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
        </Row>
      </Form>
    </Drawer>
  );
};

export default EditDonationModal;
