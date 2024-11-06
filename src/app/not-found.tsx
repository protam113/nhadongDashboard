// app/not-found/page.tsx
"use client";

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Logo from '@/assets/image/logo.svg'

const NotFoundPage: FC = () => {
    const router = useRouter();
    const goToHome = () => {
        router.back();
    };
    return (
        <section
            className="bg-primary-900"
        >
            <div className="container min-h-screen px-6 py-8 mx-auto lg:flex lg:items-center lg:gap-12">
                <div className="wf-ull lg:w-1/2">
                    <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
                        404 error
                    </p>
                    <h1 className="mt-3 text-20 font-semibold text-primary-100  md:text-24">
                        Không tìm thấy trang
                    </h1>
                    <p className="mt-4 text-gray-200">
                        Rất tiếc, trang bạn đang tìm kiếm không tồn tại. Bạn trở về trang
                        trước đó hoặc đi tới trang chủ
                    </p>

                    <div className="flex items-center mt-6 gap-x-3">
                        <button
                            onClick={goToHome}
                            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-5 h-5 rtl:rotate-180"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                                />
                            </svg>

                            <span>Trở về</span>
                        </button>
                    </div>
                </div>

                <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0">
                    <Image className="w-full max-w-lg lg:mx-auto" src={Logo} alt=""/>
                </div>
            </div>
        </section>
    );
};

export default NotFoundPage;
