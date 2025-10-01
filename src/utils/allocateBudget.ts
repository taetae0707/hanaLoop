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
 * 가중치 기반 분배 - 월별 가중치를 적용하여 분배
 * @param totalBudget 연간 총 예산
 * @param weights 월별 가중치 (1-12월)
 * @returns 분기별 목표 배열
 */
export function allocateSeasonalByWeights(
	totalBudget: number,
	weights: SeasonalWeights
): QuarterlyTarget[] {
	// Q1: 1-3월, Q2: 4-6월, Q3: 7-9월, Q4: 10-12월
	const quarterWeights = [
		[1, 2, 3], // Q1 (난방)
		[4, 5, 6], // Q2
		[7, 8, 9], // Q3 (냉방)
		[10, 11, 12], // Q4 (난방)
	].map((months) => months.reduce((sum, m) => sum + (weights[m] || 1), 0) / 3);

	const totalWeight = quarterWeights.reduce((a, b) => a + b, 0);

	return quarterWeights.map((weight, i) => ({
		quarter: (i + 1) as 1 | 2 | 3 | 4,
		budget: round1((totalBudget * weight) / totalWeight),
		actual: 0,
		remaining: round1((totalBudget * weight) / totalWeight),
	}));
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
): MonthlyEmission[] {
	const monthlyEmissions: MonthlyEmission[] = [];

	for (const qt of quarterlyTargets) {
		// 분기별 예산을 3개월에 균등 분배
		const monthlyBudget = round1(qt.budget / 3);

		// 해당 분기의 월 범위
		const startMonth = (qt.quarter - 1) * 3 + 1;

		// 각 월에 대한 데이터 생성
		for (let i = 0; i < 3; i++) {
			monthlyEmissions.push({
				year,
				month: startMonth + i,
				budget: monthlyBudget,
				actual: 0, // 초기값은 0
			});
		}
	}

	return monthlyEmissions;
}
