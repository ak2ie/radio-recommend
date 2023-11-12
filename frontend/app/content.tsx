
"use client"

import * as React from "react";
import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry'
import { createContext } from "react";

export type Program = APIResponseProgram & {
	isSelected: boolean;
};

export type DayOfWeek = {
	"friday": boolean,
	"monday": boolean,
	"saturday": boolean,
	"sunday": boolean,
	"thursday": boolean,
	"tuesday": boolean,
	"wednesday": boolean,
}

type APIResponseProgram = {
	id: number;
	broadcast_call_sign: string;
	day_of_week: DayOfWeek,
	end: string,
	start: string,
	title: string,
	vector: number[],
};

type ProgramContext = {
	programs: Program[];
	setPrograms: (programs: Program[]) => void
}

export function GetPrograms(): Promise<Program[]> {
	return new Promise((resolve, reject) => {
		fetch(process.env.NEXT_PUBLIC_API_BASEURL + "/programs", {
			method: "GET"
		})
			.then(res => res.json())
			.then((programs: APIResponseProgram[]) => {
				const programList = programs.map((p: APIResponseProgram) => (
					{
						id: p.id,
						broadcast_call_sign: p.broadcast_call_sign,
						day_of_week: {
							monday: p.day_of_week.monday,
							tuesday: p.day_of_week.tuesday,
							wednesday: p.day_of_week.wednesday,
							thursday: p.day_of_week.thursday,
							friday: p.day_of_week.friday,
							saturday: p.day_of_week.saturday,
							sunday: p.day_of_week.sunday,
						},
						start: p.start,
						end: p.end,
						title: p.title,
						vector: p.vector,
						isSelected: false
					}
				));

				resolve(programList);
			});
	});
}

const defaultContext: ProgramContext = {
	programs: [] as Program[],
	setPrograms: (programs: Program[]) => {}
}

export const Programs = createContext<ProgramContext>(defaultContext);

export const usePrograms = (): ProgramContext => {
	const [programs, setProgramsState] = React.useState([] as Program[]);
	const setPrograms = React.useCallback((p: Program[]): void => {
		setProgramsState(p);
	}, []);
	return {
		programs,
		setPrograms
	}
}

export default function Content({ children }: {
	children: React.ReactNode
}) {
	const ctx = usePrograms()
	return (
		<Programs.Provider value={ctx}>
			<ThemeRegistry>{children}</ThemeRegistry>
		</Programs.Provider>
	)
}