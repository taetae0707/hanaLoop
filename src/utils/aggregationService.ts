import { QuarterlyTarget } from "@/types/target-types";
import { round1, rangeMonthsOfQuarter } from "./numberUtils";

export function sumQuarterActual(
	monthly: { month: number; actual: number }[],
	q: 1 | 2 | 3 | 4
): number {
	const { start, end } = rangeMonthsOfQuarter(q);
	const total = monthly
		.filter((m) => m.month >= start && m.month <= end)
		.reduce((acc, v) => acc + (Number.isFinite(v.actual) ? v.actual : 0), 0);
	return round1(total);
}

export function recalcQuarterlyTargets(
	quarterlyTargets: QuarterlyTarget[],
	monthly: { month: number; actual: number }[]
): QuarterlyTarget[] {
	return quarterlyTargets.map((qt) => {
		const actual = sumQuarterActual(monthly, qt.quarter);
		return { ...qt, actual, remaining: round1(qt.budget - actual) };
	});
}

export function calcYTD(
	monthly: { month: number; budget: number; actual: number }[],
	currentMonth: number
): { ytdActual: number; ytdBudget: number; ytdVariance: number } {
	const acc = monthly
		.filter((m) => m.month >= 1 && m.month <= currentMonth)
		.reduce(
			(r, v) => {
				r.b += Number.isFinite(v.budget) ? v.budget : 0;
				r.a += Number.isFinite(v.actual) ? v.actual : 0;
				return r;
			},
			{ a: 0, b: 0 }
		);

	const ytdBudget = round1(acc.b);
	const ytdActual = round1(acc.a);
	return { ytdBudget, ytdActual, ytdVariance: round1(ytdActual - ytdBudget) };
}
