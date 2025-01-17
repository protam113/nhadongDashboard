import {
  MdDashboard,
  MdAddToQueue,
  MdGroup,
  MdManageSearch,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import { FaNewspaper, FaFileAlt, FaChurch, FaEyeDropper } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { SlNotebook, SlCalender } from "react-icons/sl";
import { BiCategory } from "react-icons/bi";
import { HiOutlineNewspaper } from "react-icons/hi";
import { RiCommunityLine } from "react-icons/ri";
import { BiDonateHeart } from "@/lib/iconLib";
import { RiCommunityFill } from "react-icons/ri";
import { IoDocumentsSharp } from "react-icons/io5";

// 35
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
      key: "2",
      icon: <HiUserGroup />,
      children: [
        {
          name: "User",
          link: "/user/client_user", // Đổi link thành href
          key: "3",
          icon: <MdGroup />,
        },
        {
          name: "Admin & Manager",
          link: "/user/administrator",
          key: "4",
          icon: <MdOutlineAdminPanelSettings />,
        },
        {
          name: "Block List",
          link: "/user/block_list",
          key: "5",
          icon: <MdOutlineAdminPanelSettings />,
        },
      ],
    },
    {
      name: "Hội Dòng",
      key: "6",
      icon: <FaChurch />,
      children: [
        {
          name: "Lịch Sử Dòng",
          link: "/hoi_dong/history_monastery",
          key: "7",
        },
        {
          name: "Đặc Sủng Linh Đạo",
          link: "/hoi_dong/dac_sung_linh_dao",
          key: "8",
        },
      ],
    },
    {
      name: "Đấng Sáng Lập",
      key: "9",
      icon: <FaChurch />,
      children: [
        {
          name: "Cuộc Đời Đấng Sáng Lập",
          link: "/dang_sang_lap/cuoc_doi_dang_sang_lap",
          key: "10",
        },
        {
          name: "Thư Đấng Sáng Lập",
          link: "/dang_sang_lap/thu_dang_sang_lap",
          key: "11",
        },
      ],
    },
    {
      name: "Danh Mục",
      key: "31",
      icon: <MdAddToQueue />,
      children: [
        {
          name: "Hàng Đợi",
          link: "/danh_muc/queue",
          key: "32",
          icon: <MdManageSearch />,
        },
        {
          name: "Thể Loại",
          link: "/danh_muc/categories",
          key: "33",
          icon: <MdManageSearch />,
        },
      ],
    },
    {
      name: "Tin Tức",
      link: "/news",
      key: "12",
      icon: <FaNewspaper />,
      children: [
        {
          name: "Thể Loại",
          link: "/news/news_categories",
          key: "13",
          icon: <BiCategory />,
        },
        {
          name: "Quản Lý Tin Tức",
          link: "/news/news_management",
          key: "14",
          icon: <HiOutlineNewspaper />,
        },
      ],
    },
    {
      name: "Giáo Hội",
      link: "/blog",
      key: "15",
      icon: <FaFileAlt />,
      children: [
        {
          name: "Thể Loại",
          link: "/blog/blog_categories",
          key: "16",
          icon: <BiCategory />,
        },
        {
          name: "Quản Lý Blog",
          link: "/blog/blog_management",
          key: "17",
        },
      ],
    },
    {
      name: "Sứ Vụ",
      link: "/missio",
      key: "18",
      icon: <FaEyeDropper />,
      children: [
        {
          name: "Thể loại",
          link: "/missio/missio_categories",
          key: "19",
          icon: <BiCategory />,
        },
      ],
    },
    {
      name: "Tài Liệu ",
      link: "/document",
      key: "20",
      icon: <IoDocumentsSharp />,
      children: [
        {
          name: "Quản Lý Tài Liệu",
          link: "/document/document_manager",
          key: "21",
          icon: <MdManageSearch />,
        },
      ],
    },
    // {
    //   name: "Cầu Nguyện",
    //   link: "/pray",
    //   key: "22",
    //   icon: <FaPray />,
    // },
    {
      name: "Bác Ái Xã Hội",
      icon: <RiCommunityFill />,
      key: "35",
      children: [
        {
          name: "Sự Kiện",
          link: "/bac_ai_xa_hoi/event_list",
          key: "23",
          icon: <BiCategory />,
        },
        {
          name: "Quyên Góp",
          link: "/bac_ai_xa_hoi/donation",
          key: "24",
          icon: <BiDonateHeart />,
        },
      ],
    },
    {
      name: "Ơn Gọi",
      key: "25",
      icon: <BiCategory />,
      children: [
        {
          name: "Tìm Hiểu Về Ơn Gọi",
          link: "/vocation/learn_vocation",
          key: "36",
          icon: <BiCategory />,
        },
        {
          name: "Danh Sách Đăng Ký",
          link: "/vocation/vocation_list",
          key: "38",
          icon: <BiDonateHeart />,
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
      key: "27",
      icon: <SlNotebook />,
      children: [
        {
          name: "Thuong AI",
          link: "/study/chatAI",
          key: "28",
        },
      ],
    },
    {
      name: "Thư Viện",
      icon: <MdAddToQueue />,
      key: "37",

      children: [
        {
          name: "Ảnh",
          link: "/thu_vien_anh",
          key: "29",
          icon: <MdManageSearch />,
        },
        {
          name: "Video",
          link: "/thu_vien_video",
          key: "30",
          icon: <MdManageSearch />,
        },
      ],
    },

    {
      name: "Cộng Đoàn",
      link: "/cong_doan",
      key: "34",
      icon: <RiCommunityLine />,
    },
  ];
};
