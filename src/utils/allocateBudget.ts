import {
	QuarterlyTarget,
	SeasonalWeights,
	MonthlyEmission,
} from "@/types/target-types";
import { round1, rangeMonthsOfQuarter } from "./numberUtils";

/**
 * 균등 분배 (pro-rata) - 단순히 연간 예산을 12개월로 균등하게 나눔
 * @param totalBudget 연간 총 예산
 * @param quarters 분기 수 (기본값: 4)
 * @returns 분기별 목표 배열
 */
export function allocateProRata(
	totalBudget: number,
	quarters: number = 4
): QuarterlyTarget[] {
	// 월별 예산 = 연간 예산 / 12
	const monthlyBudget = round1(totalBudget / 12);

	// 분기별 예산 = 월별 예산 * 3
	const quarterlyBudget = round1(monthlyBudget * 3);

	// 분기에 동일한 예산 할당
	return Array(quarters)
		.fill(null)
		.map((_, i) => ({
			quarter: (i + 1) as 1 | 2 | 3 | 4,
			budget: quarterlyBudget,
			actual: 0,
			remaining: quarterlyBudget,
		}));
}

/**
 * 가중치 기반 분배 - 월별 가중치를 적용하여 각 월별 예산 계산
 * @param totalBudget 연간 총 예산
 * @param weights 월별 가중치 (1-12월)
 * @param year 연도
 * @returns 월별 예산 배열
 */
export function allocateSeasonalByWeights(
	totalBudget: number,
	weights: SeasonalWeights,
	year: number
): MonthlyEmission[] {
	// 월별 기본 예산 = 연간 예산 / 12
	const monthlyBaseBudget = totalBudget / 12;

	// 각 월별 예산 계산 (가중치 적용)
	const monthlyBudgets: MonthlyEmission[] = [];

	for (let month = 1; month <= 12; month++) {
		const weightedBudget = round1(monthlyBaseBudget * (weights[month] || 1));
		monthlyBudgets.push({
			year,
			month: month as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
			budget: weightedBudget,
			actual: 0,
		});
	}

	return monthlyBudgets;
}

/**
 * 월별 예산을 분기별 예산으로 변환
 * @param monthlyBudgets 월별 예산 배열
 * @returns 분기별 목표 배열
 */
export function convertMonthlyToQuarterlyBudgets(
	monthlyBudgets: MonthlyEmission[]
): QuarterlyTarget[] {
	const quarterlyTargets: QuarterlyTarget[] = [];

	// 각 분기별로 월별 예산 합산
	for (let quarter = 1; quarter <= 4; quarter++) {
		const startMonth = (quarter - 1) * 3 + 1;
		const endMonth = quarter * 3;

		// 해당 분기의 월별 예산 합산
		const quarterlyBudget = monthlyBudgets
			.filter((month) => month.month >= startMonth && month.month <= endMonth)
			.reduce((sum, month) => sum + month.budget, 0);

		quarterlyTargets.push({
			quarter: quarter as 1 | 2 | 3 | 4,
			budget: round1(quarterlyBudget),
			actual: 0,
			remaining: round1(quarterlyBudget),
		});
	}

	return quarterlyTargets;
}

/**
 * 월별 예산의 총합 계산
 * @param monthlyBudgets 월별 예산 배열
 * @returns 총 예산 합계
 */
export function calculateTotalMonthlyBudget(
	monthlyBudgets: MonthlyEmission[]
): number {
	return round1(monthlyBudgets.reduce((sum, month) => sum + month.budget, 0));
}

/**
 * 분기별 예산의 총합 계산 (ytdBudget용)
 */
export function calculateTotalQuarterlyBudget(
	quarterlyTargets: QuarterlyTarget[]
): number {
	return round1(
		quarterlyTargets.reduce((sum, quarter) => sum + quarter.budget, 0)
	);
}

/**
 * YTD 예산과 실제값의 차이 계산 (ytdVariance용)

 */
export function calculateYtdVariance(
	ytdBudget: number,
	ytdActual: number
): number {
	return round1(ytdBudget - ytdActual);
}
