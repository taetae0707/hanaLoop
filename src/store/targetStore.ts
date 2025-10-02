import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
	AnnualTarget,
	CompanyTargetManagement,
	SeasonalWeights,
	QuarterlyTarget,
	MonthlyEmission,
} from "@/types/target-types";
import { round1 } from "@/utils/numberUtils";
// YTD 계산을 인라인으로 처리하여 복잡성 제거
import { upsertCompanyTarget, findTargetIndex } from "@/utils/storeUtils";
import { defaultSeasonalWeights } from "@/lib/data";
import { BudgetAllocationResult } from "@/hooks/useBudgetAllocation";

// 유틸리티 함수들
const createBudgetKey = (companyId: string, year: number): string =>
	`${companyId}-${year}`;

const calculateYtd = (
	monthlyEmissions: MonthlyEmission[],
	currentMonth?: number
) => {
	const targetMonth = currentMonth || new Date().getMonth() + 1;
	return monthlyEmissions
		.filter((me) => me.month <= targetMonth)
		.reduce(
			(acc, me) => ({
				actual: acc.actual + (me.actual || 0),
				budget: acc.budget + (me.budget || 0),
			}),
			{ actual: 0, budget: 0 }
		);
};

const updateBudgetState = <T>(
	state: TargetState,
	stateKey: keyof TargetState,
	key: string,
	value: T
) => ({
	[stateKey]: {
		...state[stateKey],
		[key]: value,
	},
});

const validateCompanyTarget = (
	companyTargets: { [companyId: string]: CompanyTargetManagement },
	companyId: string
): CompanyTargetManagement | null => {
	const companyTarget = companyTargets[companyId];
	if (!companyTarget) return null;
	return companyTarget;
};

const validateTargetIndex = (
	targets: AnnualTarget[],
	year: number
): { target: AnnualTarget; index: number } | null => {
	const targetIndex = findTargetIndex(
		{ targets } as CompanyTargetManagement,
		year
	);
	if (targetIndex < 0) return null;
	return { target: targets[targetIndex], index: targetIndex };
};

interface TargetState {
	// State
	companyTargets: { [companyId: string]: CompanyTargetManagement };
	seasonalWeights: SeasonalWeights; // 계절 가중치 설정

	// 예산 할당 관련 상태
	budgetAllocations: { [key: string]: BudgetAllocationResult }; // "companyId-year" 형태의 키
	budgetLoading: { [key: string]: boolean }; // 로딩 상태
	budgetErrors: { [key: string]: string | null }; // 에러 상태

	// Actions - 예산 할당 관리
	setBudgetAllocation: (
		companyId: string,
		year: number,
		data: BudgetAllocationResult
	) => void;
	setBudgetLoading: (companyId: string, year: number, loading: boolean) => void;
	setBudgetError: (
		companyId: string,
		year: number,
		error: string | null
	) => void;
	getBudgetAllocation: (
		companyId: string,
		year: number
	) => BudgetAllocationResult | null;

	// Actions - 초기 데이터 로드 (더미 데이터용)
	loadAnnualTarget: (companyId: string, target: AnnualTarget) => void;

	// Actions - 분기 목표 수정 (담당자가 직접 수정 가능)
	updateQuarterlyTarget: (
		companyId: string,
		year: number,
		quarter: 1 | 2 | 3 | 4,
		budget: number
	) => void;

	// Actions - 월별 실적 기록
	recordMonthlyEmission: (
		companyId: string,
		year: number,
		month: number,
		actual: number
	) => void;

	// Getters
	getAnnualTarget: (companyId: string, year: number) => AnnualTarget | null;
	getQuarterlyProgress: (
		companyId: string,
		year: number,
		quarter: 1 | 2 | 3 | 4
	) => QuarterlyTarget | null;
}

/**
 * 목표 관리를 위한 전역 상태 스토어
 *
 * - 연간 목표 설정 및 분기별 배분
 * - 월별 실적 기록
 * - YTD 누적 계산
 */
