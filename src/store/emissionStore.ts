import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { EmissionTargets } from "@/types/upstream-types";
import { EmissionCompareData } from "@/utils/calculateEmissionCompare";

interface EmissionState {
	// 협력사별 목표 배출량
	supplierTargets: { [key: string]: EmissionTargets };

	// 배출량 비교 데이터 캐시
	emissionCompares: {
		[key: string]: {
			purchasedProducts: EmissionCompareData | null;
			transportation: EmissionCompareData | null;
			energy: EmissionCompareData | null;
			waste: EmissionCompareData | null;
		};
	};

	// Actions
	setSupplierTargets: (supplierId: string, targets: EmissionTargets) => void;
	getSupplierTargets: (supplierId: string) => EmissionTargets | null;

	// 목표 배출량 총합 계산
	calculateTotalTarget: (supplierId: string) => number;

	// 각 항목별 목표 배출량 생성 (총합 기반)
	generateTargetsFromTotal: (totalTarget: number) => EmissionTargets;

	// 협력사 항목별 배출량 비교 데이터 저장
	setEmissionCompare: (
		supplierId: string,
		category: keyof EmissionState["emissionCompares"][string],
		compare: EmissionCompareData | null
	) => void;

	// 모든 카테고리의 배출량 비교 데이터를 한꺼번에 가져오는 함수
	getEmissionCompares: (
		supplierId: string
	) => EmissionState["emissionCompares"][string] | null;

	// 초기화
	reset: () => void;
}

/**
 * 배출량 관리를 위한 전역 상태 스토어
 
 * - 협력사별 목표 배출량 관리
 * - 배출량 비교 데이터 캐싱
 
 */
export const useEmissionStore = create<EmissionState>()(
	devtools(
		persist(
			(set, get) => ({
				supplierTargets: {},
				emissionCompares: {},

				setSupplierTargets: (supplierId, targets) => {
					set((state) => ({
						supplierTargets: {
							...state.supplierTargets,
							[supplierId]: targets,
						},
					}));
				},

				getSupplierTargets: (supplierId) => {
					return get().supplierTargets[supplierId] || null;
				},

				calculateTotalTarget: (supplierId) => {
					const targets = get().supplierTargets[supplierId];
					if (!targets) return 0;

					return (
						targets.purchasedProducts +
						targets.transportation +
						targets.energy +
						targets.waste
					);
				},

				generateTargetsFromTotal: (totalTarget) => {
					// 각 항목별 비율
					// 구매한 제품: 40%, 운송: 25%, 에너지: 25%, 폐기물: 10%
					return {
						purchasedProducts: Math.round(totalTarget * 0.4 * 10) / 10,
						transportation: Math.round(totalTarget * 0.25 * 10) / 10,
						energy: Math.round(totalTarget * 0.25 * 10) / 10,
						waste: Math.round(totalTarget * 0.1 * 10) / 10,
					};
				},

				setEmissionCompare: (supplierId, category, compare) => {
					set((state) => ({
						emissionCompares: {
							...state.emissionCompares,
							[supplierId]: {
								...(state.emissionCompares[supplierId] || {
									purchasedProducts: null,
									transportation: null,
									energy: null,
									waste: null,
								}),
								[category]: compare,
							},
						},
					}));
				},

				getEmissionCompares: (supplierId) => {
					return get().emissionCompares[supplierId] || null;
				},

				reset: () => {
					set({
						supplierTargets: {},
						emissionCompares: {},
					});
				},
			}),
			{
				name: "emission-storage",
				partialize: (state) => ({
					supplierTargets: state.supplierTargets,
					// emissionCompares는 세션마다 다시 계산하므로 저장하지 않음
				}),
			}
		),
		{
			name: "EmissionStore",
		}
	)
);
