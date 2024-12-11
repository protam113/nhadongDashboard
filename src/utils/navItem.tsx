import {
  MdDashboard,
  MdAddToQueue,
  MdOutlineEventAvailable,
  MdGroup,
  MdManageSearch,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import { FaNewspaper, FaFileAlt, FaChurch } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { SlNotebook, SlCalender } from "react-icons/sl";
import { BiCategory } from "react-icons/bi";
import { HiOutlineNewspaper } from "react-icons/hi";
import { RiCommunityLine } from "react-icons/ri";

/**
35,18
 **/

export const NavItems = () => {
  return [
    {
      name: "Home",
      link: "/",
      key: "1",
      icon: <MdDashboard />,
    },
    {
      name: "User",
      link: "/user",
      key: "3",
      icon: <HiUserGroup />,
      children: [
        {
          name: "User",
          link: "/user/client_user", // Đổi link thành href
          key: "7",
          icon: <MdGroup />,
        },
        {
          name: "Admin & Manager",
          link: "/user/administrator",
          key: "8",
          icon: <MdOutlineAdminPanelSettings />,
        },
        {
          name: "Block List",
          link: "/user/block_list",
          key: "27",
          icon: <MdOutlineAdminPanelSettings />,
        },
      ],
    },
    {
      name: "Tin Tức",
      link: "/news",
      key: "4",
      icon: <FaNewspaper />,
      children: [
        {
          name: "Thể Loại",
          link: "/news/news_categories",
          key: "20",
          icon: <BiCategory />,
        },
        {
          name: "Quản Lý Tin Tức",
          link: "/news/news_management",
          key: "21",
          icon: <HiOutlineNewspaper />,
        },
      ],
    },
    {
      name: "Blog",
      link: "/blog",
      key: "5",
      icon: <FaFileAlt />,
      children: [
        {
          name: "Thể Loại",
          link: "/blog/blog_categories",
          key: "22",
          icon: <BiCategory />,
        },
        {
          name: "Quản Lý Blog",
          link: "/blog/blog_management",
          key: "23",
        },
      ],
    },
    {
      name: "Hội Dòng",
      link: "/hoi_dong",
      key: "6",
      icon: <FaChurch />,
      children: [
        {
          name: "Lịch Sử Dòng",
          link: "/hoi_dong/history_monastery",
          key: "19",
        },
        {
          name: "Sứ Vụ",
          link: "/hoi_dong/missio",
          key: "9",
          children: [
            {
              name: "Thể loại",
              link: "/hoi_dong/missio/missio_categories",
              key: "36",
              icon: <BiCategory />,
            },
            // {
            //   name: "Quản lý sứ vụ",
            //   link: "/blog/blog_management",
            //   key: "37",
            // },
          ],
        },
        // {
        //   name: "Thuong AI",
        //   link: "/hoi_dong/on_goi",
        //   key: "10",
        // },
      ],
    },
    {
      name: "Sự Kiện",
      link: "/event",
      key: "11",
      icon: <MdOutlineEventAvailable />,
      children: [
        {
          name: "Ơn Gọi",
          link: "/event/vocation_list",
          key: "24",
          icon: <BiCategory />,
        },
        {
          name: "Sự Kiện",
          link: "/event/event_list",
          key: "28",
          icon: <BiCategory />,
        },
      ],
    },
    {
      name: "Lịch Công Giáo & Dòng",
      link: "/catholic_calendar",
      key: "26",
      icon: <SlCalender />,
    },
    {
      name: "Học Tập",
      key: "12",
      icon: <SlNotebook />,
      children: [
        {
          name: "Tài Liệu ",
          link: "/study/document",
          key: "15",
          children: [
            {
              name: "Quản Lý Tài Liệu",
              link: "/study/document/document_manager",
              key: "13",
              icon: <MdManageSearch />,
            },
            // {
            //   name: "Thể Loại",
            //   link: "/study/document/document_categories",
            //   key: "14",
            //   icon: <MdManageSearch />,
            // },
          ],
        },
        {
          name: "Thuong AI",
          link: "/hoi_dong/on_goi",
          key: "16",
        },
      ],
    },
    {
      name: "Danh Mục",
      link: "/danh_muc",
      key: "2",
      icon: <MdAddToQueue />,
      children: [
        {
          name: "Hàng Đợi",
          link: "/danh_muc/queue",
          key: "25",
          icon: <MdManageSearch />,
        },
        {
          name: "Thể Loại",
          link: "/danh_muc/categories",
          key: "38",
          icon: <MdManageSearch />,
        },
      ],
    },
    {
      name: "Cộng Đoàn",
      link: "/cong_doan",
      key: "17",
      icon: <RiCommunityLine />,
    },
  ];
};
