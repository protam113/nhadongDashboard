// src/pages/login.tsx
'use client';


import React, { useState } from 'react';
import Image from 'next/image';
import Logo from '@/assets/image/logo.svg';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');



    return (
        <div className="font-[sans-serif] bg-primary-500">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
                    <div className="border border-gray-300 bg-white rounded-lg p-6 max-w-md max-md:mx-auto">
                        <form
                            // onSubmit={handleSubmit}
                              className="space-y-4">
                            <div className="mb-8">
                                <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
                                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                                    Sign in to your account and explore a world of possibilities. Your journey begins here.
                                </p>
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">User name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full text-sm text-black border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                                    placeholder="Enter user name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full text-sm text-black border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="text-sm">
                                    <a href="javascript:void(0);" className="text-blue-600 hover:underline font-semibold">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div className="!mt-8">
                                <button
                                    type="submit"
                                    className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Log in
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="lg:h-[400px] md:h-[300px] max-md:mt-8 flex flex-col items-center justify-center text-center">
                        <Image src={Logo} className="w-full h-auto max-h-[200px] object-contain" alt="Logo" />
                        <p className='text-white mt-4 px-4 md:px-8'>
                            Marcellin Champagnat, a Marist Priest, dreamed of a worldwide community devoted to making Jesus Christ known and loved among children and young people, especially the least favored. Today, an international community of brothers and laypeople continues its dream.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = (page: React.ReactNode) => {
    return page; // Return page without layout
};

export default LoginPage;
