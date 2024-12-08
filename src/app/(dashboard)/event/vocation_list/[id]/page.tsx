"use client";

import { useParams } from "next/navigation";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEventDetail } from "@/hooks/event/useEventDetail";
import VocationRegisterTable from "@/components/table/VocationRegisterTable";

const Page = () => {
  const { id: blogIdParam } = useParams();
  const postId = Array.isArray(blogIdParam) ? blogIdParam[0] : blogIdParam;

  const { data: blog, isLoading, isError } = useEventDetail(postId);

  if (isLoading) {
    return (
      <>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </>
    );
  }

  // Nếu có lỗi khi lấy dữ liệu, hiển thị thông báo lỗi
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Có lỗi xảy ra khi tải bài viết.</p>
      </div>
    );
  }

  // Nếu không tìm thấy blog, hiển thị thông báo
  if (!blog) {
    return <p className="text-gray-500">Không tìm thấy bài viết nào.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* detail */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {blog.title}
          </h1>
          <p className="text-gray-500 font-medium">Mo ta</p>
          <div className="lg:text-lg flex flex-col gap-6 text-justify">
            <div
              className="description"
              dangerouslySetInnerHTML={{
                __html: blog.description.replace(/\"/g, ""), // Xóa tất cả dấu "
              }}
            />
          </div>
        </div>
        {blog.image && (
          <div className="hidden lg:block w-2/5">
            <Image
              src={blog.image}
              alt={blog.title}
              className="rounded-2xl"
              width={600}
              height={400}
            />
          </div>
        )}
      </div>
      <VocationRegisterTable postId={blog.id} />
    </div>
  );
};

export default Page;
