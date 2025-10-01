// 사업장 관리 관련 타입
export interface Facility {
	id: string;
	name: string; // 사업장명
	location: string; // 위치 (서울, 경기, 미얀마 등)
	type: "domestic" | "overseas"; // 국내/해외
	establishmentDate: string; // 설립일
	totalEmissions: number; // 총 탄소배출량 (tCO2e)
	targetEmissions: number; // 목표 탄소배출량 (tCO2e)
	status: "active" | "inactive" | "maintenance"; // 상태
	riskLevel: "normal" | "warning" | "danger"; // 리스크 레벨
}

export interface EmissionFacility {
	id: string;
	facilityId: string;
	name: string; // 배출시설명 (연소시설, 실내 등유시설, 비상발전기 등)
	fuel: string; // 연료 (도시가스(LNG), 실내 등유, 가스/디젤 오일 등)
	unit: string; // 단위 (천㎡, KL 등)
	scope: 1 | 2; // Scope 1, 2만 해당
}

export interface FacilityEmissionData {
	facilityId: string;
	emissionFacilityId: string;
	yearMonth: string; // 년월 (2024-01, 2024-02 등)
	currentMonthTotal: number; // 현재 월 합계
	previousMonthTotal: number; // 전 월 합계
	cumulativeTotal: number; // 누적 합계
	anomalyDetected: boolean; // 이상 감지 여부
	resolved: boolean; // 해결 여부
	supportingDocuments: boolean; // 증빙자료 여부
}

// 사업장 관리 페이지용 추가 타입
export interface FacilityFilter {
	location?: string;
	year?: number;
	month?: number;
	status?: "active" | "inactive" | "maintenance";
	riskLevel?: "normal" | "warning" | "danger";
}

export interface FacilitySummary {
	totalFacilities: number;
	domesticFacilities: number;
	overseasFacilities: number;
	totalEmissions: number;
	targetEmissions: number;
	achievementRate: number;
}

export interface MonthlyEmissionTrend {
	yearMonth: string;
	totalEmissions: number;
	scope1Emissions: number;
	scope2Emissions: number;
	facilityCount: number;
}
