import { Company, Post, Country } from "@/types";
import {
	Supplier,
	SupplierEmissionDetail,
	SupplierTarget,
} from "@/types/supplier-types";
import { UpstreamEmissionDetails } from "@/types/upstream-types";

// 국가 데이터
export const countries: Country[] = [
	{ code: "US", name: "United States" },
	{ code: "DE", name: "Germany" },
	{ code: "KR", name: "South Korea" },
	{ code: "JP", name: "Japan" },
	{ code: "CN", name: "China" },
];

// 회사 데이터 (확장된 배출 데이터 포함)
export const companies: Company[] = [
	{
		id: "c1",
		name: "Acme Corp",
		country: "US",
		industry: "Manufacturing",
		emissions: [
			{
				yearMonth: "2024-01",
				source: "electricity",
				scope: 2,
				emissions: 45.2,
			},
			{ yearMonth: "2024-01", source: "gasoline", scope: 1, emissions: 32.8 },
			{
				yearMonth: "2024-01",
				source: "business-travel",
				scope: 3,
				emissions: 42.0,
			},
			{
				yearMonth: "2024-02",
				source: "electricity",
				scope: 2,
				emissions: 41.5,
			},
			{ yearMonth: "2024-02", source: "gasoline", scope: 1, emissions: 28.3 },
			{
				yearMonth: "2024-02",
				source: "business-travel",
				scope: 3,
				emissions: 40.2,
			},
			{
				yearMonth: "2024-03",
				source: "electricity",
				scope: 2,
				emissions: 38.1,
			},
			{ yearMonth: "2024-03", source: "gasoline", scope: 1, emissions: 24.7 },
			{
				yearMonth: "2024-03",
				source: "business-travel",
				scope: 3,
				emissions: 32.2,
			},
			{
				yearMonth: "2024-04",
				source: "electricity",
				scope: 2,
				emissions: 42.8,
			},
			{ yearMonth: "2024-04", source: "gasoline", scope: 1, emissions: 29.1 },
			{
				yearMonth: "2024-04",
				source: "business-travel",
				scope: 3,
				emissions: 38.5,
			},
			{
				yearMonth: "2024-05",
				source: "electricity",
				scope: 2,
				emissions: 44.2,
			},
			{ yearMonth: "2024-05", source: "gasoline", scope: 1, emissions: 31.6 },
			{
				yearMonth: "2024-05",
				source: "business-travel",
				scope: 3,
				emissions: 41.8,
			},
			{
				yearMonth: "2024-06",
				source: "electricity",
				scope: 2,
				emissions: 46.5,
			},
			{ yearMonth: "2024-06", source: "gasoline", scope: 1, emissions: 33.2 },
			{
				yearMonth: "2024-06",
				source: "business-travel",
				scope: 3,
				emissions: 45.1,
			},
		],
	},
	{
		id: "c2",
		name: "Globex Industries",
		country: "DE",
		industry: "Technology",
		emissions: [
			{
				yearMonth: "2024-01",
				source: "electricity",
				scope: 2,
				emissions: 28.5,
			},
			{
				yearMonth: "2024-01",
				source: "natural-gas",
				scope: 1,
				emissions: 22.3,
			},
			{
				yearMonth: "2024-01",
				source: "supply-chain",
				scope: 3,
				emissions: 29.2,
			},
			{
				yearMonth: "2024-02",
				source: "electricity",
				scope: 2,
				emissions: 35.8,
			},
			{
				yearMonth: "2024-02",
				source: "natural-gas",
				scope: 1,
				emissions: 26.7,
			},
			{
				yearMonth: "2024-02",
				source: "supply-chain",
				scope: 3,
				emissions: 42.5,
			},
			{
				yearMonth: "2024-03",
				source: "electricity",
				scope: 2,
				emissions: 42.1,
			},
			{
				yearMonth: "2024-03",
				source: "natural-gas",
				scope: 1,
				emissions: 31.2,
			},
			{
				yearMonth: "2024-03",
				source: "supply-chain",
				scope: 3,
				emissions: 46.7,
			},
			{
				yearMonth: "2024-04",
				source: "electricity",
				scope: 2,
				emissions: 39.4,
			},
			{
				yearMonth: "2024-04",
				source: "natural-gas",
				scope: 1,
				emissions: 28.9,
			},
			{
				yearMonth: "2024-04",
				source: "supply-chain",
				scope: 3,
				emissions: 44.2,
			},
			{
				yearMonth: "2024-05",
				source: "electricity",
				scope: 2,
				emissions: 36.7,
			},
			{
				yearMonth: "2024-05",
				source: "natural-gas",
				scope: 1,
				emissions: 25.4,
			},
			{
				yearMonth: "2024-05",
				source: "supply-chain",
				scope: 3,
				emissions: 40.8,
			},
			{
				yearMonth: "2024-06",
				source: "electricity",
				scope: 2,
				emissions: 41.3,
			},
			{
				yearMonth: "2024-06",
				source: "natural-gas",
				scope: 1,
				emissions: 29.6,
			},
			{
				yearMonth: "2024-06",
				source: "supply-chain",
				scope: 3,
				emissions: 47.1,
			},
		],
	},
	{
		id: "c3",
		name: "Hana Manufacturing",
		country: "KR",
		industry: "Heavy Industry",
		emissions: [
			{ yearMonth: "2024-01", source: "coal", scope: 1, emissions: 85.2 },
			{
				yearMonth: "2024-01",
				source: "electricity",
				scope: 2,
				emissions: 52.8,
			},
			{
				yearMonth: "2024-01",
				source: "raw-materials",
				scope: 3,
				emissions: 124.5,
			},
			{ yearMonth: "2024-02", source: "coal", scope: 1, emissions: 78.9 },
			{
				yearMonth: "2024-02",
				source: "electricity",
				scope: 2,
				emissions: 48.3,
			},
			{
				yearMonth: "2024-02",
				source: "raw-materials",
				scope: 3,
				emissions: 118.7,
			},
			{ yearMonth: "2024-03", source: "coal", scope: 1, emissions: 72.4 },
			{
				yearMonth: "2024-03",
				source: "electricity",
				scope: 2,
				emissions: 44.1,
			},
			{
				yearMonth: "2024-03",
				source: "raw-materials",
				scope: 3,
				emissions: 108.2,
			},
			{ yearMonth: "2024-04", source: "coal", scope: 1, emissions: 76.8 },
			{
				yearMonth: "2024-04",
				source: "electricity",
				scope: 2,
				emissions: 46.9,
			},
			{
				yearMonth: "2024-04",
				source: "raw-materials",
				scope: 3,
				emissions: 115.3,
			},
			{ yearMonth: "2024-05", source: "coal", scope: 1, emissions: 82.1 },
			{
				yearMonth: "2024-05",
				source: "electricity",
				scope: 2,
				emissions: 50.4,
			},
			{
				yearMonth: "2024-05",
				source: "raw-materials",
				scope: 3,
				emissions: 122.8,
			},
			{ yearMonth: "2024-06", source: "coal", scope: 1, emissions: 88.7 },
			{
				yearMonth: "2024-06",
				source: "electricity",
				scope: 2,
				emissions: 54.2,
			},
			{
				yearMonth: "2024-06",
				source: "raw-materials",
				scope: 3,
				emissions: 131.4,
			},
		],
	},
	{
		id: "c4",
		name: "EcoTech Solutions",
		country: "JP",
		industry: "Renewable Energy",
		emissions: [
			{
				yearMonth: "2024-01",
				source: "electricity",
				scope: 2,
				emissions: 12.3,
			},
			{ yearMonth: "2024-01", source: "diesel", scope: 1, emissions: 8.7 },
			{ yearMonth: "2024-01", source: "logistics", scope: 3, emissions: 15.2 },
			{
				yearMonth: "2024-02",
				source: "electricity",
				scope: 2,
				emissions: 11.8,
			},
			{ yearMonth: "2024-02", source: "diesel", scope: 1, emissions: 7.9 },
			{ yearMonth: "2024-02", source: "logistics", scope: 3, emissions: 14.1 },
			{
				yearMonth: "2024-03",
				source: "electricity",
				scope: 2,
				emissions: 10.5,
			},
			{ yearMonth: "2024-03", source: "diesel", scope: 1, emissions: 6.8 },
			{ yearMonth: "2024-03", source: "logistics", scope: 3, emissions: 12.4 },
			{
				yearMonth: "2024-04",
				source: "electricity",
				scope: 2,
				emissions: 13.1,
			},
			{ yearMonth: "2024-04", source: "diesel", scope: 1, emissions: 9.2 },
			{ yearMonth: "2024-04", source: "logistics", scope: 3, emissions: 16.7 },
			{
				yearMonth: "2024-05",
				source: "electricity",
				scope: 2,
				emissions: 14.6,
			},
			{ yearMonth: "2024-05", source: "diesel", scope: 1, emissions: 10.4 },
			{ yearMonth: "2024-05", source: "logistics", scope: 3, emissions: 18.9 },
			{
				yearMonth: "2024-06",
				source: "electricity",
				scope: 2,
				emissions: 15.8,
			},
			{ yearMonth: "2024-06", source: "diesel", scope: 1, emissions: 11.3 },
			{ yearMonth: "2024-06", source: "logistics", scope: 3, emissions: 20.2 },
		],
	},
];

