// 협력사 관리 관련 타입
export interface Supplier {
	id: string;
	name: string; // 상호명
	products: string[]; // 제품 목록
	transactionStartDate: string; // 거래시작일
	totalEmissions: number; // 총 탄소배출량 (tCO2e)
	targetEmissions: number; // 목표 탄소배출량 (tCO2e)
	expectedSavings: number; // 예상 탄소배출권 저축 (tCO2e)
	status: "draft" | "active" | "inactive"; // 진행상황
	relationship: "supplier" | "partner" | "subsidiary"; // 관계
	sustainabilityReport?: string; // 지속가능성 보고서 (CDP 등)
	riskLevel: "normal" | "warning" | "danger"; // 리스크 레벨
}

export interface SupplierEmissionDetail {
	supplierId: string;
	source: string; // 배출원 (전기사용료, 휘발유 사용량, 배출 오염수 등)
	emissions: number; // 배출량
	unit: string; // 단위
	scope: 1 | 2 | 3;
	yearMonth: string; // 년월
}

export interface SupplierTarget {
	supplierId: string;
	totalTargetEmissions: number; // 총 탄소배출량 목표치
	targetSavings: number; // 목표 탄소배출권 저축량
	achievementRate: number; // 달성률 (%)
}

// 협력사 관리 페이지용 추가 타입
export interface SupplierSummary {
	totalSuppliers: number;
	normalSuppliers: number;
	warningSuppliers: number;
	dangerSuppliers: number;
	totalExpectedSavings: number;
}

export interface SupplierFilter {
	searchTerm: string;
	status?: "draft" | "active" | "inactive";
	relationship?: "supplier" | "partner" | "subsidiary";
	riskLevel?: "normal" | "warning" | "danger";
}
