/**
 * 배출량 증감 데이터 인터페이스
 */
export interface EmissionCompareData {
	percent: number; // 증감률 (절대값)
	isIncrease: boolean; // 증가 여부
	current: number; // 현재 월 값
	previous: number; // 전달 월 값
	absoluteChange: number; // 절대 변화량
}

/**
 * 카테고리별 비교 키 매핑
 */
const CATEGORY_KEYS = {
	purchasedProducts: "rawMaterialQuantity",
	transportation: "distance",
	energy: "totalElectricityUsage",
	waste: "treatmentVolume",
} as const;

/**
 * 데이터에서 숫자 값을 안전하게 추출
 */
function extractNumber(value: unknown): number {
	if (typeof value === "number") return value;
	if (typeof value === "string") return Number(value);
	return 0;
}

/**
 * 카테고리에 해당하는 값 추출
 */
function extractCategoryValue(
	data: { [key: string]: string | number },
	key: string
): number {
	return extractNumber(data[key]);
}

/**
 * 배출량 증감을 계산하는 유틸 함수
 *
 * 각 카테고리별로 주요 수치를 비교하여 증감률을 계산합니다.
 *
 * @param currentMonthValues - 현재 월 데이터
 * @param previousMonthValues - 전달 월 데이터
 * @returns EmissionCompareData | null - 증감 데이터 또는 null (비교 불가능한 경우)
 
 */
export function calculateEmissionCompare(
	currentMonthValues?: { [key: string]: string | number },
	previousMonthValues?: { [key: string]: string | number }
): EmissionCompareData | null {
	// 유효성 검사
	if (!currentMonthValues || !previousMonthValues) {
		return null;
	}

	// 카테고리 키 순회하여 값 찾기
	let currentTotal = 0;
	let previousTotal = 0;

	for (const key of Object.values(CATEGORY_KEYS)) {
		if (currentMonthValues[key] && previousMonthValues[key]) {
			currentTotal = extractCategoryValue(currentMonthValues, key);
			previousTotal = extractCategoryValue(previousMonthValues, key);
			break;
		}
	}

	// 이전 값이 0이면 비교 불가
	if (previousTotal === 0) {
		return null;
	}

	// 증감 계산
	const absoluteChange = currentTotal - previousTotal;
	const changePercent = (absoluteChange / previousTotal) * 100;

	return {
		percent: Math.abs(changePercent),
		isIncrease: changePercent > 0,
		current: currentTotal,
		previous: previousTotal,
		absoluteChange,
	};
}

/**
 * 여러 카테고리의 배출량 증감을 한번에 계산
 *
 * @param categories - 카테고리별 현재/이전 데이터
 * @returns 카테고리별 증감 데이터
 *
 * @example
 * const results = calculateMultipleEmissionCompares({
 *   purchasedProducts: {
 *     current: { rawMaterialQuantity: 100 },
 *     previous: { rawMaterialQuantity: 85 }
 *   }
 * });
 */
export function calculateMultipleEmissionCompares(categories: {
	[key: string]: {
		current: { [key: string]: string | number };
		previous: { [key: string]: string | number };
	};
}): { [key: string]: EmissionCompareData | null } {
	const results: { [key: string]: EmissionCompareData | null } = {};

	for (const [categoryName, data] of Object.entries(categories)) {
		results[categoryName] = calculateEmissionCompare(
			data.current,
			data.previous
		);
	}

	return results;
}
