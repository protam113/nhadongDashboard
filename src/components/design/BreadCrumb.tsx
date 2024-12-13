"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const Breadcrumb = () => {
  const path = usePathname();

  const pathArray = path?.split("/").filter((p) => p);

  return (
    <div className="text-14 ml-4  text-gray-500">
      {/* Home */}
      <Link href="/" passHref>
        <span className="hover:text-blue-500 mr-1">home</span>
      </Link>

      {pathArray?.map((segment, index) => {
        const href = "/" + pathArray.slice(0, index + 1).join("/");
        return (
          <span key={href}>
            &gt;
            {index === pathArray.length - 1 ? (
              <span className="ml-1 text-primary-500">{segment}</span>
            ) : (
              <>
                <Link href={href} passHref>
                  <span className="hover:text-blue-500 ml-1">{segment}</span>
                </Link>
              </>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
