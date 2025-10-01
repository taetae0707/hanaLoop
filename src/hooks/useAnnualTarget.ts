import { useTargetStore } from "@/store/targetStore";
import { AllocationMethod } from "@/types/target-types";
import { useMemo } from "react";

/**
 * 연간 목표 관리 Hook
 */
export function useAnnualTarget(companyId: string, year: number) {
	const store = useTargetStore();

	const annualTarget = store.getAnnualTarget(companyId, year);

	const setTarget = (totalBudget: number, method: AllocationMethod) => {
		store.setAnnualTarget(companyId, year, totalBudget, method);
	};

	const ytd = useMemo(() => {
		if (!annualTarget) return null;
		return {
			actual: annualTarget.ytdActual,
			budget: annualTarget.ytdBudget,
			variance: annualTarget.ytdVariance,
		};
	}, [annualTarget]);

	const achievementRate = useMemo(() => {
		if (!annualTarget || annualTarget.ytdBudget === 0) return 0;
		return (annualTarget.ytdActual / annualTarget.ytdBudget) * 100;
	}, [annualTarget]);

	return {
		annualTarget,
		setTarget,
		ytd,
		achievementRate,
	};
}
