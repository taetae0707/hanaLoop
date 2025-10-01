import { QuarterlyTarget, SeasonalWeights } from "@/types/target-types";
import { round1, rangeMonthsOfQuarter } from "./numberUtils";

/**
 * 균등 분배 (pro-rata) - 단순히 연간 예산을 12개월로 균등하게 나눔
 * @param totalBudget 연간 총 예산
 * @returns 분기별 목표 배열
 */
export function allocateProRata(totalBudget: number): QuarterlyTarget[] {
	// 월별 예산 = 연간 예산 / 12
	const monthlyBudget = round1(totalBudget / 12);

	// 분기별 예산 = 월별 예산 * 3
	const quarterlyBudget = round1(monthlyBudget * 3);

	// 4개 분기에 동일한 예산 할당
	return [1, 2, 3, 4].map((q) => ({
		quarter: q as 1 | 2 | 3 | 4,
		budget: quarterlyBudget,
		actual: 0,
		remaining: quarterlyBudget,
	}));
}

/**
 * 가중치 기반 분배 - 월별 가중치를 적용하여 분배
 * @param totalBudget 연간 총 예산
 * @param weights 월별 가중치 (1-12월)
 * @returns 분기별 목표 배열
 */
export function allocateSeasonalByWeights(
	totalBudget: number,
	weights: SeasonalWeights
): QuarterlyTarget[] {
	// 1. 기본 월별 예산 계산 (연간 예산 / 12)
	const baseMonthlyBudget = totalBudget / 12;

	// 2. 월별 예산에 가중치 적용
	const monthlyBudgets: Record<number, number> = {};
	for (let month = 1; month <= 12; month++) {
		const weight = weights[month] || 1; // 가중치가 없으면 기본값 1
		monthlyBudgets[month] = round1(baseMonthlyBudget * weight);
	}

	// 3. 분기별로 월별 예산 합산
	const quarterlyTargets: QuarterlyTarget[] = [];
	for (let quarter = 1; quarter <= 4; quarter++) {
		const { start, end } = rangeMonthsOfQuarter(quarter as 1 | 2 | 3 | 4);

		// 해당 분기의 3개월 예산 합산
		let quarterlyBudget = 0;
		for (let month = start; month <= end; month++) {
			quarterlyBudget += monthlyBudgets[month];
		}

		quarterlyBudget = round1(quarterlyBudget);

		quarterlyTargets.push({
			quarter: quarter as 1 | 2 | 3 | 4,
			budget: quarterlyBudget,
			actual: 0,
			remaining: quarterlyBudget,
		});
	}

	return quarterlyTargets;
}

/**
 * 분기별 목표를 월별 예산으로 변환
 * @param quarterlyTargets 분기별 목표 배열
 * @param year 연도
 * @returns 월별 배출 데이터 배열
 */
export function allocateMonthlyBudgetsFromQuarters(
	quarterlyTargets: QuarterlyTarget[],
	year: number
): { year: number; month: number; budget: number; actual: number }[] {
	const monthlyEmissions = [];

	for (const qt of quarterlyTargets) {
		// 분기별 예산을 3개월에 균등 분배
		const monthlyBudget = round1(qt.budget / 3);

		// 해당 분기의 월 범위
		const { start, end } = rangeMonthsOfQuarter(qt.quarter);

		// 각 월에 대한 데이터 생성
		for (let month = start; month <= end; month++) {
			monthlyEmissions.push({
				year,
				month,
				budget: monthlyBudget,
				actual: 0, // 초기값은 0
			});
		}
	}

	return monthlyEmissions;
}
