import { useTargetStore } from "@/store/targetStore";
import { useMemo } from "react";

/**
 * 월별 배출 실적 관리 Hook
 */
export function useMonthlyEmission(companyId: string, year: number) {
	const store = useTargetStore();

	const annualTarget = store.getAnnualTarget(companyId, year);

	const monthlyEmissions = useMemo(() => {
		return annualTarget?.monthlyEmissions || [];
	}, [annualTarget]);

	const recordEmission = (month: number, actual: number) => {
		store.recordMonthlyEmission(companyId, year, month, actual);
	};

	return {
		monthlyEmissions,
		recordEmission,
	};
}
