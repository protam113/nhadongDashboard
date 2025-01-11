import Container from "@/components/design/container/container";
import Heading from "@/components/design/Heading";
import BlogsGallery from "@/components/main/thu_vien/BlogsGallery";
import NewsGallery from "@/components/main/thu_vien/NewsGallery";
import OnGoiGallery from "@/components/main/thu_vien/OnGoiGallery";
import QuyenGopGallery from "@/components/main/thu_vien/QuyenGopGallery";
import SuVuGallery from "@/components/main/thu_vien/SuVuGallery";

function ThuVienPage() {
  return (
    <Container>
      <Heading name="Tin Tức" />
      <NewsGallery />

      <div className="pt-5">
        <Heading name="Bài Viết" />
        <BlogsGallery />
      </div>

      <div className="pt-5">
        <Heading name="Quyên Góp" />
        <QuyenGopGallery />
      </div>

      <div className="pt-5">
        <Heading name="Sự Vụ" />
        <SuVuGallery />
      </div>

      {/* Cột 1: Ơn Gọi */}
      <div className="pt-5">
        <Heading name="Ơn Gọi & Sự Kiện" />
        <OnGoiGallery />
      </div>
    </Container>
  );
}

export default ThuVienPage;