// 포스트 데이터
export const posts: Post[] = [
	{
		id: "p1",
		title: "Q1 2024 지속가능성 보고서",
		resourceUid: "c1",
		dateTime: "2024-03",
		content:
			"1분기 CO2 배출량이 목표 대비 8% 감소했습니다. 주요 개선 사항은 전력 효율성 향상과 비즈니스 여행 최적화입니다.",
		type: "report",
	},
	{
		id: "p2",
		title: "배출량 증가 알림",
		resourceUid: "c2",
		dateTime: "2024-04",
		content:
			"4월 전력 사용량이 예상보다 15% 증가했습니다. 냉각 시스템 점검이 필요합니다.",
		type: "alert",
	},
	{
		id: "p3",
		title: "탄소 중립 이니셔티브 업데이트",
		resourceUid: "c3",
		dateTime: "2024-05",
		content:
			"새로운 재생에너지 설비 도입으로 석탄 사용량을 20% 줄일 예정입니다.",
		type: "update",
	},
	{
		id: "p4",
		title: "월간 성과 리포트",
		resourceUid: "c4",
		dateTime: "2024-06",
		content:
			"6월 전체 배출량이 목표치를 달성했으며, 물류 최적화가 주요 성공 요인입니다.",
		type: "report",
	},
	{
		id: "p5",
		title: "연간 목표 재설정",
		resourceUid: "c1",
		dateTime: "2024-06",
		content:
			"상반기 성과를 바탕으로 연간 감축 목표를 기존 10%에서 15%로 상향 조정합니다.",
		type: "update",
	},
];

