const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white py-4 px-2 shadow-md">
      <span className="text-sm text-gray-500 text-center">
        &copy; {new Date().getFullYear()}
        <a href="https://www.facebook.com/XLR.Team" className="hover:underline">
          HOOKSTER
        </a>
        &
        <a
          href="https://www.facebook.com/thuong.ledanh.9"
          className="hover:underline"
        >
          DanhThuong
        </a>
        . All Rights Reserved.
      </span>
    </div>
  );
};

export default Footer;
