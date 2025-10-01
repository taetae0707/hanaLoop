import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
	AnnualTarget,
	CompanyTargetManagement,
	SeasonalWeights,
	QuarterlyTarget,
} from "@/types/target-types";
import { round1 } from "@/utils/numberUtils";
import { allocateMonthlyBudgetsFromQuarters } from "@/utils/allocateBudget";
// YTD 계산을 인라인으로 처리하여 복잡성 제거
import { upsertCompanyTarget, findTargetIndex } from "@/utils/storeUtils";
import { defaultSeasonalWeights } from "@/lib/data";

interface TargetState {
	// State
	companyTargets: { [companyId: string]: CompanyTargetManagement };
	seasonalWeights: SeasonalWeights; // 계절 가중치 설정

	// Actions - 계절 가중치 설정
	setSeasonalWeights: (weights: SeasonalWeights) => void;

	// Actions - 목표 설정 (나중에 서버 연결 시 사용)
	// setAnnualTarget: (
	// 	companyId: string,
	// 	year: number,
	// 	totalBudget: number,
	// 	method: AllocationMethod
	// ) => void;

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

	// 초기화
	reset: () => void;
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

				setSeasonalWeights: (weights) => {
					// 간단한 검증: 모든 월(1-12)에 대해 가중치가 양수인지 확인
					const isValid =
						Object.keys(weights).length === 12 &&
						Object.values(weights).every((w) => typeof w === "number" && w > 0);

					if (!isValid) {
						console.warn(
							"Invalid seasonal weights provided, using default weights"
						);
						return;
					}

					set({ seasonalWeights: weights });
				},

				// 	//나중에 서버랑 연결하면 사용
				// 	// const newAnnualTarget: AnnualTarget = {
				// 	// 	year,
				// 	// 	totalBudget,
				// 	// 	allocationMethod: method,
				// 	// 	quarterlyTargets,
				// 	// 	monthlyEmissions,
				// 	// 	ytdActual: 0,
				// 	// 	ytdBudget: 0,
				// 	// 	ytdVariance: 0,
				// 	// };

				// 	// set(upsertCompanyTarget(state, companyId, newAnnualTarget));
				// },

				loadAnnualTarget: (companyId, target) => {
					const state = get();
					const currentMonth = new Date().getMonth() + 1;

					// 간단한 YTD 계산 (인라인)
					const ytd = target.monthlyEmissions
						.filter((me) => me.month <= currentMonth)
						.reduce(
							(acc, me) => ({
								actual: acc.actual + (me.actual || 0),
								budget: acc.budget + (me.budget || 0),
							}),
							{ actual: 0, budget: 0 }
						);

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

					// 간단한 YTD 재계산 (인라인)
					const currentMonth = new Date().getMonth() + 1;
					const ytd = monthlyEmissions
						.filter((me) => me.month <= currentMonth)
						.reduce(
							(acc, me) => ({
								actual: acc.actual + (me.actual || 0),
								budget: acc.budget + (me.budget || 0),
							}),
							{ actual: 0, budget: 0 }
						);

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
