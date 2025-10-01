/**
 * 목표 관리 관련 계산 유틸 함수
 */

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
 * @param method 배분 방식
 * @returns 한글 텍스트
 */
export function getAllocationMethodText(
	method: "pro-rata" | "seasonal"
): string {
	return method === "pro-rata" ? "균등 배분" : "계절 가중";
}

/**
 * 배분 방식 상세 설명 텍스트
 * @param method 배분 방식
 * @returns 한글 설명
 */
export function getAllocationMethodDescription(
	method: "pro-rata" | "seasonal"
): string {
	return method === "pro-rata"
		? "4개 분기에 균등하게 배분"
		: "난방(1-3월, 11-12월), 냉방(6-8월) 계절 가중 적용";
}
