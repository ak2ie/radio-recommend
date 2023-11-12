"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import RadioCard from "@/components/RadioCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GetPrograms, Program, Programs } from "../content";

type APIResponse = {
  pred_program_ids: number[]
}

export default function Page() {
  const router = useRouter();
  const [programs, setPrograms] = useState<null | Program[]>(null);

  const programsList = React.useContext(Programs);

  useEffect(() => {
    const abortController = new AbortController()
    if (programsList.programs.length === 0) {
      console.log("取得")
      GetPrograms().then(res => {
        programsList.setPrograms(res)
        setPrograms(res)
      });
    } else {
      console.log("取得不要")
      setPrograms(programsList.programs)
    }

    return () => {
      abortController.abort()
    };
  }, [])


  const pathname = usePathname()
  const searchParams = useSearchParams()
  // TODO:前回の選択値が残ってしまう
  useEffect(() => {
    if (!programs) {
      console.log("再設定できません")
      return;
    }
    console.log("再設定")
    const newPrograms = programs;
    for (let i = 0; i < newPrograms.length; i++) {
      newPrograms[i].isSelected = false
    }
    setPrograms(newPrograms);

  }, [pathname, searchParams])

  const [isLoading, setLoading] = useState(false);

  /**
   * 番組選択
   * @param id 番組ID
   * @param value 選択有無
   * @returns 
   */
  const handleClick = (id: number, value: boolean) => {
    if (programs === null) {
      return
    }
    const newPrograms = [...programs];
    for (let i = 0; i < newPrograms.length; i++) {
      if (newPrograms[i].id === id) {
        newPrograms[i].isSelected = value;
      }
    }
    console.log(newPrograms.map(p => ({ id: p.id, selected: p.isSelected })));
    setPrograms(newPrograms);
  }

  /**
   * おすすめ番組推薦
   */
  const handlePred = async () => {
    if (programs === null) {
      return;
    }
    // 選択済みの番組があるか
    if (programs.filter((s) => s.isSelected).length === 0) {
      alert("番組を選択してください");
      return;
    }

    setLoading(true);

    // 選択した番組ID取得
    const selectedProgramIds = programs.filter(s => s.isSelected).map(s => s.id)

    try {
      // API呼び出し
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASEURL + "/pred/programs", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "program_ids": selectedProgramIds
        })
      });
      const predProgramIds: APIResponse = await response.json();

      // 結果が返ってきたら遷移
      router.push("/recommend?ids=" + predProgramIds["pred_program_ids"].join(","));
    } catch (e) {
      console.error(e)
      setLoading(false);
      alert("エラーが発生しました");
    }

  };
  return (
    <div className="container mx-auto my-4">
      <h1 className="text-4xl dark:text-white text-cyan-700">
        どの番組をよく聴きますか？
      </h1>
      <p className="text-slate-600 mt-2">あなたがよく聴くラジオ番組を基に、おすすめの番組を探します。</p>

      <div className="grid mt-4">
        <div className="flex flex-col space-y-3">
          {
            programs ?
              programs.map(p => (
                <RadioCard
                  title={p.title}
                  broadcast={p.broadcast_call_sign}
                  dayOfWeek="月"
                  start={p.start}
                  end={p.end}
                  personality="山田太郎"
                  id={p.id}
                  selected={handleClick}
                  disabled={isLoading}
                  key={p.id}
                />
              ))
              :
              <div className="flex animate-pulse">
                <div className="w-full">
                  <ul className="space-y-3">
                    <li className="w-full h-4 bg-gray-200 rounded-xl h-[100px] dark:bg-gray-700"></li>
                    <li className="w-full h-4 bg-gray-200 rounded-xl h-[100px] dark:bg-gray-700"></li>
                    <li className="w-full h-4 bg-gray-200 rounded-xl h-[100px] dark:bg-gray-700"></li>
                    <li className="w-full h-4 bg-gray-200 rounded-xl h-[100px] dark:bg-gray-700"></li>
                  </ul>
                </div>
              </div>
          }
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="w-[150px] justify-center mt-5 py-3 px-4 inline-flex items-center gap-x-2 text font-semibold rounded-lg border border-transparent bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          onClick={handlePred} disabled={isLoading}
        >
          {isLoading ? <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-200 rounded-full dark:text-blue-500" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div> : "決定"}
        </button>
      </div>
    </div>
  );
}
