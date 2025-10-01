// 전략 수립 관련 타입
export interface ReductionScenario {
	id: string;
	name: string; // 시나리오명
	description: string; // 설명
	targetYear: number; // 목표 연도
	currentEmissions: number; // 현재 배출량
	targetEmissions: number; // 목표 배출량
	reductionRate: number; // 감축률 (%)
	expectedSavings: number; // 예상 배출권 저축
	investmentRequired: number; // 필요 투자금액
	paybackPeriod: number; // 투자회수기간 (년)
	status: "draft" | "approved" | "implementing" | "completed"; // 상태
	priority: "high" | "medium" | "low"; // 우선순위
}

export interface ReductionAction {
	id: string;
	scenarioId: string;
	name: string; // 액션명
	category: "technology" | "process" | "behavior" | "policy"; // 카테고리
	description: string; // 설명
	currentValue: number; // 현재값
	targetValue: number; // 목표값
	unit: string; // 단위
	expectedReduction: number; // 예상 감축량
	implementationCost: number; // 구현 비용
	timeline: string; // 일정
	responsible: string; // 담당자
	status: "planned" | "in-progress" | "completed" | "cancelled"; // 상태
}

export interface CarbonCredit {
	id: string;
	name: string; // 탄소배출권명
	type: "KAU" | "KCU" | "VER" | "CER"; // 배출권 유형
	quantity: number; // 수량
	unit: "tCO2e"; // 단위
	price: number; // 가격
	totalValue: number; // 총 가치
	purchaseDate: string; // 구매일
	expiryDate: string; // 만료일
	status: "active" | "used" | "expired"; // 상태
}

// 전략 수립 페이지용 추가 타입
export interface StrategySummary {
	totalScenarios: number;
	approvedScenarios: number;
	implementingScenarios: number;
	totalInvestment: number;
	totalExpectedSavings: number;
	averagePaybackPeriod: number;
}

export interface StrategyFilter {
	status?: "draft" | "approved" | "implementing" | "completed";
	priority?: "high" | "medium" | "low";
	targetYear?: number;
	searchTerm?: string;
}

export interface ScenarioROI {
	scenarioId: string;
	investment: number;
	annualSavings: number;
	totalSavings: number;
	roi: number; // 투자수익률 (%)
	paybackPeriod: number; // 투자회수기간 (년)
	npv: number; // 순현재가치
}
