import React, { useState } from "react";
import { Input, Button, message, Progress } from "antd";

import { useCreateGroupRole } from "@/hooks/group/useGroup"; // Hook custom để tạo role

interface CreateRoleGroupProps {
    groupId: string; // Nhận groupId từ cha
    onLoadingChange: (isLoading: boolean, progress: number) => void;
}

const CreateRoleGroup: React.FC<CreateRoleGroupProps> = ({ groupId, onLoadingChange }) => {
    const { mutate: createRoleGroup } = useCreateGroupRole(groupId);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);



    const handleSubmit = async () => {
        if (!name || !description) {
            message.error("Please fill all fields!");
            return;
        }

        setProgress(0); // Reset progress
        setIsLoading(true);
        onLoadingChange(true, 0); // Notify parent component loading has started

        try {
            // Prepare data for API call
            const roleData = { name, description };

            await new Promise((resolve, reject) => {
                createRoleGroup(roleData, {
                    onSuccess: resolve,
                    onError: reject,
                });
            });
        } catch {
            console.error("An error occurred!");
        } finally {
            setIsLoading(false);
            onLoadingChange(false, 100); // Notify parent that loading is finished
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-18 font-bold mb-4">Create Role Group</h2>
            <label className="block mb-2 font-medium text-gray-700">Name</label>
            <Input
                placeholder="Role Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
            />

            <label className="block mb-2 font-medium text-gray-700">Description</label>
            <Input
                placeholder="Role Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-4"
            />

            <Progress percent={progress} status={progress === 100 ? "success" : "active"} />
            <Button type="primary" onClick={handleSubmit} className="w-full mt-4" disabled={isLoading}>
                Create Role
            </Button>
        </div>
    );
};

export default CreateRoleGroup;
