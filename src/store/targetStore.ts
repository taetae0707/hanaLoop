import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
	AnnualTarget,
	CompanyTargetManagement,
	SeasonalWeights,
	AllocationMethod,
	QuarterlyTarget,
} from "@/types/target-types";
import {
	allocateSeasonal,
	allocateMonthlyBudgets,
} from "@/utils/targetAllocation";
import { calculateYTD } from "@/utils/ytdCalculation";

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
					set({ seasonalWeights: weights });
				},

				setAnnualTarget: (companyId, year, totalBudget, method) => {
					const state = get();
					const companyTarget = state.companyTargets[companyId];

					// 분기별 목표 자동 배분
					let quarterlyTargets: QuarterlyTarget[];
					if (method === "seasonal") {
						quarterlyTargets = allocateSeasonal(
							totalBudget,
							state.seasonalWeights
						);
					} else {
						// pro-rata
						const quarterBudget = Math.round((totalBudget / 4) * 10) / 10;
						quarterlyTargets = [1, 2, 3, 4].map((q) => ({
							quarter: q as 1 | 2 | 3 | 4,
							budget: quarterBudget,
							actual: 0,
							remaining: quarterBudget,
						}));
					}

					// 월별 예산 배분
					const monthlyEmissions = allocateMonthlyBudgets(
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

					if (companyTarget) {
						// 기존 회사의 목표 업데이트
						const existingTargetIndex = companyTarget.targets.findIndex(
							(t) => t.year === year
						);
						const updatedTargets = [...companyTarget.targets];

						if (existingTargetIndex >= 0) {
							updatedTargets[existingTargetIndex] = newAnnualTarget;
						} else {
							updatedTargets.push(newAnnualTarget);
						}

						set({
							companyTargets: {
								...state.companyTargets,
								[companyId]: {
									...companyTarget,
									targets: updatedTargets,
								},
							},
						});
					} else {
						// 새로운 회사 추가
						set({
							companyTargets: {
								...state.companyTargets,
								[companyId]: {
									companyId,
									companyName: companyId, // 실제로는 API에서 가져와야 함
									targets: [newAnnualTarget],
									currentYear: year,
								},
							},
						});
					}
				},

				loadAnnualTarget: (companyId, target) => {
					const state = get();
					const companyTarget = state.companyTargets[companyId];

					// 월별 실적 기반으로 분기별 실적 재계산
					const quarterlyTargets = target.quarterlyTargets.map((qt) => {
						const startMonth = (qt.quarter - 1) * 3 + 1;
						const endMonth = startMonth + 2;
						const quarterActual = target.monthlyEmissions
							.filter((me) => me.month >= startMonth && me.month <= endMonth)
							.reduce((sum, me) => sum + me.actual, 0);

						return {
							...qt,
							actual: Math.round(quarterActual * 10) / 10,
							remaining: Math.round((qt.budget - quarterActual) * 10) / 10,
						};
					});

					// YTD 계산
					const currentMonth = new Date().getMonth() + 1;
					const ytd = calculateYTD(target.monthlyEmissions, currentMonth);

					const loadedTarget: AnnualTarget = {
						...target,
						quarterlyTargets,
						...ytd,
					};

					if (companyTarget) {
						// 기존 회사의 목표 업데이트
						const existingTargetIndex = companyTarget.targets.findIndex(
							(t) => t.year === target.year
						);
						const updatedTargets = [...companyTarget.targets];

						if (existingTargetIndex >= 0) {
							updatedTargets[existingTargetIndex] = loadedTarget;
						} else {
							updatedTargets.push(loadedTarget);
						}

						set({
							companyTargets: {
								...state.companyTargets,
								[companyId]: {
									...companyTarget,
									targets: updatedTargets,
								},
							},
						});
					} else {
						// 새로운 회사 추가
						set({
							companyTargets: {
								...state.companyTargets,
								[companyId]: {
									companyId,
									companyName: companyId,
									targets: [loadedTarget],
									currentYear: target.year,
								},
							},
						});
					}
				},

				updateQuarterlyTarget: (companyId, year, quarter, budget) => {
					const state = get();
					const companyTarget = state.companyTargets[companyId];
					if (!companyTarget) return;

					const targetIndex = companyTarget.targets.findIndex(
						(t) => t.year === year
					);
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
						remaining: budget - quarterlyTargets[quarterIndex].actual,
					};

					// 월별 예산 재계산
					const monthlyEmissions = allocateMonthlyBudgets(
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

					const updatedTargets = [...companyTarget.targets];
					updatedTargets[targetIndex] = {
						...annualTarget,
						totalBudget: Math.round(newTotalBudget * 10) / 10,
						quarterlyTargets,
						monthlyEmissions: updatedMonthlyEmissions,
					};

					set({
						companyTargets: {
							...state.companyTargets,
							[companyId]: {
								...companyTarget,
								targets: updatedTargets,
							},
						},
					});
				},

				recordMonthlyEmission: (companyId, year, month, actual) => {
					const state = get();
					const companyTarget = state.companyTargets[companyId];
					if (!companyTarget) return;

					const targetIndex = companyTarget.targets.findIndex(
						(t) => t.year === year
					);
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
					const quarterlyTargets = [...annualTarget.quarterlyTargets];
					quarterlyTargets.forEach((qt, i) => {
						const startMonth = (qt.quarter - 1) * 3 + 1;
						const endMonth = startMonth + 2;
						const quarterActual = monthlyEmissions
							.filter((me) => me.month >= startMonth && me.month <= endMonth)
							.reduce((sum, me) => sum + me.actual, 0);

						quarterlyTargets[i] = {
							...qt,
							actual: Math.round(quarterActual * 10) / 10,
							remaining: Math.round((qt.budget - quarterActual) * 10) / 10,
						};
					});

					// YTD 재계산
					const currentMonth = new Date().getMonth() + 1;
					const ytd = calculateYTD(monthlyEmissions, currentMonth);

					const updatedTargets = [...companyTarget.targets];
					updatedTargets[targetIndex] = {
						...annualTarget,
						quarterlyTargets,
						monthlyEmissions,
						...ytd,
					};

					set({
						companyTargets: {
							...state.companyTargets,
							[companyId]: {
								...companyTarget,
								targets: updatedTargets,
							},
						},
					});
				},

				recalculateYTD: (companyId, year, currentMonth) => {
					const state = get();
					const companyTarget = state.companyTargets[companyId];
					if (!companyTarget) return;

					const targetIndex = companyTarget.targets.findIndex(
						(t) => t.year === year
					);
					if (targetIndex < 0) return;

					const annualTarget = companyTarget.targets[targetIndex];
					const ytd = calculateYTD(annualTarget.monthlyEmissions, currentMonth);

					const updatedTargets = [...companyTarget.targets];
					updatedTargets[targetIndex] = {
						...annualTarget,
						...ytd,
					};

					set({
						companyTargets: {
							...state.companyTargets,
							[companyId]: {
								...companyTarget,
								targets: updatedTargets,
							},
						},
					});
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
