import { useEffect, useCallback, useRef } from "react";
import {
	allocateSeasonalByWeights,
	convertMonthlyToQuarterlyBudgets,
	calculateTotalMonthlyBudget,
	calculateTotalQuarterlyBudget,
	calculateYtdVariance,
} from "@/utils/allocateBudget";
import {
	SeasonalWeights,
	MonthlyEmission,
	QuarterlyTarget,
} from "@/types/target-types";
import { fetchBudgetAllocation, saveBudgetAllocation } from "@/lib/api";
import { useTargetStore } from "@/store/targetStore";

/**
 * 예산 할당 계산 파라미터 인터페이스
 */
export interface BudgetAllocationParams {
	companyId: string;
	totalBudget: number;
	weights: SeasonalWeights;
	year: number;
	ytdActual?: number;
}

/**
 * 예산 할당 계산 결과 인터페이스
 */
export interface BudgetAllocationResult {
	monthlyBudgets: MonthlyEmission[];
	quarterlyTargets: QuarterlyTarget[];
	totalMonthlyBudget: number;
	totalQuarterlyBudget: number;
	ytdBudget: number;
	ytdVariance: number;
}

/**
 * 예산 할당 관리를 위한 커스텀 훅
 *
 * API를 통해 예산 할당 데이터를 조회하고 저장하며,
 * 로딩 상태와 에러 처리를 포함합니다.
 *
 * @param params - 예산 할당 관리에 필요한 파라미터
 * @returns 예산 할당 데이터와 관련 함수들
 */
export function useBudgetAllocation({
	companyId,
	totalBudget,
	weights,
	year,
	ytdActual = 0,
}: BudgetAllocationParams) {
	// 스토어에서 필요한 값만 셀렉터로 구독 (타입 명시 및 shallow 비교 적용)
	const data = useTargetStore((state) =>
		state.getBudgetAllocation(companyId, year)
	);
	const loading = useTargetStore(
		(state) => state.budgetLoading[`${companyId}-${year}`] || false
	);
	const error = useTargetStore(
		(state) => state.budgetErrors[`${companyId}-${year}`] || null
	);

	// 액션 함수들 별도로 구독
	const setBudgetAllocation = useTargetStore(
		(state) => state.setBudgetAllocation
	);
	const setBudgetLoading = useTargetStore((state) => state.setBudgetLoading);
	const setBudgetError = useTargetStore((state) => state.setBudgetError);

	// 예산 할당 데이터 계산 함수
	const calculateBudgetAllocation = useCallback((): BudgetAllocationResult => {
		// 1. 월별 예산 계산 (가중치 적용)
		const monthlyBudgets = allocateSeasonalByWeights(
			totalBudget,
			weights,
			year
		);

		// 2. 분기별 예산 계산 (월별 예산을 분기별로 변환)
		const quarterlyTargets = convertMonthlyToQuarterlyBudgets(monthlyBudgets);

		// 3. 월별 예산 총합 계산
		const totalMonthlyBudget = calculateTotalMonthlyBudget(monthlyBudgets);

		// 4. 분기별 예산 총합 계산 (ytdBudget)
		const totalQuarterlyBudget =
			calculateTotalQuarterlyBudget(quarterlyTargets);
		const ytdBudget = totalQuarterlyBudget;

		// 5. YTD 분산 계산 (ytdVariance)
		const ytdVariance = calculateYtdVariance(ytdBudget, ytdActual);

		return {
			monthlyBudgets,
			quarterlyTargets,
			totalMonthlyBudget,
			totalQuarterlyBudget,
			ytdBudget,
			ytdVariance,
		};
	}, [totalBudget, weights, year, ytdActual]);

	// 실행 횟수 제한을 위한 ref
	const hasLoaded = useRef(false);

	// 예산 할당 데이터 로드 (의존성에서 store 제거)
	const loadBudgetAllocation = useCallback(async () => {
		setBudgetLoading(companyId, year, true);
		setBudgetError(companyId, year, null);

		try {
			// API에서 저장된 데이터 조회
			const savedData = await fetchBudgetAllocation(companyId, year);

			if (savedData) {
				// 저장된 데이터가 있으면 스토어에 저장
				setBudgetAllocation(companyId, year, savedData);
			} else {
				// 저장된 데이터가 없으면 새로 계산해서 스토어에 저장
				const calculatedData = calculateBudgetAllocation();
				setBudgetAllocation(companyId, year, calculatedData);
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "데이터 로드 실패";
			setBudgetError(companyId, year, errorMessage);
			// 에러 시에도 기본 계산된 데이터를 스토어에 저장
			const calculatedData = calculateBudgetAllocation();
			setBudgetAllocation(companyId, year, calculatedData);
		} finally {
			setBudgetLoading(companyId, year, false);
		}
	}, [
		companyId,
		year,
		calculateBudgetAllocation,
		setBudgetAllocation,
		setBudgetLoading,
		setBudgetError,
	]);

	// 예산 할당 데이터 저장 (의존성에서 store 제거)
	const saveBudgetAllocationData = useCallback(
		async (budgetData: BudgetAllocationResult) => {
			setBudgetLoading(companyId, year, true);
			setBudgetError(companyId, year, null);

			try {
				const savedData = await saveBudgetAllocation(
					companyId,
					year,
					budgetData
				);
				setBudgetAllocation(companyId, year, savedData);
				return savedData;
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "저장 실패";
				setBudgetError(companyId, year, errorMessage);
				throw err; // 호출하는 쪽에서 에러 처리할 수 있도록
			} finally {
				setBudgetLoading(companyId, year, false);
			}
		},
		[companyId, year, setBudgetAllocation, setBudgetLoading, setBudgetError]
	);

	// 초기 데이터 로드 (한 번만 실행하도록 제한)
	useEffect(() => {
		if (hasLoaded.current) return;
		hasLoaded.current = true;
		loadBudgetAllocation();
	}, [loadBudgetAllocation]);

	return {
		data,
		loading,
		error,
		loadBudgetAllocation,
		saveBudgetAllocationData,
		calculateBudgetAllocation, // 필요시 수동 계산도 가능
	};
}
