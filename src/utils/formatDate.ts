// utils/formatDate.ts

// Import hàm format từ thư viện date-fns
import { format } from "date-fns";

// Hàm formatDate để định dạng ngày tháng theo các điều kiện khác nhau
const formatDate = (dateString: string): string => {
    // Tạo đối tượng Date từ chuỗi ngày tháng
    const date = new Date(dateString);
    const now = new Date(); // Lấy thời gian hiện tại

    // Tính chênh lệch thời gian giữa hiện tại và thời điểm truyền vào (tính bằng phút)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    // Nếu thời gian chênh lệch nhỏ hơn 60 phút, trả về số phút trước
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }
    // Nếu thời gian chênh lệch nhỏ hơn 24 giờ (1440 phút), trả về số giờ trước
    else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours}h ago`;
    }
    // Nếu thời gian chênh lệch lớn hơn 1 ngày, trả về ngày tháng định dạng dd/MM/yyyy
    else {
        return format(date, "dd/MM/yyyy");
    }
};

// Export hàm formatDate để sử dụng trong các phần khác của ứng dụng
export default formatDate;