import { useForgotPassword, useGetVerifyCode } from "@/hooks/auth/usePassword";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/assets/image/logo.svg";
import { useRouter } from "next/router";

const Page = () => {
  const [email, setEmail] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const { mutate: GetVerifyCode } = useGetVerifyCode();
  const { mutate: ForgotPassword } = useForgotPassword();
  const [isClient, setIsClient] = useState(false); // state to check if component is mounted in the client

  // Check if component is mounted on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Avoid using router before client-side
  const router = isClient ? useRouter() : null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    // Call API to send verification code
    GetVerifyCode({ email });
    setStep(2); // Go to the next step
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ForgotPassword({ email, new_password, code });
      if (router) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Password reset failed", error);
    }
  };

  if (!isClient) return null; // or a loading spinner

  return (
    <div className="bg-primary-900">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="border border-gray-300 bg-white rounded-lg p-6 max-w-md max-md:mx-auto">
            {step === 1 ? (
              // Form 1: Enter email to send verification code
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="mb-8">
                  <h3 className="text-gray-800 text-3xl font-extrabold">
                    Forgot your password&amp;#63;
                  </h3>
                  <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                    Enter your email and we&apos;ll send you a verification code
                    to reset your password.
                  </p>
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Email Address
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
                    Send Verification Code
                  </button>
                </div>
              </form>
            ) : (
              // Form 2: Enter code and new password to reset
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="mb-8">
                  <h3 className="text-gray-800 text-3xl font-extrabold">
                    Reset your password
                  </h3>
                  <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                    Enter the verification code we sent to your email and your
                    new password.
                  </p>
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    Verification Code
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
                    New Password
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

                <div className="!mt-8">
                  <button
                    type="submit"
                    className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Reset Password
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
            <p className="text-white mt-4 px-4 md:px-8">
              Marcellin Champagnat, a Marist Priest, dreamed of a worldwide
              community devoted to making Jesus Christ known and loved among
              children and young people, especially the least favored. Today, an
              international community of brothers and laypeople continues its
              dream.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
