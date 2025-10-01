// Upstream Scope 3 근거 자료 타입 정의

export interface PurchasedProductsData {
	rawMaterialQuantity: number; // 원자재 구매량 (ton)
	rawMaterialPCF: number; // 원자재 PCF 데이터
}

export interface TransportationData {
	distance: number; // 운송거리 (km)
	cargoWeight: number; // 화물무게 (ton)
	transportMode: string; // 운송수단
}

export interface EnergyData {
	totalElectricityUsage: number; // 총 전기 사용량 (kWh)
	totalFuelUsage: number; // 총 연료 사용량 (L)
}

export interface WasteData {
	wasteType: string; // 폐기물 종류
	treatmentVolume: number; // 처리량 (ton)
	treatmentMethod: string; // 처리 방법
}

// 목표 배출량 데이터 타입
export interface EmissionTargets {
	purchasedProducts: number; // 구매한 제품 및 서비스 목표 배출량 (tCO2e)
	transportation: number; // 업스트림 운송 및 유통 목표 배출량 (tCO2e)
	energy: number; // 연료 및 에너지 관련 활동 목표 배출량 (tCO2e)
	waste: number; // 사업 활동에서 발생한 폐기물 목표 배출량 (tCO2e)
}

// 전달 데이터 타입
export interface PreviousMonthData {
	purchasedProducts: PurchasedProductsData;
	transportation: TransportationData;
	energy: EnergyData;
	waste: WasteData[];
	totalEmissions: number; // 전달 총 배출량 (tCO2e)
}

export interface UpstreamEmissionDetails {
	supplierId: string;
	purchasedProducts: PurchasedProductsData;
	transportation: TransportationData;
	energy: EnergyData;
	waste: WasteData[];
	totalEmissions: number; // 총 배출량 (tCO2e)
	lastUpdated: string; // 마지막 업데이트 날짜
	targets?: EmissionTargets; // 목표 배출량 (선택적)
	previousMonth?: PreviousMonthData; // 전달 데이터 (선택적)
}
