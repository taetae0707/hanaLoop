// 가치사슬 관리 관련 타입
export interface ValueChain {
	id: string;
	name: string; // 가치사슬명
	type: "upstream" | "downstream"; // 상류/하류
	description: string; // 설명
	scope: 3; // Scope 3만 해당
	totalEmissions: number; // 총 탄소배출량 (tCO2e)
	targetEmissions: number; // 목표 탄소배출량 (tCO2e)
	status: "active" | "inactive"; // 상태
}

export interface ValueChainActivity {
	id: string;
	valueChainId: string;
	name: string; // 활동명
	category: string; // 카테고리
	emissions: number; // 배출량
	unit: string; // 단위
	yearMonth: string; // 년월
}

export interface ValueChainPartner {
	id: string;
	valueChainId: string;
	name: string; // 파트너명
	type: "supplier" | "customer" | "distributor"; // 파트너 유형
	relationship: "direct" | "indirect"; // 직접/간접 관계
	emissions: number; // 배출량
	contribution: number; // 기여도 (%)
}

// 가치사슬 관리 페이지용 추가 타입
export interface ValueChainSummary {
	totalValueChains: number;
	upstreamChains: number;
	downstreamChains: number;
	totalEmissions: number;
	targetEmissions: number;
	achievementRate: number;
}

export interface ValueChainFilter {
	type?: "upstream" | "downstream";
	status?: "active" | "inactive";
	searchTerm?: string;
}

export interface ValueChainEmissionTrend {
	yearMonth: string;
	upstreamEmissions: number;
	downstreamEmissions: number;
	totalEmissions: number;
}
