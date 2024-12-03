"use client";

import React, { useState } from "react";
import { Input, Upload, Button, DatePicker } from "antd";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { useEditGroup } from "@/hooks/group/useGroup";
import dayjs from "dayjs"; // For date formatting

// Define the EditGroupItem type
interface EditGroupItem {
    name: string;
    description: string;
    founding_date: Date | null; // Keep founding_date as a Date object
    image: RcFile | null;
}

const EditGroup: React.FC<{ group: any }> = ({ group }) => {
    const [name, setName] = useState(group?.name || "");
    const [description, setDescription] = useState(group?.description || "");
    const [founding_date, setFoundingDate] = useState<Date | null>(group?.founding_date ? dayjs(group.founding_date).toDate() : null); // Keep founding_date as Date
    const [imageList, setImageList] = useState<UploadFile<any>[]>(group?.image ? [{
        uid: '-1', // Unique identifier
        name: 'image',
        url: group?.image, // Use the group image URL if available
    }] : []);

    const { mutate: editGroupMutation } = useEditGroup();

    const handleSubmit = () => {


        const editGroup: EditGroupItem = {
            name,
            description,
            founding_date, // Pass as Date object
            image: imageList.length > 0 && imageList[0].originFileObj ? imageList[0].originFileObj : null, // Get the image file
        };

        editGroupMutation({
            groupId: group.id,
            editGroup,
        });
    };

    const handleChange: UploadProps["onChange"] = ({ fileList }) => {
        setImageList(fileList); // Update image list when the user selects a new image
    };

    const handleDateChange = (date: any) => {
        setFoundingDate(date ? date.toDate() : null); // Update founding date, convert to Date object
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div>
            <Input
                placeholder="Tên nhóm"
                value={name}
                onChange={(e) => setName(e.target.value)} // Update group name
                className="mb-4"
            />
            <Input
                placeholder="Mô tả nhóm"
                value={description}
                onChange={(e) => setDescription(e.target.value)} // Update description
                className="mb-4"
            />

            <label className="block mb-2 font-medium text-gray-700">Ngày thành lập</label>
            <DatePicker
                value={founding_date ? dayjs(founding_date) : null} // Convert Date to dayjs for DatePicker
                onChange={handleDateChange} // Handle date change
                className="mb-4"
                format="YYYY-MM-DD"
            />

            <label className="block mb-2 font-medium text-gray-700">Ảnh</label>
            <Upload
                listType="picture-card"
                fileList={imageList}
                onChange={handleChange}
                beforeUpload={() => false} // Prevent auto upload
            >
                {imageList.length < 1 && uploadButton}
            </Upload>

            <Button
                type="primary"
                onClick={handleSubmit}
                className="mt-4"
            >
                Lưu thay đổi
            </Button>
        </div>
    );
};

export default EditGroup;
