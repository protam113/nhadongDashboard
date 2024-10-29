import {MdDashboard,MdAddToQueue,MdOutlineEventAvailable,MdManageSearch   } from "react-icons/md";
import { FaNewspaper,FaFileAlt,FaChurch   } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { SlNotebook ,SlCalender } from "react-icons/sl";
import { IoMdSettings } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { PiHandsPrayingBold } from "react-icons/pi";


export const NavItems = () => {
    return [
        {
            name: 'Home',
            link: '/',
            key: '1',
            icon: <MdDashboard />,
        },
        {
            name: 'Hàng Đợi',
            link: '/queue',
            key: '2',
            icon: <MdAddToQueue />,
        },
        {
            name: 'User',
            link: '/user',
            key: '3',
            icon: <HiUserGroup/>,
            children: [
                {
                    name: "User",
                    link: '/user/client_user', // Đổi link thành href
                    key: '7',
                },
                {
                    name: 'Admin & Manager',
                    link: '/user/administrator',
                    key: '8',
                },

            ]
        },
        {
            name: 'Tin Tức',
            link: '/new',
            key: '4',
            icon: <FaNewspaper />,
            children: [
                {
                    name: "Thể Loại",
                    link: '/hoi_dong/about_us', // Đổi link thành href
                    key: '20',
                    icon: <BiCategory/>,
                },
                {
                    name: 'Quản Lý Tin Tức',
                    link: '/history_monastery',
                    key: '21',
                },
            ]
        },
        {
            name: 'Blog',
            link: '/blog',
            key: '5',
            icon: <FaFileAlt />,
            children: [
                {
                    name: "Thể Loại",
                    link: '/blog/blog_categories', // Đổi link thành href
                    key: '22',
                    icon: <BiCategory/>,
                },
                {
                    name: 'Quản Lý Blog',
                    link: '/blog/blog_management',
                    key: '23',
                },
            ]
        },
        {
            name: 'Hội Dòng',
            link: '/hoi_dong',
            key: '6',
            icon: <FaChurch/>,
            children: [
                {
                    name: "Ơn Gọi",
                    link: '/hoi_dong/about_us', // Đổi link thành href
                    key: '18',
                },
                {
                    name: 'Lịch Sử Dòng',
                    link: '/history_monastery',
                    key: '19',
                    children: [
                        {
                            name: "Giai Đoạn",
                            link: '/blog/blog_categories', // Đổi link thành href
                            key: '31',
                            icon: <BiCategory/>,
                        },
                        {
                            name: 'Lịch Sử',
                            link: '/blog/blog_management',
                            key: '32',
                        },
                    ]
                },
                {
                    name: 'Sứ Vụ',
                    link: '/missio',
                    key: '9',
                    children: [
                        {
                            name: "Thể loại",
                            link: '/blog/blog_categories', // Đổi link thành href
                            key: '36',
                            icon: <BiCategory/>,
                        },
                        {
                            name: 'Quản lý sứ vụ',
                            link: '/blog/blog_management',
                            key: '37',
                        },
                    ]
                },
                {
                    name: "Thuong AI",
                    link: '/hoi_dong/on_goi', // Đổi link thành href
                    key: '10',
                }
            ]
        },
        {
            name: 'Sự Kiện',
            link: '/event',
            key: '11',
            icon: <MdOutlineEventAvailable/>,
            children: [
                {
                    name: "Thể Loại",
                    link: '/event/event_categories', // Đổi link thành href
                    key: '24',
                    icon: <BiCategory/>,
                },
                {
                    name: 'Quản Lý Sự Kiện',
                    link: '/blog/blog_management',
                    key: '25',
                    icon: <MdManageSearch/>,
                },
            ]
        },
        {
            name: 'Lịch Công Giáo & Dòng',
            link: '/catholic_calendar',
            key: '26',
            icon: <SlCalender/>,
        },
        {
            name: 'Học Tập',
            link: '/event',
            key: '12',
            icon: <SlNotebook/>,
            children: [
                {
                    name: "Bài Học",
                    link: '/hoi_dong/about_us', // Đổi link thành href
                    key: '13',
                    children: [
                        {
                            name: "Thể Loại",
                            link: '/blog/blog_categories', // Đổi link thành href
                            key: '27',
                            icon: <BiCategory/>,
                        },
                        {
                            name: 'Quản Lý Sự Kiện',
                            link: '/blog/blog_management',
                            key: '28',
                        },
                    ]
                },
                {
                    name: "Giáo Án",
                    link: '/hoi_dong/history', // Đổi link thành href
                    key: '14',
                    children: [
                        {
                            name: "Thể Loại",
                            link: '/blog/blog_categories', // Đổi link thành href
                            key: '34',
                            icon: <BiCategory/>,
                        },
                        {
                            name: 'Quản Lý Sự Kiện',
                            link: '/blog/blog_management',
                            key: '35',
                        },
                    ]
                },
                {
                    name: "Tài Liệu ",
                    link: '/hoi_dong/on_goi', // Đổi link thành href
                    key: '15',
                    children: [
                        {
                            name: "Thể Loại",
                            link: '/blog/blog_categories', // Đổi link thành href
                            key: '29',
                            icon: <BiCategory/>,
                        },
                        {
                            name: 'Quản Lý Sự Kiện',
                            link: '/blog/blog_management',
                            key: '30',
                        },
                    ]
                },
                {
                    name: "Thuong AI",
                    link: '/hoi_dong/on_goi', // Đổi link thành href
                    key: '16',
                }
            ]
        },
        {
            name: 'Lời Nguyện',
            link: '/prayer',
            key: '33',
            icon: <PiHandsPrayingBold/>,
        },
        {
            name: 'Settings',
            link: '/settings',
            key: '17',
            icon: <IoMdSettings/>,
        },
    ];

};

