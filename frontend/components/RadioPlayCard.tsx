import * as React from "react";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { DayOfWeek, Program } from "@/app/content";

dayjs.extend(isSameOrAfter);

export default function RadioPlayCard({
	title,
	broadcast,
	dayOfWeek,
	start,
	end,
	personality
}: {
	/**
	 * 番組タイトル
	 */
	title: string;
	/**
	 * 放送局名
	 */
	broadcast: string;
	/**
	 * 放送曜日
	 */
	dayOfWeek: DayOfWeek
	/**
	 * 放送開始時刻（hh:mm）
	 */
	start: string;
	/**
	 * 放送終了時刻（hh:mm）
	 */
	end: string;
	/**
	 * パーソナリティ
	 */
	personality: string;
}) {
	const callSign2RadikoSign: { [key: string]: string } = {
		"JOQR": "QRR",
		"JOKR": "TBS"
	};
	const index2DayOfWeek: (keyof DayOfWeek)[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	const startHour = start.split(":")[0];
	const startMinute = start.split(":")[1];
	const today = dayjs().hour(Number(startHour)).minute(Number(startMinute)).second(0);
	let targetDay = today;
	// console.log(targetDay.subtract(2, "day"));
	// 1日ずつ戻りながら、放送日であるかをチェック
	for (let i = 0; i < 6; i++) {
		targetDay = today.subtract(i, "day");
		const dayOfWeekName: keyof DayOfWeek = index2DayOfWeek[targetDay.day()]
		// console.log(`[${title}]${targetDay.format("YYYY/MM/DD HH:mm")} [${dayOfWeekName}] i = ${-i}, day = ${targetDay.day()}, dayOfWeekName = ${dayOfWeekName}`);
		if (dayOfWeek[dayOfWeekName] === true) {
			if (i === 0) {
				// 今日が放送日の場合は、放送開始後であるかをチェック
				if (today.isSameOrAfter(targetDay)) {
					break;
				}
			} else {
				break;
			}
		}
	}

	// 10時より前の場合は、時刻の先頭に"0"をつける
	const startHHMM = start.length === 4 ? "0" + start.replace(":", "") : start.replace(":", "");
	const lastBroadcastStartTime = targetDay.format("YYYYMMDD") + startHHMM + "00";
	const radikoHref = "https://radiko.jp/#!/ts/" + callSign2RadikoSign[broadcast] + "/" + lastBroadcastStartTime;
	return (
		<div className="flex flex-col bg-white border rounded-xl p-4 md:p-5 dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7] shadow-lg">
			<div className="grid grid-cols-12">
				<div className="col-span-10">
					<h3 className="text-lg font-bold text-gray-800 dark:text-white">
						{title}
					</h3>
					<p className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-500">
						{broadcast}  {
							dayOfWeek.monday ? <span>月</span> : <span className="text-slate-300">月</span>
						} {
							dayOfWeek.tuesday ? <span>火</span> : <span className="text-slate-300">火</span>
						} {
							dayOfWeek.wednesday ? <span>水</span> : <span className="text-slate-300">水</span>
						} {
							dayOfWeek.thursday ? <span>木</span> : <span className="text-slate-300">木</span>
						} {
							dayOfWeek.friday ? <span>金</span> : <span className="text-slate-300">金</span>
						} {
							dayOfWeek.saturday ? <span>土</span> : <span className="text-slate-300">土</span>
						} {
							dayOfWeek.sunday ? <span>日</span> : <span className="text-slate-300">日</span>
						}  {start}～{end}
					</p>
					<p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
						パーソナリティ：{personality}
					</p>
				</div>
				<div className="col-span-2">
					<a href={radikoHref} target="_blank" rel="noopener noreferrer">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-sky-500">
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
						</svg>
					</a>
					<span className="text-sky-500 text-sm">radikoで聴く</span>
				</div>
			</div>
		</div>
	);
}