export const useTargetStore = create<TargetState>()(
	devtools(
		persist(
			(set, get) => ({
				companyTargets: {},
				seasonalWeights: defaultSeasonalWeights,

				// 예산 할당 관련 초기 상태
				budgetAllocations: {},
				budgetLoading: {},
				budgetErrors: {},

				// 예산 할당 관련 액션들
				setBudgetAllocation: (companyId, year, data) => {
					const key = createBudgetKey(companyId, year);
					set((state) =>
						updateBudgetState(state, "budgetAllocations", key, data)
					);
				},

				setBudgetLoading: (companyId, year, loading) => {
					const key = createBudgetKey(companyId, year);
					set((state) =>
						updateBudgetState(state, "budgetLoading", key, loading)
					);
				},

				setBudgetError: (companyId, year, error) => {
					const key = createBudgetKey(companyId, year);
					set((state) => updateBudgetState(state, "budgetErrors", key, error));
				},

				getBudgetAllocation: (companyId, year) => {
					const key = createBudgetKey(companyId, year);
					return get().budgetAllocations[key] || null;
				},

				loadAnnualTarget: (companyId, target) => {
					const state = get();
					const ytd = calculateYtd(target.monthlyEmissions);

					const loadedTarget: AnnualTarget = {
						...target,
						ytdActual: round1(ytd.actual),
						ytdBudget: round1(ytd.budget),
						ytdVariance: round1(ytd.actual - ytd.budget),
					};

					set(upsertCompanyTarget(state, companyId, loadedTarget));
				},

				updateQuarterlyTarget: (companyId, year, quarter, budget) => {
					const state = get();
					const companyTarget = validateCompanyTarget(
						state.companyTargets,
						companyId
					);
					if (!companyTarget) return;

					const targetValidation = validateTargetIndex(
						companyTarget.targets,
						year
					);
					if (!targetValidation) return;

					const { target: annualTarget } = targetValidation;
					const quarterlyTargets = [...annualTarget.quarterlyTargets];
					const quarterIndex = quarterlyTargets.findIndex(
						(qt) => qt.quarter === quarter
					);

					if (quarterIndex < 0) return;

					// 분기 목표 업데이트
					quarterlyTargets[quarterIndex] = {
						...quarterlyTargets[quarterIndex],
						budget,
						remaining: round1(budget - quarterlyTargets[quarterIndex].actual),
					};

					// 월별 예산 재계산 (분기별 예산을 3개월로 균등 분배)
					const updatedMonthlyEmissions = annualTarget.monthlyEmissions.map(
						(me) => {
							const quarterIndex = Math.floor((me.month - 1) / 3);
							const quarterlyBudget = quarterlyTargets[quarterIndex].budget;
							const monthlyBudget = round1(quarterlyBudget / 3);

							return {
								...me,
								budget: monthlyBudget,
							};
						}
					);

					// 새 totalBudget 계산
					const newTotalBudget = quarterlyTargets.reduce(
						(sum, qt) => sum + qt.budget,
						0
					);

					const updatedTarget: AnnualTarget = {
						...annualTarget,
						totalBudget: round1(newTotalBudget),
						quarterlyTargets,
						monthlyEmissions: updatedMonthlyEmissions,
					};

					set(upsertCompanyTarget(state, companyId, updatedTarget));
				},

				recordMonthlyEmission: (companyId, year, month, actual) => {
					const state = get();
					const companyTarget = validateCompanyTarget(
						state.companyTargets,
						companyId
					);
					if (!companyTarget) return;

					const targetValidation = validateTargetIndex(
						companyTarget.targets,
						year
					);
					if (!targetValidation) return;

					const { target: annualTarget } = targetValidation;
					const monthlyEmissions = [...annualTarget.monthlyEmissions];
					const monthIndex = monthlyEmissions.findIndex(
						(me) => me.month === month
					);

					if (monthIndex < 0) return;

					// 월별 실적 업데이트
					monthlyEmissions[monthIndex] = {
						...monthlyEmissions[monthIndex],
						actual,
					};

					// YTD 재계산
					const ytd = calculateYtd(monthlyEmissions);

					const updatedTarget: AnnualTarget = {
						...annualTarget,
						monthlyEmissions,
						ytdActual: round1(ytd.actual),
						ytdBudget: round1(ytd.budget),
						ytdVariance: round1(ytd.actual - ytd.budget),
					};

					set(upsertCompanyTarget(state, companyId, updatedTarget));
				},

				getAnnualTarget: (companyId, year) => {
					const companyTarget = get().companyTargets[companyId];
					if (!companyTarget) return null;

					return companyTarget.targets.find((t) => t.year === year) || null;
				},

				getQuarterlyProgress: (companyId, year, quarter) => {
					const annualTarget = get().getAnnualTarget(companyId, year);
					if (!annualTarget) return null;

					return (
						annualTarget.quarterlyTargets.find(
							(qt) => qt.quarter === quarter
						) || null
					);
				},
			}),
			{
				name: "target-storage",
				partialize: (state) => ({
					companyTargets: state.companyTargets,
					seasonalWeights: state.seasonalWeights,
				}),
			}
		),
		{
			name: "TargetStore",
		}
	)
);
