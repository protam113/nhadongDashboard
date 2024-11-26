import React, { useState } from "react";
import { Input, Upload, Button, message, Progress, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCreateCategory } from "@/hooks/cateogry/useCategories";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { RcFile } from "antd/lib/upload";

const CreateBlogCategory: React.FC<{ onLoadingChange: (isLoading: boolean, progress: number) => void }> = ({ onLoadingChange }) => {
    const { mutate: createCategory } = useCreateCategory();
    const [name, setName] = useState<string>("");
    const [imageList, setImageList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!name) {
            message.error("Please fill all fields!");
            return;
        }

        setProgress(0); // Reset progress
        setIsLoading(true);
        onLoadingChange(true, 0); // Notify parent component loading has started

        try {
            for (let i = 1; i <= 100; i++) {
                await new Promise((resolve) => setTimeout(resolve, 20)); // Simulate delay
                setProgress(i);
                onLoadingChange(true, i); // Update progress
            }

            await new Promise((resolve, reject) => {
                createCategory(
                    { name, model: "blog", image: imageList[0]?.originFileObj ?? null },
                    {
                        onSuccess: resolve,
                        onError: reject,
                    }
                );
            });

            message.success("Category created successfully!");
        } catch {
            message.error("An error occurred!");
        } finally {
            setIsLoading(false);
            onLoadingChange(false, 100); // Notify parent that loading is finished
        }
    };

    const handleChange: UploadProps["onChange"] = ({ fileList }) => {
        setImageList(fileList);
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file.originFileObj as RcFile);
        } else {
            setPreviewImage(file.url || file.preview || "");
        }
        setPreviewOpen(true);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div className="p-4">
            <h2 className="text-18 font-bold mb-4">Create Category</h2>
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <Input
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
            />

            <label className="block mb-2 font-medium text-gray-700">Image</label>
            <Upload
                listType="picture-card"
                fileList={imageList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false} // Prevent auto upload
            >
                {imageList.length >= 1 ? null : uploadButton}
            </Upload>

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                    }}
                    src={previewImage}
                />
            )}

            <Progress percent={progress} status={progress === 100 ? "success" : "active"} />
            <Button type="primary" onClick={handleSubmit} className="w-full mt-4" disabled={isLoading}>
                Create Category
            </Button>
        </div>
    );
};

export default CreateBlogCategory;
