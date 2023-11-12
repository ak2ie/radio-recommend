"use client";

import * as React from "react";
import { Container, Box, Button, Stack, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { createContext, useEffect } from "react";
import Link from "next/link";

export default function Page() {
  useEffect(() => {
    import('preline')
  }, [])

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-4xl dark:text-white text-cyan-700">
        おすすめラジオ
      </h1>
      <p className="text-slate-600 mt-2">あなたがよく聴くラジオ番組を基に、おすすめの番組を探します。</p>


      {/* Testimonials */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card */}
          <div className="flex flex-col bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700">
            <div className="p-4 rounded-b-xl md:px-6">
              <h3 className="text-gray-400 font-bold text-3xl dark:text-gray-200">
                ラジオ番組を選ぶ
              </h3>
            </div>

            <div className="flex-auto p-4 md:p-6">
              <p className="mt-3 sm:mt-6 text-base text-gray-800 md:text-xl dark:text-white">
                あなたがよく聴くラジオ番組を選んでください
              </p>
            </div>
            <div className=" flex flex-row justify-end">
              <div className="text-right text-9xl text-gray-200 pr-4">
                1
              </div>
            </div>
          </div>
          {/* End Card */}

          {/* Card */}
          <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700">
            <div className="p-4 rounded-b-xl md:px-6">
              <h3 className="text-gray-400 font-bold text-3xl dark:text-gray-200">
                おすすめします
              </h3>
            </div>

            <div className="flex-auto p-4 md:p-6">
              <p className="mt-3 sm:mt-6 text-base text-gray-800 md:text-xl dark:text-white">
                あなたがよく聴くラジオ番組を基に、おすすめのラジオ番組を推薦します
              </p>
            </div>
            <div className=" flex flex-row justify-end">
              <div className="text-right text-9xl text-gray-200 pr-4">
                2
              </div>
            </div>
          </div>
          {/* End Card */}

          {/* Card */}
          <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700">
            <div className="p-4 rounded-b-xl md:px-6">
              <h3 className="text-gray-400 font-bold text-3xl dark:text-gray-200">
                radikoで聴く
              </h3>
            </div>

            <div className="flex-auto p-4 md:p-6">
              <p className="mt-3 sm:mt-6 text-base text-gray-800 md:text-xl dark:text-white">
                おすすめされたラジオ番組は再生ボタンからすぐに聴くことができます
              </p>
            </div>
            <div className=" flex flex-row justify-end">
              <div className="text-right text-9xl text-gray-200 pr-4">
                3
              </div>
            </div>
          </div>
          {/* End Card */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Testimonials */}


      <div className="flex items-center mt-4 flex-col gap-y-5">
        <div className="flex flex-row w-[350px] text-center bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="pl-3">
            <span className="font-bold">関東</span>の一部のラジオ番組からおすすめします
          </p>
        </div>
        <Link href="/frequencyListen">
          <button
            type="button"
            className="py-5 px-5 inline-flex items-center gap-x-2 text font-semibold rounded-lg border border-transparent bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            ラジオ番組を選ぶ
          </button>
        </Link>
      </div>
    </div>
  );
}
