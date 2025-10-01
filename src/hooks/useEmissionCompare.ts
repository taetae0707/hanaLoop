import { useMemo } from "react";
import {
	calculateEmissionCompare,
	EmissionCompareData,
} from "@/utils/calculateEmissionCompare";

/**
 * 배출량 비교 파라미터 인터페이스
 */
export interface EmissionCompareParams {
	currentMonthValues?: { [key: string]: string | number };
	previousMonthValues?: { [key: string]: string | number };
}

/**
 * 배출량 증감을 계산하는 커스텀 훅
 *
 * 각 카테고리별로 주요 수치를 비교하여 증감률을 계산합니다.
 * useMemo를 사용하여 불필요한 재계산을 방지합니다.
 *
 * @param params - 현재 월과 전달 월 데이터
 * @returns EmissionCompareData | null - 증감 데이터 또는 null (비교 불가능한 경우)

 */
export function useEmissionCompare({
	currentMonthValues,
	previousMonthValues,
}: EmissionCompareParams): EmissionCompareData | null {
	return useMemo(
		() => calculateEmissionCompare(currentMonthValues, previousMonthValues),
		[currentMonthValues, previousMonthValues]
	);
}

// EmissionCompareData 타입 재export
export type { EmissionCompareData } from "@/utils/calculateEmissionCompare";
