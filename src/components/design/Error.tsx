export default function Error() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        fontFamily: "Arial, sans-serif",
        color: "#ff4d4f",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Lỗi tải dữ liệu</h1>
      <p>
        Hệ thống không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng hoặc thử
        lại sau.
      </p>
    </div>
  );
}
