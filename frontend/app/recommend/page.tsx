"use client"

import RadioPlayCard from "@/components/RadioPlayCard";
import * as React from "react";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { GetPrograms, Program, Programs } from "../content";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Page() {
	const programsList = React.useContext(Programs);
	const [recommendPrograms, setRecommendPrograms] = useState<null | Program[]>(null);

	const searchParams = useSearchParams()
	const programIds = searchParams.get('ids')?.split(",")
	// console.log("query: ", programIds);
	const router = useRouter();

	useEffect(() => {
		if (!programIds) {
			alert("エラーが発生しました");
			router.push("/");
			return;
		}

		const abortController = new AbortController()
		if (programsList.programs.length === 0) {
			console.log("取得")
			GetPrograms().then(res => {
				programsList.setPrograms(res)
				console.log(res.filter(p => programIds?.indexOf(p.id.toString()) >= 0))
				setRecommendPrograms(res.filter(p => programIds?.indexOf(p.id.toString()) >= 0))
			});
		} else {
			console.log("取得不要")
			setRecommendPrograms(programsList.programs.filter(p => programIds?.indexOf(p.id.toString()) >= 0))
		}

		return () => {
			abortController.abort()
		};
	}, [])

	return (
		<div className='container mx-auto my-4'>
			<h1 className="text-4xl dark:text-white text-cyan-700">
				おすすめのラジオ番組
			</h1>
			<p className="text-slate-600 mt-2">
				あなたにおすすめの番組を選びました。さっそくradikoで放送を聴いてみましょう！
			</p>
			<div className='flex flex-col space-y-3 my-3'>
				{
					recommendPrograms ?
						recommendPrograms?.map(p => (
							<RadioPlayCard
								title={p.title}
								broadcast={p.broadcast_call_sign}
								dayOfWeek={p.day_of_week}
								start={p.start}
								end={p.end}
								personality="山田太郎"
								key={p.id}
							/>
						))
						:
						<div className="text-center">
							<div className="animate-spin inline-block w-12 h-12 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
								<span className="sr-only">Loading...</span>
							</div>
						</div>
				}
			</div>

			<div className='grid columns-12'>

				<Link href="/frequencyListen">
					<button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
						選びなおす
					</button>
				</Link>

			</div>
		</div>
	)
}