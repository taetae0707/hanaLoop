import { MonthlyEmission } from "@/types/target-types";

/**
 * YTD (Year-To-Date) 누적 계산
 */
export function calculateYTD(
	monthlyEmissions: MonthlyEmission[],
	currentMonth: number
): { ytdActual: number; ytdBudget: number; ytdVariance: number } {
	const ytdEmissions = monthlyEmissions
		.filter((me) => me.month <= currentMonth)
		.reduce(
			(acc, me) => ({
				actual: acc.actual + me.actual,
				budget: acc.budget + me.budget,
			}),
			{ actual: 0, budget: 0 }
		);

	return {
		ytdActual: Math.round(ytdEmissions.actual * 10) / 10,
		ytdBudget: Math.round(ytdEmissions.budget * 10) / 10,
		ytdVariance:
			Math.round((ytdEmissions.actual - ytdEmissions.budget) * 10) / 10,
	};
}
