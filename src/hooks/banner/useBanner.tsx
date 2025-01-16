import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME; // Tên cloud
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY; // API key
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_SECRET_KEY; // Secret key

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { folder } = req.query; // Lấy thư mục từ tham số query

  if (!cloudName || !apiKey || !apiSecret) {
    return res
      .status(400)
      .json({ error: "Cloud name, API key or secret key is missing" });
  }

  try {
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`,
      {
        params: {
          prefix: folder, // Dùng thư mục bạn cần lấy ảnh từ đó
          max_results: 30, // Số lượng ảnh tối đa
        },
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${apiKey}:${apiSecret}`
          ).toString("base64")}`, // Basic Auth sử dụng apiKey và apiSecret
        },
      }
    );
    res.status(200).json(response.data.resources); // Trả lại dữ liệu hình ảnh cho client
  } catch (error: any) {
    console.error(
      "Error fetching images from Cloudinary:",
      error.response || error.message
    );
    res.status(500).json({ error: "Error fetching images" });
  }
}

import { useQuery } from "@tanstack/react-query";

// Hàm gọi API để lấy hình ảnh từ API route trên server
const fetchImagesFromApiRoute = async (folder: string) => {
  try {
    const response = await axios.get(
      "/api/getBannerImages", // Không cần phải thêm "localhost:3000" trong URL khi gọi từ client
      {
        params: { folder: folder },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching images from API route:", error);
    throw error; // Thực thi throw để useQuery có thể xử lý lỗi
  }
};

const useBannerImages = () => {
  return useQuery<any, Error>({
    queryKey: ["bannerImages"], // Không cần token trong query key nữa
    queryFn: () => fetchImagesFromApiRoute("NhaDong"), // Gọi API với folder 'NhaDong'
    staleTime: 60000, // Dữ liệu sẽ được xem là tươi trong 60 giây
  });
};

export { useBannerImages };
