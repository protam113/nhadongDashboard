import CryptoJS from 'crypto-js';

// Kiểm tra và lấy khóa bí mật từ biến môi trường
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY không được định nghĩa trong biến môi trường!');
}

/**
 * Mã hóa dữ liệu
 * @param data - Dữ liệu cần mã hóa (string hoặc object)
 * @returns Chuỗi đã mã hóa
 */
export const encrypt = (data: string | object): any => {
  const stringifiedData =
    typeof data === 'string' ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
};

/**
 * Giải mã dữ liệu
 * @param encryptedData - Dữ liệu đã mã hóa (chuỗi)
 * @returns Dữ liệu gốc (string hoặc object)
 */
export const decrypt = <T = any | object>(encryptedData: string): T => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

  try {
    // Nếu có thể parse về JSON, trả về object
    return JSON.parse(decryptedString) as T;
  } catch {
    // Nếu không, trả về chuỗi gốc
    return decryptedString as T;
  }
};
