import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
	AnnualTarget,
	CompanyTargetManagement,
	SeasonalWeights,
	AllocationMethod,
	QuarterlyTarget,
} from "@/types/target-types";
import { round1 } from "@/utils/numberUtils";
import {
	allocateProRata,
	allocateSeasonalByWeights,
	allocateMonthlyBudgetsFromQuarters,
	validateSeasonalWeights,
	normalizeSeasonalWeights,
} from "@/utils/allocationService";
import { recalcQuarterlyTargets, calcYTD } from "@/utils/aggregationService";
import { upsertCompanyTarget, findTargetIndex } from "@/utils/storeUtils";

interface TargetState {
	// State
	companyTargets: { [companyId: string]: CompanyTargetManagement };
	seasonalWeights: SeasonalWeights; // 계절 가중치 설정

	// Actions - 계절 가중치 설정
	setSeasonalWeights: (weights: SeasonalWeights) => void;

	// Actions - 목표 설정
	setAnnualTarget: (
		companyId: string,
		year: number,
		totalBudget: number,
		method: AllocationMethod
	) => void;

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

	// Actions - YTD 재계산
	recalculateYTD: (
		companyId: string,
		year: number,
		currentMonth: number
	) => void;

	// Getters
	getAnnualTarget: (companyId: string, year: number) => AnnualTarget | null;
	getQuarterlyProgress: (
		companyId: string,
		year: number,
		quarter: 1 | 2 | 3 | 4
	) => QuarterlyTarget | null;

	// 초기화
	reset: () => void;
}

// 기본 계절 가중치
const defaultSeasonalWeights: SeasonalWeights = {
	1: 1.3, // 1월 - 난방 (30% 증가)
	2: 1.2, // 2월 - 난방
	3: 1.1, // 3월 - 난방
	4: 0.9, // 4월 - 봄
	5: 0.9, // 5월 - 봄
	6: 1.2, // 6월 - 냉방 시작
	7: 1.4, // 7월 - 냉방 (40% 증가)
	8: 1.4, // 8월 - 냉방 (40% 증가)
	9: 1.1, // 9월 - 가을
	10: 0.9, // 10월 - 가을
	11: 1.2, // 11월 - 난방 시작
	12: 1.3, // 12월 - 난방
};

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

				setSeasonalWeights: (weights) => {
					// 입력 검증 및 정규화 적용
					if (!validateSeasonalWeights(weights)) {
						console.warn(
							"Invalid seasonal weights provided, using default weights"
						);
						return;
					}
					const normalizedWeights = normalizeSeasonalWeights(weights);
					set({ seasonalWeights: normalizedWeights as SeasonalWeights });
				},

				setAnnualTarget: (companyId, year, totalBudget, method) => {
					const state = get();

					// 분기별 목표 자동 배분
					const quarterlyTargets =
						method === "seasonal"
							? allocateSeasonalByWeights(totalBudget, state.seasonalWeights)
							: allocateProRata(totalBudget);

					// 월별 예산 배분
					const monthlyEmissions = allocateMonthlyBudgetsFromQuarters(
						quarterlyTargets,
						year
					);

					const newAnnualTarget: AnnualTarget = {
						year,
						totalBudget,
						allocationMethod: method,
						quarterlyTargets,
						monthlyEmissions,
						ytdActual: 0,
						ytdBudget: 0,
						ytdVariance: 0,
					};

					set(upsertCompanyTarget(state, companyId, newAnnualTarget));
				},

				loadAnnualTarget: (companyId, target) => {
					const state = get();

					// 월별 실적 기반으로 분기별 실적 재계산
					const quarterlyTargets = recalcQuarterlyTargets(
						target.quarterlyTargets,
						target.monthlyEmissions
					);

					// YTD 계산
					const currentMonth = new Date().getMonth() + 1;
					const ytd = calcYTD(target.monthlyEmissions, currentMonth);

					const loadedTarget: AnnualTarget = {
						...target,
						quarterlyTargets,
						...ytd,
					};

					set(upsertCompanyTarget(state, companyId, loadedTarget));
				},

				updateQuarterlyTarget: (companyId, year, quarter, budget) => {
					const state = get();
					const companyTarget = state.companyTargets[companyId];
					if (!companyTarget) return;

					const targetIndex = findTargetIndex(companyTarget, year);
					if (targetIndex < 0) return;

					const annualTarget = companyTarget.targets[targetIndex];
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

					// 월별 예산 재계산
					const monthlyEmissions = allocateMonthlyBudgetsFromQuarters(
						quarterlyTargets,
						year
					);

					// 기존 actual 값 유지
					const updatedMonthlyEmissions = monthlyEmissions.map((newMe) => {
						const existingMe = annualTarget.monthlyEmissions.find(
							(me) => me.month === newMe.month
						);
						return existingMe ? { ...newMe, actual: existingMe.actual } : newMe;
					});

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
					const companyTarget = state.companyTargets[companyId];
					if (!companyTarget) return;

					const targetIndex = findTargetIndex(companyTarget, year);
					if (targetIndex < 0) return;

					const annualTarget = companyTarget.targets[targetIndex];
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

					// 분기별 실적 재계산
					const quarterlyTargets = recalcQuarterlyTargets(
						annualTarget.quarterlyTargets,
						monthlyEmissions
					);

					// YTD 재계산
					const currentMonth = new Date().getMonth() + 1;
					const ytd = calcYTD(monthlyEmissions, currentMonth);

					const updatedTarget: AnnualTarget = {
						...annualTarget,
						quarterlyTargets,
						monthlyEmissions,
						...ytd,
					};

					set(upsertCompanyTarget(state, companyId, updatedTarget));
				},

				recalculateYTD: (companyId, year, currentMonth) => {
					const state = get();
					const companyTarget = state.companyTargets[companyId];
					if (!companyTarget) return;

					const targetIndex = findTargetIndex(companyTarget, year);
					if (targetIndex < 0) return;

					const annualTarget = companyTarget.targets[targetIndex];
					const ytd = calcYTD(annualTarget.monthlyEmissions, currentMonth);

					const updatedTarget: AnnualTarget = {
						...annualTarget,
						...ytd,
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

				reset: () => {
					set({
						companyTargets: {},
						seasonalWeights: defaultSeasonalWeights,
					});
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
