import * as React from "react";

export default function RadioCard({
	title,
	broadcast,
	dayOfWeek,
	start,
	end,
	personality,
	selected,
	id,
	disabled
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
	dayOfWeek: string;
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
	/**
	 * 選択有無
	 */
	selected:  (index: number, value: boolean) => void;
	/**
	 * 番組ID
	 */
	id: number,
	/**
	 * 操作可否
	 */
	disabled: boolean,
}) {
	const [isSelectedState, setSelected] = React.useState(false);
	const handleClick = () => {
		if (disabled) {
			return;
		}
		setSelected(!isSelectedState);
		selected(id, !isSelectedState);
	};
	return (
		<div
			className={
				"flex flex-col bg-white border rounded-xl p-4 md:p-5 dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7] hover:cursor-pointer " +
				(isSelectedState
					? "shadow-inner"
					: "shadow-lg")
			}
			onClick={handleClick}
		>
			<div className="flex flex-row justify-between">
				<div className="">
					<h3 className="text-lg font-bold text-gray-800 dark:text-white">
						{title}
					</h3>
					<p className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-500">
						{broadcast} {dayOfWeek} {start}～{end}
					</p>
					<p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
						パーソナリティ：{personality}

					</p>
				</div>
				<div className="">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
						strokeWidth={1.5} stroke="currentColor" className={"w-20 h-20 " + ( isSelectedState ? "text-cyan-500" : "text-slate-300")}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>
		</div>
	);
}
