import { useTargetStore } from "@/store/targetStore";
import { useMemo } from "react";

/**
 * 분기별 진행 상황 Hook
 */
export function useQuarterlyProgress(
	companyId: string,
	year: number,
	quarter: 1 | 2 | 3 | 4
) {
	const store = useTargetStore();

	const quarterlyTarget = store.getQuarterlyProgress(companyId, year, quarter);

	const budgetUsageRate = useMemo(() => {
		if (!quarterlyTarget || quarterlyTarget.budget === 0) return 0;
		// 예산 사용률: 실제 배출량 / 예산 * 100
		return (quarterlyTarget.actual / quarterlyTarget.budget) * 100;
	}, [quarterlyTarget]);

	const isOverBudget = useMemo(() => {
		if (!quarterlyTarget) return false;
		return quarterlyTarget.actual > quarterlyTarget.budget;
	}, [quarterlyTarget]);

	const updateBudget = (budget: number) => {
		store.updateQuarterlyTarget(companyId, year, quarter, budget);
	};

	return {
		quarterlyTarget,
		budgetUsageRate,
		isOverBudget,
		updateBudget,
	};
}