// 협력사 데이터
export const suppliers: Supplier[] = [
	{
		id: "s1",
		name: "한컨설팅그룹",
		products: ["컨설팅 서비스", "데이터 분석"],
		transactionStartDate: "2023-10-10",
		totalEmissions: 125.5,
		targetEmissions: 100.0,
		expectedSavings: 25.5,
		status: "draft",
		relationship: "supplier",
		riskLevel: "warning", // 목표 대비 25% 초과
	},
	{
		id: "s2",
		name: "BASIC: Hana M",
		products: ["그라스울", "시스톤", "단열재"],
		transactionStartDate: "2023-08-28",
		totalEmissions: 89.2,
		targetEmissions: 120.0,
		expectedSavings: 30.8,
		status: "draft",
		relationship: "supplier",
		sustainabilityReport: "CDP",
		riskLevel: "normal", // 목표 대비 25% 이하
	},
	{
		id: "s3",
		name: "(주)하나루프",
		products: ["온실가스 관리 서비스", "탄소배출량 측정"],
		transactionStartDate: "2023-10-10",
		totalEmissions: 45.8,
		targetEmissions: 50.0,
		expectedSavings: 4.2,
		status: "draft",
		relationship: "supplier",
		riskLevel: "normal",
	},
	{
		id: "s4",
		name: "코스알엑스",
		products: ["화학 원료", "정제 제품"],
		transactionStartDate: "2022-03-15",
		totalEmissions: 280.5,
		targetEmissions: 200.0,
		expectedSavings: 80.5,
		status: "active",
		relationship: "supplier",
		sustainabilityReport: "CDP",
		riskLevel: "danger", // 목표 대비 40% 초과
	},
	{
		id: "s5",
		name: "그린테크 솔루션",
		products: ["재생에너지 설비", "에너지 효율 장비"],
		transactionStartDate: "2023-05-20",
		totalEmissions: 32.1,
		targetEmissions: 40.0,
		expectedSavings: 7.9,
		status: "active",
		relationship: "partner",
		riskLevel: "normal",
	},
	{
		id: "s6",
		name: "글로벌 로지스틱스",
		products: ["물류 서비스", "운송"],
		transactionStartDate: "2021-12-01",
		totalEmissions: 156.8,
		targetEmissions: 150.0,
		expectedSavings: -6.8,
		status: "active",
		relationship: "supplier",
		riskLevel: "warning", // 목표 초과
	},
];

