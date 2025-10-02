/**
 * 목표 관리 관련 계산 유틸 함수
 */

import { MonthlyEmission } from "@/types/target-types";

/**
 * 남은 예산 계산
 * @param totalBudget 연간 총 목표 (tCO₂e)
 * @param currentEmission 현재까지 배출량 (tCO₂e)
 * @returns 남은 예산 (tCO₂e)
 */
export function calculateRemainingBudget(
	totalBudget: number,
	currentEmission: number
): number {
	return Math.round((totalBudget - currentEmission) * 10) / 10;
}

/**
 * 연간 목표 계산
 * 연간목표 = 현재배출 + 남은예산
 * @param currentEmission 현재까지 배출량 (tCO₂e)
 * @param remainingBudget 남은 예산 (tCO₂e)
 * @returns 연간 목표 (tCO₂e)
 */
export function calculateAnnualGoal(
	currentEmission: number,
	remainingBudget: number
): number {
	return Math.round((currentEmission + remainingBudget) * 10) / 10;
}

/**
 * 배분 방식 텍스트 변환

 */
export function getAllocationMethodText(
	method: "pro-rata" | "seasonal"
): string {
	return method === "pro-rata" ? "균등 배분" : "계절 가중";
}

export function getAllocationMethodDescription(
	method: "pro-rata" | "seasonal"
): string {
	return method === "pro-rata"
		? "4개 분기에 균등하게 배분"
		: "난방(1-3월, 11-12월), 냉방(6-8월) 계절 가중 적용";
}

/**
 * 현재까지의 총 배출량 계산 (1월 ~ 현재월)
 * @param monthlyEmissions 월별 배출량 데이터
 * @param currentMonth 현재 월 (1-12)
 * @returns 현재까지의 총 배출량 (tCO₂e)
 */
export function calculateCurrentTotalEmissions(
	monthlyEmissions: MonthlyEmission[],
	currentMonth: number
): number {
	return (
		Math.round(
			monthlyEmissions
				.filter((month) => month.month <= currentMonth)
				.reduce((sum, month) => sum + month.actual, 0) * 10
		) / 10
	);
}

/**
 * 현재까지의 총 예산 계산 (1월 ~ 현재월)
 * @param monthlyEmissions 월별 배출량 데이터
 * @param currentMonth 현재 월 (1-12)
 * @returns 현재까지의 총 예산 (tCO₂e)
 */
export function calculateCurrentTotalBudget(
	monthlyEmissions: MonthlyEmission[],
	currentMonth: number
): number {
	return (
		Math.round(
			monthlyEmissions
				.filter((month) => month.month <= currentMonth)
				.reduce((sum, month) => sum + month.budget, 0) * 10
		) / 10
	);
}

/**
 * 현재까지의 남은 예산 계산
 * @param monthlyEmissions 월별 배출량 데이터
 * @param currentMonth 현재 월 (1-12)
 * @returns 현재까지의 남은 예산 (tCO₂e)
 */
export function calculateCurrentRemainingBudget(
	monthlyEmissions: MonthlyEmission[],
	currentMonth: number
): number {
	const currentTotalBudget = calculateCurrentTotalBudget(
		monthlyEmissions,
		currentMonth
	);
	const currentTotalEmissions = calculateCurrentTotalEmissions(
		monthlyEmissions,
		currentMonth
	);
	return Math.round((currentTotalBudget - currentTotalEmissions) * 10) / 10;
}

/**
 * 예산 사용률 계산
 * @param currentTotalEmissions 현재까지의 총 배출량 (tCO₂e)
 * @param currentTotalBudget 현재까지의 총 예산 (tCO₂e)
 * @returns 예산 사용률 (%)
 */
export function calculateBudgetUsageRate(
	currentTotalEmissions: number,
	currentTotalBudget: number
): number {
	if (currentTotalBudget === 0) return 0;
	return (
		Math.round((currentTotalEmissions / currentTotalBudget) * 100 * 10) / 10
	);
}
