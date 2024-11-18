import React from 'react';
import { Avatar, Card, Button } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { FaUserShield } from 'react-icons/fa';
import { useUser } from "@/context/userProvider";

const UserProfile = () => {
    const { userInfo } = useUser() || {};

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center">
            <Card
                className="w-full p-6 rounded-lg shadow-md bg-white"
                hoverable
                title={<h2 className="text-center text-xl font-semibold">{userInfo.username || 'Người dùng'}</h2>}
            >
                <div className="flex flex-col items-center">
                    {/* Profile Image */}
                    <Avatar
                        src={userInfo?.profile_image || undefined} // Use user's profile image if available
                        style={{ backgroundColor: '#fde3cf', color: '#f56a00', marginRight: 8 }}
                        icon={!userInfo?.profile_image ? <UserOutlined /> : undefined} // Fallback icon
                    />

                    {/* User Info */}
                    <div className="w-full text-center">
                        <p className="flex items-center justify-center gap-2 text-gray-600">
                            <MailOutlined /> {userInfo.email || 'Chưa có email'}
                        </p>
                        <p className="flex items-center justify-center gap-2 text-gray-600 mt-2">
                            <PhoneOutlined /> {userInfo.phone_number || 'Chưa có số điện thoại'}
                        </p>
                        <p className="flex items-center justify-center gap-2 text-gray-600 mt-2">
                            <FaUserShield /> {userInfo.role?.name || 'Chưa có vai trò'}
                        </p>
                        <p className="text-gray-500 mt-1 text-sm">{userInfo.role?.description || ''}</p>
                    </div>

                    {/* Actions */}
                    {/*<Button type="primary" className="mt-6 w-full" onClick={() => console.log('Edit Profile')}>*/}
                    {/*    Chỉnh sửa thông tin*/}
                    {/*</Button>*/}
                </div>
            </Card>
        </div>
    );
};

export default UserProfile;
