import {
	QuarterlyTarget,
	SeasonalWeights,
	MonthlyEmission,
} from "@/types/target-types";

/**
 * Pro-rata 방식: 연간 목표를 균등 배분
 */
export function allocateProRata(
	annualBudget: number,
	quarters: number = 4
): number[] {
	const quarterlyBudget = annualBudget / quarters;
	return Array(quarters).fill(quarterlyBudget);
}

/**
 * Seasonal 방식: 계절 가중치 적용
 */
export function allocateSeasonal(
	annualBudget: number,
	seasonalWeights: SeasonalWeights
): QuarterlyTarget[] {
	// Q1: 1-3월, Q2: 4-6월, Q3: 7-9월, Q4: 10-12월
	const quarterWeights = [
		[1, 2, 3], // Q1 (난방)
		[4, 5, 6], // Q2
		[7, 8, 9], // Q3 (냉방)
		[10, 11, 12], // Q4 (난방)
	].map(
		(months) =>
			months.reduce((sum, m) => sum + (seasonalWeights[m] || 1), 0) / 3
	);

	const totalWeight = quarterWeights.reduce((a, b) => a + b, 0);

	return quarterWeights.map((weight, i) => ({
		quarter: (i + 1) as 1 | 2 | 3 | 4,
		budget: Math.round(((annualBudget * weight) / totalWeight) * 10) / 10,
		actual: 0,
		remaining: Math.round(((annualBudget * weight) / totalWeight) * 10) / 10,
	}));
}

/**
 * 월별 예산 배분 (분기 예산을 월별로 균등 배분)
 */
export function allocateMonthlyBudgets(
	quarterlyTargets: QuarterlyTarget[],
	year: number
): MonthlyEmission[] {
	const monthlyEmissions: MonthlyEmission[] = [];

	quarterlyTargets.forEach((qt) => {
		const monthsInQuarter = 3;
		const monthlyBudget = Math.round((qt.budget / monthsInQuarter) * 10) / 10;
		const startMonth = (qt.quarter - 1) * 3 + 1;

		for (let i = 0; i < monthsInQuarter; i++) {
			monthlyEmissions.push({
				year,
				month: startMonth + i,
				actual: 0,
				budget: monthlyBudget,
			});
		}
	});

	return monthlyEmissions;
}