// 협력사 배출 세부 데이터
export const supplierEmissionDetails: SupplierEmissionDetail[] = [
	// 한컨설팅그룹
	{
		supplierId: "s1",
		source: "전기사용료",
		emissions: 45.2,
		unit: "MWh",
		scope: 2,
		yearMonth: "2024-01",
	},
	{
		supplierId: "s1",
		source: "휘발유 사용량",
		emissions: 32.8,
		unit: "L",
		scope: 1,
		yearMonth: "2024-01",
	},
	{
		supplierId: "s1",
		source: "배출 오염수",
		emissions: 47.5,
		unit: "m³",
		scope: 1,
		yearMonth: "2024-01",
	},
	// 코스알엑스
	{
		supplierId: "s4",
		source: "연소시설",
		emissions: 120.5,
		unit: "천㎡",
		scope: 1,
		yearMonth: "2024-01",
	},
	{
		supplierId: "s4",
		source: "전기사용료",
		emissions: 85.3,
		unit: "MWh",
		scope: 2,
		yearMonth: "2024-01",
	},
	{
		supplierId: "s4",
		source: "화학 공정",
		emissions: 74.7,
		unit: "톤",
		scope: 1,
		yearMonth: "2024-01",
	},
];

// 협력사 목표 데이터
export const supplierTargets: SupplierTarget[] = [
	{
		supplierId: "s1",
		totalTargetEmissions: 100.0,
		targetSavings: 25.5,
		achievementRate: 75.5, // 현재 배출량 / 목표 배출량 * 100
	},
	{
		supplierId: "s2",
		totalTargetEmissions: 120.0,
		targetSavings: 30.8,
		achievementRate: 74.3,
	},
	{
		supplierId: "s3",
		totalTargetEmissions: 50.0,
		targetSavings: 4.2,
		achievementRate: 91.6,
	},
	{
		supplierId: "s4",
		totalTargetEmissions: 200.0,
		targetSavings: 80.5,
		achievementRate: 140.3, // 목표 초과
	},
	{
		supplierId: "s5",
		totalTargetEmissions: 40.0,
		targetSavings: 7.9,
		achievementRate: 80.3,
	},
	{
		supplierId: "s6",
		totalTargetEmissions: 150.0,
		targetSavings: -6.8,
		achievementRate: 104.5, // 목표 초과
	},
];

