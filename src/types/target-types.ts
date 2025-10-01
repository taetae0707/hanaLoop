// 목표 관리 관련 타입 정의

/** 배출량 배분 방식 */
export type AllocationMethod = "pro-rata" | "seasonal";

/** 계절 가중치 (6~8월 냉방, 11~3월 난방) */
export interface SeasonalWeights {
	[key: number]: number; // 월(1-12) -> 가중치
}

/** 월별 배출 실적 */
export interface MonthlyEmission {
	year: number;
	month: number; // 1-12
	actual: number; // 실제 배출량 (tCO₂e)
	budget: number; // 예산 배출량 (tCO₂e)
}

/** 분기별 목표 */
export interface QuarterlyTarget {
	quarter: 1 | 2 | 3 | 4;
	budget: number; // 분기 배출 예산 (tCO₂e)
	actual: number; // 분기 실제 배출량 (tCO₂e)
	remaining: number; // 남은 예산 (tCO₂e)
}

/** 연간 목표 */
export interface AnnualTarget {
	year: number;
	totalBudget: number; // 연간 총 목표 (tCO₂e)
	allocationMethod: AllocationMethod;
	quarterlyTargets: QuarterlyTarget[];
	monthlyEmissions: MonthlyEmission[];

	// YTD (Year-To-Date) 누적
	ytdActual: number; // 연초~현재 실제 배출량
	ytdBudget: number; // 연초~현재 예산
	ytdVariance: number; // 차이 (actual - budget)
}

/** 회사별 목표 관리 */
export interface CompanyTargetManagement {
	companyId: string;
	companyName: string;
	targets: AnnualTarget[]; // 여러 연도 관리 가능
	currentYear: number;
}
