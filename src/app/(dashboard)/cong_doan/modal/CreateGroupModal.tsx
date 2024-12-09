import React, { useState } from "react";
import { Input, Upload, Button, message, Progress, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { RcFile } from "antd/lib/upload";
import { useCreateGroup } from "@/hooks/group/useGroup"; // Giả sử bạn đã có hook useCreateGroup

const CreateGroup: React.FC<{
  onLoadingChange: (isLoading: boolean, progress: number) => void;
}> = ({ onLoadingChange }) => {
  const { mutate: createGroup } = useCreateGroup();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [founding_date, setFoundingDate] = useState<string>(""); // Keep as string initially
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!name || !description || !founding_date) {
      message.error("Please fill all fields!");
      return;
    }

    // Convert founding_date from string to Date
    const formattedFoundingDate = new Date(founding_date);

    // Check if the date is valid
    if (isNaN(formattedFoundingDate.getTime())) {
      message.error("Invalid founding date!");
      return;
    }

    setProgress(0); // Reset progress
    setIsLoading(true);
    onLoadingChange(true, 0); // Notify parent component loading has started

    try {
      // Simulate progress
      for (let i = 1; i <= 100; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20)); // Simulate delay
        setProgress(i);
        onLoadingChange(true, i); // Update progress
      }

      // Prepare the data to create the group
      const groupData = {
        name,
        description,
        founding_date: formattedFoundingDate, // Pass Date object
        image: imageList[0]?.originFileObj ?? null, // Send the first image if exists
      };

      await new Promise((resolve, reject) => {
        createGroup(groupData, {
          onSuccess: resolve,
          onError: reject,
        });
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
      <h2 className="text-18 font-bold mb-4">Create Group</h2>
      <label className="block mb-2 font-medium text-gray-700">Name</label>
      <Input
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />

      <label className="block mb-2 font-medium text-gray-700">
        Description
      </label>
      <Input
        placeholder="Group Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
      />

      <label className="block mb-2 font-medium text-gray-700">
        Founding Date
      </label>
      <Input
        type="date"
        value={founding_date}
        onChange={(e) => setFoundingDate(e.target.value)} // Keep as string
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
          alt="Xem Ảnh Trước"
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
        />
      )}

      <Progress
        percent={progress}
        status={progress === 100 ? "success" : "active"}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        className="w-full mt-4"
        disabled={isLoading}
      >
        Create Group
      </Button>
    </div>
  );
};

export default CreateGroup;