// Upstream Scope 3 근거 자료 데이터
export const upstreamEmissionDetails: UpstreamEmissionDetails[] = [
	{
		supplierId: "s1",
		purchasedProducts: {
			rawMaterialQuantity: 150.5,
			rawMaterialPCF: 2.3,
		},
		transportation: {
			distance: 250,
			cargoWeight: 12.5,
			transportMode: "트럭",
		},
		energy: {
			totalElectricityUsage: 45000,
			totalFuelUsage: 2500,
		},
		waste: [
			{
				wasteType: "일반폐기물",
				treatmentVolume: 8.2,
				treatmentMethod: "소각",
			},
			{
				wasteType: "배출 오염수",
				treatmentVolume: 15.8,
				treatmentMethod: "정화처리",
			},
		],
		totalEmissions: 125.8,
		lastUpdated: "2024-09-30",
	},
	{
		supplierId: "s2",
		purchasedProducts: {
			rawMaterialQuantity: 89.3,
			rawMaterialPCF: 1.8,
		},
		transportation: {
			distance: 180,
			cargoWeight: 8.7,
			transportMode: "선박",
		},
		energy: {
			totalElectricityUsage: 32000,
			totalFuelUsage: 1800,
		},
		waste: [
			{
				wasteType: "일반폐기물",
				treatmentVolume: 5.5,
				treatmentMethod: "매립",
			},
			{
				wasteType: "배출 오염수",
				treatmentVolume: 12.3,
				treatmentMethod: "정화처리",
			},
		],
		totalEmissions: 89.4,
		lastUpdated: "2024-09-28",
	},
	{
		supplierId: "s3",
		purchasedProducts: {
			rawMaterialQuantity: 203.7,
			rawMaterialPCF: 2.8,
		},
		transportation: {
			distance: 320,
			cargoWeight: 18.2,
			transportMode: "철도",
		},
		energy: {
			totalElectricityUsage: 68000,
			totalFuelUsage: 4200,
		},
		waste: [
			{
				wasteType: "일반폐기물",
				treatmentVolume: 12.8,
				treatmentMethod: "소각",
			},
			{
				wasteType: "배출 오염수",
				treatmentVolume: 22.5,
				treatmentMethod: "정화처리",
			},
		],
		totalEmissions: 198.6,
		lastUpdated: "2024-09-29",
	},
	{
		supplierId: "s4",
		purchasedProducts: {
			rawMaterialQuantity: 95.2,
			rawMaterialPCF: 1.9,
		},
		transportation: {
			distance: 150,
			cargoWeight: 6.8,
			transportMode: "트럭",
		},
		energy: {
			totalElectricityUsage: 28000,
			totalFuelUsage: 1200,
		},
		waste: [
			{
				wasteType: "일반폐기물",
				treatmentVolume: 4.2,
				treatmentMethod: "매립",
			},
			{
				wasteType: "배출 오염수",
				treatmentVolume: 8.5,
				treatmentMethod: "정화처리",
			},
		],
		totalEmissions: 75.3,
		lastUpdated: "2024-09-27",
	},
	{
		supplierId: "s5",
		purchasedProducts: {
			rawMaterialQuantity: 67.8,
			rawMaterialPCF: 1.5,
		},
		transportation: {
			distance: 120,
			cargoWeight: 4.2,
			transportMode: "트럭",
		},
		energy: {
			totalElectricityUsage: 19000,
			totalFuelUsage: 850,
		},
		waste: [
			{
				wasteType: "일반폐기물",
				treatmentVolume: 2.8,
				treatmentMethod: "소각",
			},
			{
				wasteType: "배출 오염수",
				treatmentVolume: 5.2,
				treatmentMethod: "정화처리",
			},
		],
		totalEmissions: 52.1,
		lastUpdated: "2024-09-26",
	},
	{
		supplierId: "s6",
		purchasedProducts: {
			rawMaterialQuantity: 180.3,
			rawMaterialPCF: 2.1,
		},
		transportation: {
			distance: 280,
			cargoWeight: 15.6,
			transportMode: "철도",
		},
		energy: {
			totalElectricityUsage: 55000,
			totalFuelUsage: 3200,
		},
		waste: [
			{
				wasteType: "일반폐기물",
				treatmentVolume: 10.5,
				treatmentMethod: "소각",
			},
			{
				wasteType: "배출 오염수",
				treatmentVolume: 18.7,
				treatmentMethod: "정화처리",
			},
		],
		totalEmissions: 156.8,
		lastUpdated: "2024-09-25",
	},
];

// 목표 관리용 더미 데이터
import {
	AnnualTarget,
	CompanyTargetManagement,
	SeasonalWeights,
} from "@/types/target-types";

// 기본 계절 가중치
export const defaultSeasonalWeights: SeasonalWeights = {
	1: 1.3, // 1월 - 난방 (30% 증가)
	2: 1.2, // 2월 - 난방
	3: 1.1, // 3월 - 난방
	4: 0.9, // 4월 - 봄
	5: 0.9, // 5월 - 봄
	6: 1.2, // 6월 - 냉방 시작
	7: 1.4, // 7월 - 냉방 (40% 증가)
	8: 1.4, // 8월 - 냉방 (40% 증가)
	9: 1.1, // 9월 - 가을
	10: 0.9, // 10월 - 가을
	11: 1.2, // 11월 - 난방 시작
	12: 1.3, // 12월 - 난방
};

