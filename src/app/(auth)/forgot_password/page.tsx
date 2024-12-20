"use client"; // Ensures this is a client component

import { useForgotPassword, useGetVerifyCode } from "@/hooks/auth/usePassword";
import React, { useState } from "react";
import Image from "next/image";
import Logo from "@/assets/image/logo.svg";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState(""); // Thêm state cho mật khẩu xác nhận
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const { mutate: GetVerifyCode } = useGetVerifyCode();
  const { mutate: ForgotPassword } = useForgotPassword();
  const router = useRouter();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    GetVerifyCode({ email });
    setStep(2);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new_password !== confirm_password) {
      alert("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      return; // Dừng lại nếu mật khẩu không khớp
    }
    try {
      await ForgotPassword({ email, new_password, code });
      router.push("/login");
    } catch (error) {
      console.error("Password reset failed", error);
    }
  };

  const isPasswordMatch = new_password === confirm_password;

  return (
    <div className="bg-primary-900">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="border border-gray-300 bg-white rounded-lg p-6 max-w-md max-md:mx-auto">
            {step === 1 ? (
              // Form 1: Enter email to send verification code
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="mb-8">
                  <h3 className="text-gray-800 text-3xl font-bold">
                    Bạn Quên Mật Khẩu ?
                  </h3>
                  <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                    Nhập email của bạn và chúng tôi sẽ gửi cho bạn mã xác minh
                    để đặt lại mật khẩu!
                  </p>
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full text-sm text-black border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="!mt-8">
                  <button
                    type="submit"
                    className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Gửi mã xác minh
                  </button>
                </div>
              </form>
            ) : (
              // Form 2: Enter code and new password to reset
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="mb-8">
                  <h3 className="text-gray-800 text-3xl font-bold">
                    Đặt lại mật khẩu của bạn
                  </h3>
                  <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                    Nhập mã xác minh mà chúng tôi đã gửi đến email của bạn và
                    mật khẩu mới của bạn.
                  </p>
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Mã xác minh
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full text-sm text-black border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Mật Khẩu Mới
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full text-sm text-black border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter new password"
                    value={new_password}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Xác nhận Mật Khẩu Mới
                  </label>
                  <input
                    type="password"
                    required
                    className={`w-full text-sm text-black border px-4 py-3 rounded-lg outline-blue-600 ${
                      !isPasswordMatch ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Confirm new password"
                    value={confirm_password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="!mt-8">
                  <button
                    type="submit"
                    className={`w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${
                      !isPasswordMatch ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!isPasswordMatch} // Disable button if passwords don't match
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8 flex flex-col items-center justify-center text-center">
            <Image
              src={Logo}
              className="w-full h-auto max-h-[200px] object-contain"
              alt="Logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
