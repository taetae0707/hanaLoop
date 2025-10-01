// 기본 데이터 타입 정의
export interface Country {
	code: string;
	name: string;
}

export interface GhgEmission {
	yearMonth: string; // "2024-01", "2024-02", "2024-03"
	source: string; // gasoline, lpg, diesel, electricity, etc
	scope: 1 | 2 | 3; // GHG Protocol scopes
	emissions: number; // tons of CO2 equivalent
}

export interface Company {
	id: string;
	name: string;
	country: string; // Country.code
	industry: string;
	emissions: GhgEmission[];
}

export interface Post {
	id: string;
	title: string;
	resourceUid: string; // Company.id
	dateTime: string; // e.g., "2024-02"
	content: string;
	type: "report" | "alert" | "update";
}

// 대시보드용 추가 타입
export interface EmissionSummary {
	totalEmissions: number;
	targetEmissions: number;
	achievementRate: number;
	scope1: number;
	scope2: number;
	scope3: number;
}

export interface MonthlyTrend {
	yearMonth: string;
	actual: number;
	forecast?: number;
	target?: number;
}

export interface CompanyEmissionSummary {
	companyId: string;
	companyName: string;
	totalEmissions: number;
	monthlyChange: number; // percentage
	riskLevel: "low" | "medium" | "high";
}

export interface EmissionBySource {
	source: string;
	emissions: number;
	percentage: number;
	scope: 1 | 2 | 3;
}