// 2025년 더미 연간 목표 (실제 배출량 목업 데이터 포함)
export const dummyAnnualTarget: AnnualTarget = {
	year: 2025,
	totalBudget: 1199.7,
	allocationMethod: "seasonal",
	quarterlyTargets: [
		// Q1: 1-3월 (난방 시즌) - actual: 98.5+95.2+102.8=296.5, budget: 103.6+103.6+103.6=310.8
		{ quarter: 1, budget: 0, actual: 296.5, remaining: 0 },
		// Q2: 4-6월 (봄-초여름) - actual: 95.1+98.8+102.4=296.3, budget: 86.3+86.3+86.3=258.9
		{ quarter: 2, budget: 0, actual: 296.3, remaining: 0 },
		// Q3: 7-9월 (냉방 시즌) - actual: 90+91+92=273, budget: 112.2+112.2+129.6=354.0
		{ quarter: 3, budget: 0, actual: 273, remaining: 0 },
		// Q4: 10-12월 (가을-난방) - actual: 0+0+0=0, budget: 97.8+97.8+80.4=276.0
		{ quarter: 4, budget: 0, actual: 0, remaining: 0 },
	],
	monthlyEmissions: [
		// Q1 - 난방 시즌 (1월: 1.3배, 2월: 1.2배, 3월: 1.1배 가중치)
		{ year: 2025, month: 1, actual: 98.5, budget: 0 },
		{ year: 2025, month: 2, actual: 95.2, budget: 0 },
		{ year: 2025, month: 3, actual: 102.8, budget: 0 },
		// Q2 - 봄/초여름 (4-5월: 0.9배, 6월: 1.2배 냉방 시작)
		{ year: 2025, month: 4, actual: 95.1, budget: 0 },
		{ year: 2025, month: 5, actual: 98.8, budget: 0 },
		{ year: 2025, month: 6, actual: 102.4, budget: 0 },
		// Q3 - 냉방 시즌 (7-8월: 1.4배, 9월: 1.1배)
		{ year: 2025, month: 7, actual: 90, budget: 0 },
		{ year: 2025, month: 8, actual: 91, budget: 0 },
		{ year: 2025, month: 9, actual: 92, budget: 0 },
		// Q4 - 가을/난방 (10월: 0.9배, 11월: 1.2배, 12월: 1.3배)
		{ year: 2025, month: 10, actual: 0, budget: 0 },
		{ year: 2025, month: 11, actual: 0, budget: 0 },
		{ year: 2025, month: 12, actual: 0, budget: 0 },
	],
	ytdActual: 865.8,
	ytdBudget: 0,
	ytdVariance: 0,
};
// export const dummyAnnualTarget: AnnualTarget = {
// 	year: 2025,
// 	totalBudget: 1199.7,
// 	allocationMethod: "seasonal",
// 	quarterlyTargets: [
// 		// Q1: 1-3월 (난방 시즌) - actual: 98.5+95.2+102.8=296.5, budget: 103.6+103.6+103.6=310.8
// 		{ quarter: 1, budget: 310.8, actual: 296.5, remaining: 14.3 },
// 		// Q2: 4-6월 (봄-초여름) - actual: 95.1+98.8+102.4=296.3, budget: 86.3+86.3+86.3=258.9
// 		{ quarter: 2, budget: 258.9, actual: 296.3, remaining: -37.4 },
// 		// Q3: 7-9월 (냉방 시즌) - actual: 90+91+92=273, budget: 112.2+112.2+129.6=354.0
// 		{ quarter: 3, budget: 354.0, actual: 273, remaining: 81.0 },
// 		// Q4: 10-12월 (가을-난방) - actual: 0+0+0=0, budget: 97.8+97.8+80.4=276.0
// 		{ quarter: 4, budget: 276.0, actual: 0, remaining: 276.0 },
// 	],
// 	monthlyEmissions: [
// 		// Q1 - 난방 시즌 (1월: 1.3배, 2월: 1.2배, 3월: 1.1배 가중치)
// 		{ year: 2025, month: 1, actual: 98.5, budget: 103.6 },
// 		{ year: 2025, month: 2, actual: 95.2, budget: 103.6 },
// 		{ year: 2025, month: 3, actual: 102.8, budget: 103.6 },
// 		// Q2 - 봄/초여름 (4-5월: 0.9배, 6월: 1.2배 냉방 시작)
// 		{ year: 2025, month: 4, actual: 95.1, budget: 86.3 },
// 		{ year: 2025, month: 5, actual: 98.8, budget: 86.3 },
// 		{ year: 2025, month: 6, actual: 102.4, budget: 86.3 },
// 		// Q3 - 냉방 시즌 (7-8월: 1.4배, 9월: 1.1배)
// 		{ year: 2025, month: 7, actual: 90, budget: 112.2 },
// 		{ year: 2025, month: 8, actual: 91, budget: 112.2 },
// 		{ year: 2025, month: 9, actual: 92, budget: 129.6 },
// 		// Q4 - 가을/난방 (10월: 0.9배, 11월: 1.2배, 12월: 1.3배)
// 		{ year: 2025, month: 10, actual: 0, budget: 97.8 },
// 		{ year: 2025, month: 11, actual: 0, budget: 97.8 },
// 		{ year: 2025, month: 12, actual: 0, budget: 80.4 },
// 	],
// 	ytdActual: 871.8,
// 	ytdBudget: 923.7,
// 	ytdVariance: 51.9,
// };

// 회사별 목표 관리 더미 데이터
export const dummyCompanyTargets: CompanyTargetManagement[] = [
	{
		companyId: "c1",
		companyName: "Acme Corp",
		targets: [dummyAnnualTarget],
		currentYear: 2025,
	},
];
