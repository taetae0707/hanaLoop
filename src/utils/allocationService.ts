import { QuarterlyTarget, SeasonalWeights } from "@/types/target-types";
import { round1, rangeMonthsOfQuarter } from "./numberUtils";

/** 1~12월 키가 모두 존재하고 음수 없는지 */
export function validateSeasonalWeights(weights: SeasonalWeights): boolean {
	for (let m = 1 as const; m <= 12; m++) {
		const v = weights[m];
		if (typeof v !== "number" || !Number.isFinite(v) || v < 0) return false;
	}
	return true;
}

/** 합이 0 또는 비정상일 때 균등(1)으로 대체하고 정규화 */
export function normalizeSeasonalWeights(
	weights: SeasonalWeights
): Record<number, number> {
	const total = Object.values(weights).reduce((a, b) => a + b, 0);
	if (!Number.isFinite(total) || total <= 0) {
		const uniform: Record<number, number> = {};
		for (let m = 1; m <= 12; m++) uniform[m] = 1;
		return uniform;
	}
	const normalized: Record<number, number> = {};
	for (let m = 1; m <= 12; m++) normalized[m] = weights[m] / total;
	return normalized;
}

/** 균등(pro-rata) 분기 배분 */
export function allocateProRata(totalBudget: number): QuarterlyTarget[] {
	const perQuarter = round1(totalBudget / 4);
	return [1, 2, 3, 4].map((q) => ({
		quarter: q as 1 | 2 | 3 | 4,
		budget: perQuarter,
		actual: 0,
		remaining: perQuarter, // (파생값 저장을 줄일 거면 이후 제거)
	}));
}

/** 계절 가중치 기반 분기 배분 */
export function allocateSeasonalByWeights(
	totalBudget: number,
	weights: SeasonalWeights
): QuarterlyTarget[] {
	const valid = validateSeasonalWeights(weights);
	const w = normalizeSeasonalWeights(valid ? weights : ({} as any));

	const monthly: Record<number, number> = {};
	for (let m = 1; m <= 12; m++) monthly[m] = totalBudget * w[m];

	const quarterly: Record<1 | 2 | 3 | 4, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
	([1, 2, 3, 4] as const).forEach((q) => {
		const { start, end } = rangeMonthsOfQuarter(q);
		let sum = 0;
		for (let m = start; m <= end; m++) sum += monthly[m];
		quarterly[q] = round1(sum);
	});

	return ([1, 2, 3, 4] as const).map((q) => {
		const budget = round1(quarterly[q]);
		return { quarter: q, budget, actual: 0, remaining: budget };
	});
}

/** 분기 타겟을 월별(3개월)로 균등 분배 */
export function allocateMonthlyBudgetsFromQuarters(
	quarterlyTargets: QuarterlyTarget[],
	year: number
): { year: number; month: number; budget: number; actual: number }[] {
	const result: {
		year: number;
		month: number;
		budget: number;
		actual: number;
	}[] = [];
	for (const qt of quarterlyTargets) {
		const { start, end } = rangeMonthsOfQuarter(qt.quarter);
		const perMonth = round1(qt.budget / 3);
		for (let m = start; m <= end; m++) {
			result.push({ year, month: m, budget: perMonth, actual: 0 });
		}
	}
	return result;
}
